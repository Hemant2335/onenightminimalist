'use client';

import { useState } from 'react';

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      name: 'Starter',
      description: 'The tools you need to have launched your start up for',
      price: '$39',
      period: '/month',
      features: [
        'Production up to 10 MVPs per month',
        'End-to-end user research',
        'Market validation support',
        'Email setup groups',
      ],
      buttonText: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Enterprise',
      description: 'You can find it be for serious tech venture',
      price: '$99',
      period: '/month',
      features: [
        'Custom domain with web',
        'Advanced security features',
        'Collaborative features',
        'Advanced production support option',
      ],
      buttonText: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Professional',
      description: 'This plans is geared towards ventures who are an in scaling effort',
      price: 'Custom',
      period: '',
      features: [
        'Full venture studio support',
        'Dedicated account manager',
        'Priority technical assistance',
        'Custom integration solutions',
      ],
      buttonText: 'Get Started',
      highlighted: true,
    },
  ];

  return (
    <section className="py-20 bg-dark text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Tailored Plans for Your <br /> Venture Scale
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Flexible packages for soho, SME, to business scale
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {plans.slice(0, 2).map((plan, index) => (
            <div
              key={index}
              className="bg-dark-light border border-gray-700 rounded-2xl p-8 hover:border-primary transition-all"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className="text-5xl font-bold">{plan.price}</span>
                <span className="text-gray-400">{plan.period}</span>
              </div>

              <button className="w-full border-2 border-gray-600 hover:border-primary hover:bg-primary text-white py-3 rounded-lg font-semibold transition mb-6">
                {plan.buttonText}
              </button>

              <div className="text-sm text-gray-400 mb-4">What's included</div>

              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h3 className="text-3xl font-bold mb-3">{plans[2].name}</h3>
              <p className="text-white/90 mb-8">{plans[2].description}</p>
              
              <button className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105">
                {plans[2].buttonText}
              </button>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {plans[2].features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-left">
                    <svg className="w-5 h-5 text-white flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/90">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}