'use client';

import { useEffect, useState, useRef } from 'react';

export default function Stats() {
  const [counts, setCounts] = useState({ ventures: 0, capital: 0, studios: 0, events: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = {
      ventures: 100,
      capital: 1951,
      studios: 6,
      events: 50,
    };

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setCounts({
        ventures: Math.floor(targets.ventures * progress),
        capital: Math.floor(targets.capital * progress),
        studios: Math.floor(targets.studios * progress),
        events: Math.floor(targets.events * progress),
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">{counts.ventures}+</div>
            <div className="text-gray-600">Active Ventures</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">{counts.capital}+</div>
            <div className="text-gray-600">Capital Managed</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">{counts.studios}+</div>
            <div className="text-gray-600">Venture Studios</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">{counts.events}+</div>
            <div className="text-gray-600">Events Hosted</div>
          </div>
        </div>
      </div>
    </section>
  );
}