import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="pt-48 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
          Viral Gen Z Marketing At<br />Scale For Busy Founders
        </h1>
        
        <div className="flex justify-center space-x-8 mb-8">
          <Image src="/tiktok.svg" alt="TikTok" width={40} height={40} />
          <Image src="/instagram.svg" alt="Instagram" width={40} height={40} />
          <Image src="/shorts.svg" alt="YouTube Shorts" width={40} height={40} />
        </div>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create relevant gen z meme & short-form content at scale to help reach the
          audience that uses your product. All organic, zero ad spent needed.
        </p>

        <Link 
          href="/dashboard"
          className="inline-block bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full text-lg font-medium"
        >
          Get Started
        </Link>

        <p className="mt-4 text-sm text-gray-500">
          Start your free trial now. No credit card required.
        </p>
      </div>
    </section>
  );
} 