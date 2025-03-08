'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleProductClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('product')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFAQClick = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed w-full bg-[#f5f5f5]/80 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-[#1a1a1a] rounded-lg p-2">
                <Image
                  src="/leaf-logo.svg"
                  alt="ReelGenerator"
                  width={20}
                  height={20}
                  className="w-5 h-5 invert"
                />
              </div>
              <span className="text-[#1a1a1a] text-xl font-medium">ReelCap</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-12">
            <div className="flex gap-8">
              <Link 
                href="#product" 
                className="text-[#666666] hover:text-[#1a1a1a]"
                onClick={handleProductClick}
              >
                Product
              </Link>
              <Link 
                href="#pricing" 
                className="text-[#666666] hover:text-[#1a1a1a]"
                onClick={handlePricingClick}
              >
                Pricing
              </Link>
              <Link 
                href="#faq" 
                className="text-[#666666] hover:text-[#1a1a1a]"
                onClick={handleFAQClick}
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 