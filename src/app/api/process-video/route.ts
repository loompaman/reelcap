import { exec } from 'child_process';
import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import os from 'os';

export async function POST(req: Request) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'video-'));
  
  try {
    console.log('Processing video request...');
    const data = await req.formData();
    const file1 = data.get('avatar') as File;
    const file2 = data.get('demo') as File;
    const text = data.get('text') as string;
    const textPosition = data.get('textPosition') as string;
    const textFormat = data.get('textFormat') as string;

    // Calculate text y-position
    const yPos = textPosition === 'top' ? 'h*0.1' : 
                textPosition === 'middle' ? 'h*0.5' : 
                'h*0.9';

    // Get text style based on format
    const getTextStyle = () => {
      switch (textFormat) {
        case 'highlighted':
          return ':box=1:boxcolor=black@0.3:boxborderw=5';
        case 'bold':
          return ':fontsize=30:fontweight=bold';
        case 'outlined':
          return ':borderw=2:bordercolor=black';
        default:
          return '';
      }
    };

    const textStyle = getTextStyle();

    // Escape special characters in text
    const escapedText = text.replace(/[\\'"]/g, '\\$&');

    const input1Path = path.join(tempDir, 'input1.mp4');
    const input2Path = path.join(tempDir, 'input2.mp4');
    const outputPath = path.join(tempDir, 'output.mp4');

    // Write avatar video
    console.log('Writing avatar video...');
    await fs.writeFile(input1Path, Buffer.from(await file1.arrayBuffer()));

    let command;
    if (file2 && file2.size > 0) {
      // Write demo video
      console.log('Writing demo video...');
      await fs.writeFile(input2Path, Buffer.from(await file2.arrayBuffer()));
      
      // First, normalize the videos to have the same dimensions and framerate
      command = `ffmpeg -i "${input1Path}" -i "${input2Path}" \
        -filter_complex "\
        [0:v]crop=ih*(9/16):ih,scale=1080:1920,setsar=1:1,fps=30[v0]; \
        [1:v]crop=ih*(9/16):ih,scale=1080:1920,setsar=1:1,fps=30[v1]; \
        [v0]drawtext=text='${escapedText}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=${yPos}-text_h/2${textStyle}[v0t]; \
        [v0t][v1]concat=n=2:v=1[outv]" \
        -map "[outv]" \
        -crf 21 \
        "${outputPath}"`;

      console.log('Using crop and concat command:', command);
    } else {
      command = `ffmpeg -i "${input1Path}" \
        -vf "crop=ih*(9/16):ih,scale=1080:1920,setsar=1:1,\
        drawtext=text='${escapedText}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=${yPos}-text_h/2${textStyle}" \
        -crf 21 \
        "${outputPath}"`;
      console.log('Using single file command:', command);
    }

    // Execute FFmpeg
    console.log('Executing FFmpeg command...');
    await new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('FFmpeg error:', error);
          console.error('FFmpeg stderr:', stderr);
          reject(error);
        } else {
          console.log('FFmpeg stdout:', stdout);
          resolve(stdout);
        }
      });
    });

    // Verify output file exists and has content
    const stats = await fs.stat(outputPath);
    console.log('Output file size:', stats.size);

    const outputBuffer = await fs.readFile(outputPath);
    console.log('Output buffer size:', outputBuffer.length);

    return new NextResponse(outputBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': 'attachment; filename="combined-video.mp4"'
      }
    });

  } catch (error) {
    console.error('Error in video processing:', error);
    return NextResponse.json({ 
      error: 'Failed to process video',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    // Cleanup temp directory
    try {
      await fs.rm(tempDir, { recursive: true });
      console.log('Cleaned up temp directory');
    } catch (error) {
      console.error('Error cleaning up:', error);
    }
  }
} 