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
    <footer className="bg-black text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">R</span>
                </div>
                <span className="text-white font-bold text-lg">RISE</span>
              </div>
              <p className="text-sm">
                Building The Future At The Intersection Of Tech, Capital And
                Culture
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Divisions</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Launch Pad
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Insights
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Connect
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Events</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Summit/Forum
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Academy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-500 transition-colors"
                  >
                    Entertainment
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Location</h4>
              <p className="text-sm">Dubai, UAE</p>
              <p className="text-sm mt-2">RISE Solutions FZ-CO</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 RISE Venture Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
