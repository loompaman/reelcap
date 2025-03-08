import { PlayIcon, BoltIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

export default function HowItWorks() {
  const steps = [
    {
      icon: PlayIcon,
      title: "Tell us about your business",
      description: "Describe your content needs and target audience."
    },
    {
      icon: BoltIcon,
      title: "Our AI gets to work",
      description: "Our AI creates multiple meme options based on current trends."
    },
    {
      icon: CheckCircleIcon,
      title: "Export and Publish",
      description: "Select your favorite memes and publish directly to your platforms."
    }
  ];

  return (
    <section id="product" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          How It Works
        </h2>
        
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-6">
                <step.icon className="w-12 h-12 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 