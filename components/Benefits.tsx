'use client';

import { useEffect, useState } from 'react';

export default function Benefits() {
  const [chartData, setChartData] = useState([
    { label: 'Q1', value: 0, target: 75 },
    { label: 'Q2', value: 0, target: 85 },
    { label: 'Q3', value: 0, target: 65 },
    { label: 'Q4', value: 0, target: 95 },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setChartData(prev =>
        prev.map(item => ({ ...item, value: item.target }))
      );
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const benefits = [
    {
      icon: '🎯',
      title: 'Boosting Quality with Tech',
      description: 'We enhance the quality of ventures through cutting-edge technology solutions and strategic implementation.',
    },
    {
      icon: '⚡',
      title: 'Optimization Production Process',
      description: 'Streamline operations through systematic workflows, automation, and performance tracking.',
    },
    {
      icon: '🚀',
      title: 'AI-Driven Production',
      description: 'Leverage artificial intelligence and automation for smarter decision-making and efficient capacity.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div>
            <div className="mb-8">
              <div className="inline-block bg-accent/20 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Key Projects
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-2xl font-bold text-gray-900">94%</div>
                <div className="flex gap-1">
                  <div className="w-2 h-8 bg-gray-300 rounded"></div>
                  <div className="w-2 h-12 bg-primary rounded"></div>
                  <div className="w-2 h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center text-2xl">
                    📊
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Success</div>
                    <div className="text-3xl font-bold text-gray-900">1951+</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Ventures <br /> completed
                </div>
              </div>

              <div className="flex items-end justify-between h-48 gap-3">
                {chartData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden" style={{ height: '180px' }}>
                      <div
                        className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-accent rounded-t-lg transition-all duration-1000 ease-out"
                        style={{ height: `${item.value}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-sm font-semibold text-gray-600">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Key Benefits of Our System for Your Business Efficiency
            </h2>
            <p className="text-gray-600 mb-8">
              Our experienced staff prioritizes safety, compliance, and technological integration
            </p>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center text-2xl">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}