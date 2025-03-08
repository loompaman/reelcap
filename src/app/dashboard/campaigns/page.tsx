'use client';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import DashboardLayout from '@/components/DashboardLayout';

export default function CampaignsPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center gap-2 mb-8">
          <h1 className="text-2xl font-medium">Ad Campaigns</h1>
          <QuestionMarkCircleIcon className="w-5 h-5 text-gray-400" />
        </div>

        {/* New Campaign Button */}
        <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
          <span className="text-xl">+</span>
          <span>New campaign</span>
        </button>
      </div>
    </DashboardLayout>
  );
} 