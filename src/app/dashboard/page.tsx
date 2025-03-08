'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/DashboardLayout';
import { getFFmpeg } from '@/lib/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export default function Dashboard() {
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(0);
  const [hookText, setHookText] = useState('');
  const [textPosition, setTextPosition] = useState<'top' | 'middle' | 'bottom'>('middle');
  const [textFormat, setTextFormat] = useState<'highlighted' | 'basic' | 'bold' | 'outlined'>('basic');
  const [selectedDemo, setSelectedDemo] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const avatarVideoRef = useRef<HTMLVideoElement>(null);
  const demoVideoRef = useRef<HTMLVideoElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [demos, setDemos] = useState([
    { id: 0, src: '/demo-1.mp4', thumbnail: null },
  ]);
  const [activeTab, setActiveTab] = useState<'templates' | 'ugc'>('templates');

  const sounds = [
    { id: 'no-sound', name: 'No Sound', icon: '×' },
    { id: 'champagne-coast', name: 'champagne coast' },
    { id: 'head-over-heels', name: 'head over heels' },
    { id: 'last-christmas', name: 'last christmas', file: '/sounds/last-christmas.mp3' },
    { id: 'hey-jude', name: 'hey jude' },
    { id: 'life-goes-on', name: 'life goes on' },
    { id: 'no1-party-anthem', name: 'no 1 party anthem' },
    { id: 'ride-lana', name: 'ride lana' },
    { id: 'like-him', name: 'like him' },
    { id: 'end-of-beginning', name: 'end of beginning' },
    { id: 'breathe-in-the-air', name: 'breathe in the air' },
    { id: 'divine-failure', name: 'divine failure' },
  ];

  const getTextPositionClass = () => {
    switch (textPosition) {
      case 'top': return 'top-8';
      case 'middle': return 'top-1/2 -translate-y-1/2';
      case 'bottom': return 'bottom-20';
      default: return 'top-1/2 -translate-y-1/2';
    }
  };

  const getTextStyle = () => {
    const styles = {
      highlighted: 'text-lg font-medium px-4 py-1 bg-black/30 text-white',
      basic: 'text-lg font-medium px-4 py-1 text-white',
      bold: 'text-xl font-bold px-4 py-1 bg-black/70 text-white',
      outlined: 'text-lg font-medium px-4 py-1 text-white [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]',
    };
    return styles[textFormat];
  };

  const handleTimeUpdate = () => {
    const avatarVideo = avatarVideoRef.current;
    const demoVideo = demoVideoRef.current;
    
    if (!avatarVideo) return;
    
    if (selectedDemo === null) {
      // Only show progress for avatar video
      setTotalDuration(avatarVideo.duration);
      setProgress((avatarVideo.currentTime / avatarVideo.duration) * 100);
    } else if (demoVideo) {
      // Show combined progress when demo is selected
      const totalDur = avatarVideo.duration + demoVideo.duration;
      setTotalDuration(totalDur);

      if (demoVideo.style.display === 'none') {
        setProgress((avatarVideo.currentTime / totalDur) * 100);
      } else {
        setProgress(((avatarVideo.duration + demoVideo.currentTime) / totalDur) * 100);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const timeToSeek = (percentage / 100) * totalDuration;

    const avatarVideo = avatarVideoRef.current;
    const demoVideo = demoVideoRef.current;
    
    if (!avatarVideo) return;

    if (selectedDemo === null) {
      // Seek only in avatar video when no demo is selected
      avatarVideo.currentTime = timeToSeek;
      avatarVideo.play();
    } else if (demoVideo) {
      const avatarDuration = avatarVideo.duration;

      if (timeToSeek <= avatarDuration) {
        // Seek in avatar video
        demoVideo.style.display = 'none';
        const textOverlay = document.getElementById('text-overlay');
        if (textOverlay) textOverlay.style.display = 'block';
        avatarVideo.currentTime = timeToSeek;
        avatarVideo.play();
      } else {
        // Seek in demo video
        demoVideo.style.display = 'block';
        const textOverlay = document.getElementById('text-overlay');
        if (textOverlay) textOverlay.style.display = 'none';
        demoVideo.currentTime = timeToSeek - avatarDuration;
        demoVideo.play();
      }
    }
  };

  const handleDemoSelection = (demoIndex: number | null) => {
    setSelectedDemo(demoIndex);
    
    // Reset video states when switching demos
    const avatarVideo = avatarVideoRef.current;
    const demoVideo = demoVideoRef.current;
    const textOverlay = document.getElementById('text-overlay');

    if (avatarVideo && demoVideo) {
      // Reset demo video
      demoVideo.pause();
      demoVideo.currentTime = 0;
      demoVideo.style.display = 'none';

      // Reset and restart avatar video
      avatarVideo.currentTime = 0;
      avatarVideo.play();

      // Show text overlay
      if (textOverlay) {
        textOverlay.style.display = 'block';
      }
    }
  };

  const combineVideos = async () => {
    setIsProcessing(true);
    try {
      console.log('Starting video process...');
      setLoadingStatus('Processing videos...');

      // Get video files
      console.log('Fetching videos...');
      const avatarResponse = await fetch('/avatar-1.mp4');
      const avatarVideo = await avatarResponse.blob();
      console.log('Avatar video size:', avatarVideo.size);

      // Always get demo video if selectedDemo is 0 (first demo)
      let demoVideo = null;
      if (selectedDemo === 0) {
        const demoResponse = await fetch('/demo-1.mp4');
        demoVideo = await demoResponse.blob();
        console.log('Demo video size:', demoVideo.size);
      }

      // Create form data
      console.log('Creating form data...');
      const formData = new FormData();
      formData.append('avatar', new File([avatarVideo], 'avatar.mp4', { type: 'video/mp4' }));
      
      // Only append demo if we have it
      if (demoVideo) {
        console.log('Adding demo video to form data');
        formData.append('demo', new File([demoVideo], 'demo.mp4', { type: 'video/mp4' }));
      }

      // Add text and position information
      formData.append('text', hookText || 'edit ur text here');
      formData.append('textPosition', textPosition);
      formData.append('textFormat', textFormat);

      // Add sound information
      formData.append('selectedSound', selectedSound || '');

      // Send to API
      console.log('Sending to API...');
      const response = await fetch('/api/process-video', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to process video');
      }

      // Download the file
      console.log('Processing response...');
      const blob = await response.blob();
      console.log('Response blob size:', blob.size);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'combined-video.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setLoadingStatus('');
    } catch (error) {
      console.error('Error:', error);
      setLoadingStatus('Error: ' + (error instanceof Error ? error.message : 'Failed to process video'));
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to get supported MIME type
  const getSupportedMimeType = () => {
    const types = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm;codecs=h264',
      'video/webm'
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    throw new Error('No supported video MIME type found');
  };

  const handleSoundSelect = (soundId: string | null) => {
    setSelectedSound(soundId);
    setIsSoundModalOpen(false);

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Just create the audio instance but don't play it yet
    if (soundId && soundId !== 'no-sound') {
      const sound = sounds.find(s => s.id === soundId);
      if (sound?.file) {
        const audio = new Audio(sound.file);
        audio.loop = true;
        audioRef.current = audio;
        
        // Reset and play both video and audio
        const avatarVideo = avatarVideoRef.current;
        if (avatarVideo) {
          avatarVideo.currentTime = 0;
          audio.currentTime = 0;
          avatarVideo.play();
          audio.play();
        }
      }
    } else {
      // If no sound is selected, just restart the video
      const avatarVideo = avatarVideoRef.current;
      if (avatarVideo) {
        avatarVideo.currentTime = 0;
        avatarVideo.play();
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const SoundModal = () => {
    if (!isSoundModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-[600px] max-h-[80vh] overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b">
            <h3 className="text-lg font-medium">Choose background music</h3>
            <button 
              onClick={() => setIsSoundModalOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6 grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
            {sounds.map((sound) => (
              <button
                key={sound.id}
                onClick={() => handleSoundSelect(sound.id === 'no-sound' ? null : sound.id)}
                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 ${
                  (sound.id === 'no-sound' && selectedSound === null) || selectedSound === sound.id
                    ? 'ring-2 ring-[#0066FF]'
                    : ''
                }`}
              >
                {sound.id === 'no-sound' ? (
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl text-gray-400">{sound.icon}</span>
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                )}
                <span className="text-sm">{sound.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const loadDemoThumbnails = async () => {
      try {
        console.log('Starting to load demo thumbnails...');
        const thumbnailPromises = demos.map(async (demo) => {
          console.log('Fetching thumbnail for:', demo.src);
          const response = await fetch(`/api/thumbnail?video=${demo.src}`);
          if (!response.ok) {
            const error = await response.json();
            console.error('Thumbnail API error:', error);
            throw new Error('Failed to load thumbnail');
          }
          const blob = await response.blob();
          console.log('Received thumbnail blob:', blob.size, 'bytes');
          return URL.createObjectURL(blob);
        });

        const thumbnailUrls = await Promise.all(thumbnailPromises);
        console.log('Generated thumbnail URLs:', thumbnailUrls);
        setDemos(prev => prev.map((demo, i) => ({
          ...demo,
          thumbnail: thumbnailUrls[i]
        })));
      } catch (error) {
        console.error('Error loading demo thumbnails:', error);
      }
    };

    loadDemoThumbnails();

    // Cleanup object URLs
    return () => {
      demos.forEach(demo => {
        if (demo.thumbnail) URL.revokeObjectURL(demo.thumbnail);
      });
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-2xl font-medium mb-6">Create UGC ads</h1>

        <div className="flex">
          {/* Left Section - Editor */}
          <div className="w-[1000px]">
            <div className="bg-[#f5f5f5] rounded-2xl p-6">
              {/* Hook Section */}
              <div className="text-base font-semibold text-gray-900 mb-3">1. Hook</div>
              <div className="mb-8">
                <div className="flex items-center gap-2">
                  <button className="text-gray-400">
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="edit ur text here"
                    value={hookText}
                    onChange={(e) => setHookText(e.target.value)}
                    className="flex-1 py-2.5 px-4 bg-white rounded-xl text-center text-[#0066FF]"
                  />
                  <button className="text-gray-400">
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Text Style Section */}
              <div className="text-base font-semibold text-gray-900 mb-3">2. Text Style</div>
              <div className="mb-8">
                <div className="flex gap-2">
                  <button
                    onClick={() => setTextFormat('basic')}
                    className={`px-4 py-2 rounded-lg ${
                      textFormat === 'basic' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'
                    }`}
                  >
                    Basic
                  </button>
                  <button
                    onClick={() => setTextFormat('outlined')}
                    className={`px-4 py-2 rounded-lg ${
                      textFormat === 'outlined' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'
                    }`}
                  >
                    Outlined
                  </button>
                  <button
                    onClick={() => setTextFormat('highlighted')}
                    className={`px-4 py-2 rounded-lg ${
                      textFormat === 'highlighted' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'
                    }`}
                  >
                    Highlighted
                  </button>
                  <button
                    onClick={() => setTextFormat('bold')}
                    className={`px-4 py-2 rounded-lg ${
                      textFormat === 'bold' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'
                    }`}
                  >
                    Bold
                  </button>
                </div>
              </div>

              {/* Avatar Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-base font-semibold text-gray-900">2. AI avatar</div>
                  
                  <div className="flex gap-4 text-sm">
                    <button 
                      onClick={() => setActiveTab('templates')}
                      className={activeTab === 'templates' ? 'text-gray-900' : 'text-gray-400'}
                    >
                      Templates
                    </button>
                    <button 
                      onClick={() => setActiveTab('ugc')}
                      className={activeTab === 'ugc' ? 'text-gray-900' : 'text-gray-400'}
                    >
                      My UGC
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <button>
                      <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    <span>1/0</span>
                    <button>
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {activeTab === 'templates' ? (
                  <div className="grid grid-cols-8 gap-2 mb-8 px-6">
                    {Array(20).fill(0).map((_, i) => (
                      <div 
                        key={i} 
                        className={`aspect-square bg-white rounded-lg overflow-hidden cursor-pointer ${
                          selectedAvatar === i ? 'ring-2 ring-[#0066FF]' : ''
                        }`}
                        onClick={() => setSelectedAvatar(i)}
                      >
                        {i === 0 || i === 1 ? (
                          <video
                            src={`/avatar-${i + 1}.mp4`}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                        ) : (
                          <Image
                            src={`/avatar-${i + 1}.jpg`}
                            alt={`Avatar ${i + 1}`}
                            width={20}
                            height={20}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center">
                    <button className="text-[#0066FF] text-lg font-medium flex items-center gap-2">
                      Create custom AI avatar
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Demos Section */}
              <div className="text-base font-semibold text-gray-900 mb-3">4. Demos</div>
              <div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDemoSelection(null)}
                    className={`h-16 px-4 border ${
                      selectedDemo === null ? 'border-[#0066FF]' : 'border-gray-200'
                    } rounded-lg flex flex-col items-center justify-center`}
                  >
                    <span className="text-xl text-gray-400">×</span>
                    <span className="text-xs text-gray-500">None</span>
                  </button>
                  
                  {demos.map((demo) => (
                    <div 
                      key={demo.id}
                      className={`h-16 w-16 bg-white rounded-lg overflow-hidden cursor-pointer relative ${
                        selectedDemo === demo.id ? 'ring-2 ring-[#0066FF]' : ''
                      }`}
                      onClick={() => handleDemoSelection(demo.id)}
                    >
                      {demo.thumbnail ? (
                        <Image
                          src={demo.thumbnail}
                          alt={`Demo ${demo.id + 1}`}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <video
                        ref={demo.id === 0 ? demoVideoRef : undefined}
                        id={`demo-video-${demo.id}`}
                        src={demo.src}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ display: 'none' }}
                        muted
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={() => {
                          if (demoVideoRef.current) demoVideoRef.current.style.display = 'none';
                          const textOverlay = document.getElementById('text-overlay');
                          if (textOverlay) textOverlay.style.display = 'block';
                          avatarVideoRef.current?.play();
                        }}
                      />
                    </div>
                  ))}

                  <button className="h-16 w-16 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-2xl text-gray-400">+</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Center the preview in remaining space */}
          <div className="flex-1 flex justify-center">
            {/* Right Section - Preview */}
            <div className="w-[400px]">
              <div className="bg-[#f5f5f5] rounded-2xl h-full overflow-hidden">
                <div className="aspect-[9/16] bg-[#d3d3d3] relative">
                  {(selectedAvatar === 0 || selectedAvatar === 1) && (
                    <>
                      <video
                        ref={avatarVideoRef}
                        key="avatar"
                        src={`/avatar-${selectedAvatar + 1}.mp4`}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop={selectedDemo === null}
                        muted
                        onTimeUpdate={handleTimeUpdate}
                        onPlay={() => {
                          if (audioRef.current) {
                            audioRef.current.currentTime = 0;
                            audioRef.current.play();
                          }
                        }}
                        onPause={() => {
                          if (audioRef.current) {
                            audioRef.current.pause();
                          }
                        }}
                        onEnded={() => {
                          if (selectedDemo === null) {
                            // When looping avatar video, stop current audio and restart
                            if (audioRef.current) {
                              // Stop current audio
                              audioRef.current.pause();
                              
                              // Create fresh audio instance
                              const sound = sounds.find(s => s.id === selectedSound);
                              if (sound?.file) {
                                const newAudio = new Audio(sound.file);
                                newAudio.loop = true;
                                audioRef.current = newAudio;
                                newAudio.play();
                              }
                            }
                            
                            // Then restart video
                            if (avatarVideoRef.current) {
                              avatarVideoRef.current.currentTime = 0;
                              avatarVideoRef.current.play();
                            }
                          } else {
                            // When transitioning to demo, pause audio
                            if (audioRef.current) {
                              audioRef.current.pause();
                            }
                            const demoVideo = demoVideoRef.current;
                            if (demoVideo) {
                              demoVideo.style.display = 'block';
                              const textOverlay = document.getElementById('text-overlay');
                              if (textOverlay) textOverlay.style.display = 'none';
                              demoVideo.play();
                            }
                          }
                        }}
                      />
                      {selectedDemo === 0 && (
                        <video
                          ref={demoVideoRef}
                          id="demo-video"
                          key="demo"
                          src="/demo-1.mp4"
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{ display: 'none' }}
                          muted
                          onTimeUpdate={handleTimeUpdate}
                          onEnded={() => {
                            if (demoVideoRef.current) demoVideoRef.current.style.display = 'none';
                            const textOverlay = document.getElementById('text-overlay');
                            if (textOverlay) textOverlay.style.display = 'block';
                            avatarVideoRef.current?.play();
                          }}
                        />
                      )}
                      <div 
                        id="text-overlay"
                        className={`absolute left-0 right-0 text-center ${getTextPositionClass()}`}
                      >
                        <div className={`${getTextStyle()} inline-block rounded`}>
                          {hookText || 'edit ur text here'}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div 
                        className="absolute bottom-16 left-4 right-4 h-1 bg-gray-200 rounded cursor-pointer"
                        onClick={handleSeek}
                      >
                        <div 
                          className="h-full bg-blue-600 rounded"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      
                      {/* Time Display */}
                      <div className="absolute bottom-20 left-4 text-xs text-white bg-black/50 px-2 py-1 rounded">
                        {Math.floor(progress * totalDuration / 100)}s
                      </div>
                    </>
                  )}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    <button 
                      onClick={() => setTextPosition('top')}
                      className={`w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[10px] ${
                        textPosition === 'top' ? 'bg-white' : 'bg-white/80'
                      }`}
                    >
                      ㅁ
                    </button>
                    <button 
                      onClick={() => setTextPosition('middle')}
                      className={`w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[10px] ${
                        textPosition === 'middle' ? 'bg-white' : 'bg-white/80'
                      }`}
                    >
                      ≡
                    </button>
                    <button 
                      onClick={() => setTextPosition('bottom')}
                      className={`w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[10px] ${
                        textPosition === 'bottom' ? 'bg-white' : 'bg-white/80'
                      }`}
                    >
                      ㅇ
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-col gap-3">
                    {/* Sound Icon and Label */}
                    <div className="flex gap-2">
                      {/* Sound Button */}
                      <button
                        onClick={() => setIsSoundModalOpen(true)}
                        className="flex-1 h-12 px-4 bg-white rounded-xl flex items-center gap-2"
                      >
                        {selectedSound ? (
                          <>
                            <div className="w-6 h-6 bg-black rounded-lg flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                              </svg>
                            </div>
                            <span className="text-sm truncate">
                              {sounds.find(s => s.id === selectedSound)?.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Image
                                src="/sound-icon.png"
                                alt="Sound"
                                width={12}
                                height={12}
                              />
                            </div>
                            <span className="text-sm">Sound</span>
                          </>
                        )}
                      </button>

                      {/* Subscription Required Button */}
                      <button className="flex-1 h-12 bg-[#d3d3d3] rounded-xl text-sm">
                        Subscription required to use
                      </button>
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={combineVideos}
                      disabled={isProcessing}
                      className={`w-full px-4 py-2.5 rounded-lg bg-[#0066FF] text-white text-sm font-medium 
                        flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors
                        ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {loadingStatus || 'Processing...'}
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download Video
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium">My Videos (0)</h2>
            <div className="flex items-center gap-2 text-gray-500">
              <button>
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <span>Page 1 of 0</span>
              <button>
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-[#f5f5f5] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
      <SoundModal />
    </DashboardLayout>
  );
} 