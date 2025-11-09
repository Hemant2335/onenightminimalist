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
  scratchColor = '#C9D6DF',
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

    // Fill with scratch color
    ctx.fillStyle = scratchColor;
    ctx.fillRect(0, 0, width, height);

    // Add some texture/pattern
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    for (let i = 0; i < 50; i++) {
      ctx.fillRect(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 10,
        Math.random() * 10
      );
    }

    // Add text hint
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch to Reveal', width / 2, height / 2);
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

    // Use composite operation to erase
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Calculate revealed percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }
    const percentage = (transparentPixels / (pixels.length / 4)) * 100;
    setRevealedPercentage(percentage);

    // If more than 30% is revealed, consider it fully revealed
    if (percentage > 30 && !isRevealed) {
      setIsRevealed(true);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (onReveal) {
        onReveal();
      }
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
      className="relative"
      style={{ width, height }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Content underneath */}
      <div className="absolute inset-0 z-0">{children}</div>

      {/* Scratch layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 touch-none cursor-grab active:cursor-grabbing"
        style={{ userSelect: 'none' }}
      />
    </div>
  );
};

export default ScratchCard;

