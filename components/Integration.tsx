'use client';

export default function Integration() {
  const floatingIcons = [
    { emoji: '📊', position: 'top-20 left-20', delay: '0s' },
    { emoji: '💡', position: 'top-32 right-32', delay: '0.5s' },
    { emoji: '🎯', position: 'bottom-32 left-32', delay: '1s' },
    { emoji: '🚀', position: 'top-40 right-20', delay: '1.5s' },
    { emoji: '💰', position: 'bottom-20 right-40', delay: '2s' },
    { emoji: '📈', position: 'top-1/2 left-1/4', delay: '2.5s' },
    { emoji: '🌟', position: 'bottom-40 left-1/3', delay: '3s' },
    { emoji: '🔗', position: 'top-1/3 right-1/4', delay: '0.8s' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Empowering Top Companies with Seamless Integrations
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                From startups to Fortune 500, we provide an easy-to-use venture platform through deep innovation in a tech-first culture complemented with an ecosystem or seamless collaboration across expertise.
              </p>
              <button className="bg-accent hover:bg-accent/90 text-gray-900 px-8 py-3 rounded-lg font-semibold transition transform hover:scale-105">
                Work With Us
              </button>
            </div>

            <div className="relative h-96 bg-gradient-to-br from-accent/20 to-primary/10 rounded-3xl">
              {floatingIcons.map((icon, index) => (
                <div
                  key={index}
                  className={`absolute ${icon.position} animate-float`}
                  style={{
                    animationDelay: icon.delay,
                  }}
                >
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-3xl transform hover:scale-110 transition-transform cursor-pointer">
                    {icon.emoji}
                  </div>
                </div>
              ))}
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center shadow-2xl">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
    </section>
  );
}