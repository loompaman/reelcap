import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

export default function Comparison() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Alternatives are expensive.
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-red-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">UGC Agencies</h3>
              <XMarkIcon className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-gray-600">
              Expensive, $60-120 per video, anywhere between $4000 to $6000 a month.
            </p>
          </div>

          <div className="bg-red-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Doing it yourself</h3>
              <XMarkIcon className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-gray-600">
              Researching, planning, iterating, recording, editing, publishing, re-purposing
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">ReelFarm</h3>
              <CheckIcon className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-gray-600">
              Automatically creating & publishing videos to all platforms, for a monthly subscription
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 