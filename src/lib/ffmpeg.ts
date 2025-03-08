import { FFmpeg } from '@ffmpeg/ffmpeg';

let ffmpeg: FFmpeg | null = null;

export async function getFFmpeg() {
  if (ffmpeg) {
    console.log('Returning existing FFmpeg instance');
    return ffmpeg;
  }

  console.log('Creating new FFmpeg instance');
  ffmpeg = new FFmpeg();

  console.log('Loading FFmpeg...');
  try {
    await ffmpeg.load({
      coreURL: 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/ffmpeg-core.js',
      wasmURL: 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/ffmpeg-core.wasm',
      workerURL: 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/ffmpeg-core.worker.js'
    });
    console.log('FFmpeg loaded successfully');
  } catch (error) {
    console.error('Failed to load FFmpeg:', error);
    ffmpeg = null;
    throw error;
  }

  return ffmpeg;
} 