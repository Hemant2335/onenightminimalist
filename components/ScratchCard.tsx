'use client';

import React, { useRef, useState, useEffect } from 'react';

interface ScratchCardProps {
  children: React.ReactNode;
  onReveal?: () => void;
  scratchColor?: string;
  width?: number;
  height?: number;
}

const ScratchCard: React.FC<ScratchCardProps> = ({
  children,
  onReveal,
  scratchColor = '#FFD700', // Changed to gold color
  width = 300,
  height = 200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const [revealedPercentage, setRevealedPercentage] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Create gradient background for scratch surface
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, scratchColor);
    gradient.addColorStop(0.5, 'blue'); // Lighter gold
    gradient.addColorStop(1, scratchColor);

    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add metallic shine effect
    const shineGradient = ctx.createLinearGradient(0, 0, width, 0);
    shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    shineGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');

    ctx.fillStyle = shineGradient;
    ctx.fillRect(0, 0, width, height);

    // Add subtle texture/pattern with metallic look
    ctx.fillStyle = 'rgba(255, 215, 0, 0.1)'; // Gold tint
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 8 + 2;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add sparkle effects
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2 + 1;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add text hint with better styling
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch to Reveal', width / 2, height / 2 - 10);

    // Add subtitle
    ctx.font = '12px Arial';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillText('👆', width / 2, height / 2 + 15);
  }, [width, height, scratchColor]);

  const getEventPos = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use composite operation to erase with smoother effect
    ctx.globalCompositeOperation = 'destination-out';

    // Create multiple circles for smoother scratching effect
    const brushSize = isScratching ? 25 : 20; // Larger brush when actively scratching

    // Main brush
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();

    // Add some variation for more natural scratching
    if (isScratching) {
      // Add smaller circles around the main brush for texture
      for (let i = 0; i < 3; i++) {
        const offsetX = (Math.random() - 0.5) * 10;
        const offsetY = (Math.random() - 0.5) * 10;
        const size = Math.random() * 8 + 5;
        ctx.beginPath();
        ctx.arc(x + offsetX, y + offsetY, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Calculate revealed percentage with improved accuracy
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    // Sample every 4th pixel for better performance
    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    const sampleRatio = 16 / 4; // Since we're sampling every 16th byte but checking every 4th
    const percentage = (transparentPixels / (pixels.length / sampleRatio / 4)) * 100;
    setRevealedPercentage(percentage);

    // If more than 35% is revealed, consider it fully revealed with smooth transition
    if (percentage > 35 && !isRevealed) {
      setIsRevealed(true);

      // Smooth reveal animation
      const revealAnimation = () => {
        const currentAlpha = ctx.globalAlpha;
        if (currentAlpha > 0) {
          ctx.globalAlpha = Math.max(0, currentAlpha - 0.05);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          requestAnimationFrame(revealAnimation);
        } else {
          ctx.globalAlpha = 1;
          if (onReveal) {
            onReveal();
          }
        }
      };

      revealAnimation();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsScratching(true);
    const pos = getEventPos(e);
    scratch(pos.x, pos.y);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isScratching) {
      const pos = getEventPos(e);
      scratch(pos.x, pos.y);
    }
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsScratching(true);
    const pos = getEventPos(e);
    scratch(pos.x, pos.y);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isScratching) {
      const pos = getEventPos(e);
      scratch(pos.x, pos.y);
    }
  };

  const handleTouchEnd = () => {
    setIsScratching(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
      style={{
        width,
        height,
        boxShadow: isScratching
          ? '0 8px 25px rgba(255, 215, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          : '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Content underneath */}
      <div
        className="absolute inset-0 z-0 rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
        }}
      >
        {children}
      </div>

      {/* Scratch layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 touch-none cursor-grab active:cursor-grabbing rounded-xl transition-transform duration-200"
        style={{
          userSelect: 'none',
          transform: isScratching ? 'scale(1.02)' : 'scale(1)',
          borderRadius: '12px'
        }}
      />

      {/* Shine effect overlay */}
      <div
        className="absolute inset-0 z-5 pointer-events-none rounded-xl"
        style={{
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)',
          opacity: isScratching ? 0.3 : 0.1,
          transition: 'opacity 0.3s ease'
        }}
      />
    </div>
  );
};

export default ScratchCard;

