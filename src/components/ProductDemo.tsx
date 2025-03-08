import Image from 'next/image';

export default function ProductDemo() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-100">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="/product-demo.png"
            alt="Reelify AI Dashboard"
            width={1200}
            height={800}
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
} 