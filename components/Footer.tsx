"use client";

import { Twitter, Linkedin, Youtube, Facebook } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Company: ["About Us", "Our Team", "Careers", "Events"],
    Industries: [
      "Precision Manufacturing",
      "Industrial Automation",
      "Aerospace",
    ],
    Products: [
      "Manufacturing Execution System",
      "Enterprise Resource Planning",
      "Quality Management System",
      "Supply Chain Planning",
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "#" },
    { icon: Linkedin, href: "#" },
    { icon: Youtube, href: "#" },
    { icon: Facebook, href: "#" },
  ];

  return (
    <footer className="bg-[#111111] border-t border-[#C9D6DF]/10 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-[#C9D6DF]/20 rounded-lg flex items-center justify-center border border-[#C9D6DF]/30">
                <span className="text-[#C9D6DF] font-bold text-lg">E</span>
              </div>
              <span className="text-[#F0F5F9] font-bold text-xl">EventHub</span>
            </div>
            <p className="text-[#C9D6DF]/60 text-sm leading-relaxed max-w-md">
              Connecting people through unforgettable events. Discover, book, and experience the best events in your area.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#F0F5F9] font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/"
                  className="text-[#C9D6DF]/60 hover:text-[#C9D6DF] transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/events"
                  className="text-[#C9D6DF]/60 hover:text-[#C9D6DF] transition-colors"
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-[#C9D6DF]/60 hover:text-[#C9D6DF] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[#F0F5F9] font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-[#C9D6DF]/60 hover:text-[#C9D6DF] transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#C9D6DF]/60 hover:text-[#C9D6DF] transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#C9D6DF]/60 hover:text-[#C9D6DF] transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#C9D6DF]/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#C9D6DF]/40 text-sm">
              &copy; 2025 EventHub. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[#C9D6DF]/40 text-sm">Made with</span>
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="text-[#C9D6DF]/40 text-sm">for event lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
