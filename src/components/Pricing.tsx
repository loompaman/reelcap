export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "19",
      videos: "10",
      isPopular: false,
      features: [
        { text: "10 videos per month", enabled: true },
        { text: "All 50+ UGC avatars", enabled: true },
        { text: "Generate unlimited viral hooks", enabled: true },
        { text: "Create your own AI avatars", enabled: false },
        { text: "Publish to TikTok", enabled: false },
        { text: "Schedule/automate videos", enabled: false },
      ],
    },
    {
      name: "Growth",
      price: "49",
      videos: "50",
      isPopular: true,
      features: [
        { text: "50 videos per month", enabled: true },
        { text: "All 50+ UGC avatars", enabled: true },
        { text: "Generate unlimited viral hooks", enabled: true },
        { text: "Create your own AI avatars", enabled: true, subtext: "(100 images and 25 videos)" },
        { text: "Publish to TikTok", enabled: true },
        { text: "Schedule/automate videos", enabled: true },
      ],
    },
    {
      name: "Scale",
      price: "95",
      videos: "150",
      isPopular: false,
      features: [
        { text: "150 videos per month", enabled: true },
        { text: "All 50+ UGC avatars", enabled: true },
        { text: "Generate unlimited viral hooks", enabled: true },
        { text: "Create your own AI avatars", enabled: true, subtext: "(200 images and 50 videos)" },
        { text: "Publish to TikTok", enabled: true },
        { text: "Schedule/automate videos", enabled: true },
      ],
    },
  ];

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">
          Choose your plan
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative rounded-2xl p-8 bg-white ${
                plan.isPopular ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="flex justify-center items-baseline mb-2">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-gray-600 ml-1">/month</span>
                </div>
                <p className="text-gray-600">{plan.videos} videos per month</p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {feature.enabled ? (
                      <svg className="w-5 h-5 text-black mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    )}
                    <div>
                      <p className={feature.enabled ? 'text-black' : 'text-gray-400'}>
                        {feature.text}
                      </p>
                      {feature.subtext && (
                        <p className="text-sm text-gray-500">{feature.subtext}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-3 px-4 rounded-full text-center font-medium ${
                  plan.isPopular
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-white text-black ring-1 ring-gray-200 hover:bg-gray-50'
                }`}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 