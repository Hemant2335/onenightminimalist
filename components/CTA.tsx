"use client";

import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="bg-white py-20">
      <div className="section-container">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-12 md:p-16 text-center animate-slide-up">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Icon Grid */}
            <div className="flex justify-center items-center space-x-4 mb-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="w-6 h-6 bg-primary-200 rounded"></div>
                </div>
              ))}
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-dark">
              Empowering Top Companies with{" "}
              <span className="gradient-text">Seamless Integrations</span>
            </h2>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Adapt to the strategic execution that enables seamless integration, evolve the real-time tracking and time-zones across worldwide business towards greater success.
            </p>

            <button className="btn-primary inline-flex items-center space-x-2 group">
              <span>Work With Us</span>
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="gradient-bg rounded-3xl p-12 md:p-16 text-center mt-12 animate-slide-up animation-delay-200">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            From Idea to Production in Days
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Transform your product ideas into reality with our streamlined processes and expert guidance.
          </p>
          <button className="btn-outline">More Details</button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
