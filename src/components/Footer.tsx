import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="bg-[#1a1a1a] rounded-lg p-2">
              <Image
                src="/leaf-logo.svg"
                alt="ReelGenerator"
                width={20}
                height={20}
                className="w-5 h-5 invert"
              />
            </div>
            <p className="text-gray-600 text-sm">
              ReelCap is your trend-spotting and all-in-one AI viral marketing companion.
            </p>
          </div>
          
          <div className="flex gap-8">
            <Link href="/blogs" className="text-gray-600 hover:text-gray-900">
              Blogs
            </Link>
            <Link href="/faq" className="text-gray-600 hover:text-gray-900">
              FAQ
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900">
              Terms & Conditions
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-600">
          © 2025 ReelCap, LLC. All Rights Reserved
        </div>
      </div>
    </footer>
  );
} 