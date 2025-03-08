import { exec } from 'child_process';
import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import os from 'os';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const videoPath = url.searchParams.get('video');
  
  console.log('Thumbnail request for video:', videoPath);
  
  if (!videoPath) {
    return NextResponse.json({ error: 'No video path provided' }, { status: 400 });
  }

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'thumb-'));
  const outputPath = path.join(tempDir, 'thumbnail.jpg');
  console.log('Using temp dir:', tempDir);

  try {
    // Use absolute path for the video
    const absoluteVideoPath = path.join(process.cwd(), 'public', videoPath);
    console.log('Absolute video path:', absoluteVideoPath);

    // Extract thumbnail from the first frame
    const command = `ffmpeg -i "${absoluteVideoPath}" -vf "select=eq(n\\,0)" -q:v 3 "${outputPath}"`;
    console.log('Running FFmpeg command:', command);
    
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

    const thumbnail = await fs.readFile(outputPath);
    console.log('Generated thumbnail size:', thumbnail.length, 'bytes');
    
    return new NextResponse(thumbnail, {
      headers: {
        'Content-Type': 'image/jpeg'
      }
    });
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return NextResponse.json({ 
      error: 'Failed to generate thumbnail',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await fs.rm(tempDir, { recursive: true });
  }
} 