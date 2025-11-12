"use client";

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ isOpen, onClose, children, title, size = 'md' }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-[#1E2022] border border-[#C9D6DF]/20 rounded-lg p-6 w-full ${sizeClasses[size]}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#F0F5F9]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#C9D6DF] hover:text-[#F0F5F9]"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
