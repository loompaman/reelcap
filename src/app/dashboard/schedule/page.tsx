'use client';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/DashboardLayout';

export default function SchedulePage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-medium">Content Calendar</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="text-gray-500">
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button className="text-gray-500">
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
            <span className="text-gray-900">February 2025</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-xl p-4">
          {/* Days of Week */}
          <div className="grid grid-cols-7 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-gray-500 text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {Array(35).fill(0).map((_, i) => {
              const day = i - 3; // Adjust starting day
              return (
                <div 
                  key={i}
                  className={`aspect-square p-2 rounded-lg ${
                    day > 0 && day <= 31 ? 'hover:bg-gray-50' : 'text-gray-300'
                  }`}
                >
                  {day > 0 && day <= 31 ? day : ''}
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty State Message */}
        <div className="mt-8 bg-white rounded-xl p-8 text-center">
          <h2 className="text-lg font-medium mb-2">You have no scheduled videos</h2>
          <p className="text-gray-500 mb-4">You can schedule posts in your &quot;My Videos&quot; page</p>
          <button className="text-blue-600 font-medium">
            Go to My Videos
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
} 