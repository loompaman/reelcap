'use client';
// import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/DashboardLayout';

export default function VideosPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-medium">My Videos (0)</h1>
          <div className="flex items-center gap-2">
            <button className="text-gray-500">
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <span className="text-gray-500">Page 1 of 0</span>
            <button className="text-gray-500">
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grid of Video Placeholders */}
        <div className="grid grid-cols-6 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 aspect-[4/3]">
              {/* Empty placeholder */}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
} 