import Image from 'next/image';
import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 text-center">
      <Image
        src="/logo.svg"
        alt="ReelCap"
        width={120}
        height={32}
        className="h-8 w-auto mx-auto mb-8"
      />
      
      <h2 className="text-4xl font-bold mb-4">
        Ready to go viral?
      </h2>
      
      <p className="text-xl text-gray-600 mb-2">
        Empowering Your Success with Cutting-Edge SaaS Solutions
      </p>
      <p className="text-xl text-gray-600 mb-8">
        Built for Scalability, Efficiency, and Growth.
      </p>

      <Link 
        href="/get-started"
        className="inline-block bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full text-lg font-medium"
      >
        Get Started
      </Link>
    </section>
  );
} 