'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 w-full flex justify-center px-4 pt-4 z-50">
      <nav className="backdrop-blur-xl bg-white/30 border border-white/20 rounded-2xl max-w-6xl w-full">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#111111]">
                <span className="font-bold text-base text-[#E3DBC8]">R</span>
              </div>
              <div>
                <div className="font-bold text-lg text-[#111111]">RISE</div>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <a href="#ventures" className="text-sm font-normal hover:text-gray-600 text-white transition-colors">
                Ventures
              </a>
              <a href="#events" className="text-sm font-normal hover:text-gray-600 text-white transition-colors">
                Events
              </a>
              <a href="#divisions" className="text-sm font-normal hover:text-gray-600 text-white transition-colors">
                Divisions
              </a>
              <a href="#contact" className="text-sm font-normal hover:text-gray-600 text-white transition-colors">
                Contact
              </a>
            </div>

            <button className="px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-[#111111] text-white ">
              Get Started
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}