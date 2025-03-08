'use client';
import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusIcon, VideoCameraIcon, CalendarIcon, ChartBarIcon, QuestionMarkCircleIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#f5f5f5] border-r border-gray-200">
        {/* Navigation */}
        <div className="flex flex-col h-full">
          {/* Top Section */}
          <div className="p-4 space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-black rounded p-1">
                <Image
                  src="/leaf-logo.svg"
                  alt="ReelCap"
                  width={20}
                  height={20}
                  className="w-5 h-5 invert"
                />
              </div>
              <span className="font-medium">ReelCap</span>
            </div>

            {/* Create Button */}
            <button 
              onClick={() => router.push('/dashboard')}
              className="flex items-center justify-center gap-2 bg-[#0066FF] hover:bg-[#0052CC] transition-colors text-white px-4 py-2.5 rounded-xl w-full"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Create</span>
            </button>
          </div>

          {/* Main Navigation - positioned with margin */}
          <div className="mt-1">
            <Link 
              href="/dashboard/videos" 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-black hover:font-medium transition-all"
            >
              <VideoCameraIcon className="w-5 h-5" />
              <span>Videos</span>
            </Link>

            <Link 
              href="/dashboard/schedule" 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-black hover:font-medium transition-all"
            >
              <CalendarIcon className="w-5 h-5" />
              <span>Schedule</span>
            </Link>

            <Link 
              href="/dashboard/campaigns" 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-black hover:font-medium transition-all"
            >
              <ChartBarIcon className="w-5 h-5" />
              <span>Campaigns</span>
            </Link>
          </div>

          {/* Bottom Section */}
          <div className="mt-auto p-4 space-y-3">
            <Link 
              href="#" 
              className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 transition-colors px-4 py-2"
            >
              <QuestionMarkCircleIcon className="w-5 h-5" />
              <span className="text-gray-500">Support</span>
            </Link>

            <Link 
              href="#" 
              className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 transition-colors px-4 py-2"
            >
              <UserCircleIcon className="w-5 h-5" />
              <span className="text-gray-500">Account</span>
            </Link>

            {/* Credits Box */}
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-sm">0 video credits</div>
              <Link href="/pricing" className="text-sm text-blue-600">
                Upgrade
              </Link>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                <Image
                  src="/profile-pic.jpg"
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-medium">Liang Pan</div>
                <div className="text-xs text-gray-500">liangpann@gmail.com</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {children}
      </div>
    </div>
  );
} 