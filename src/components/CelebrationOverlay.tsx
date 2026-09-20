'use client';

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { SpecialOccasion } from '@/lib/date';

export default function CelebrationOverlay({ occasion }: { occasion: SpecialOccasion | null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (occasion) {
      // Trigger full screen confetti when a special occasion is detected
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);

      return () => clearInterval(interval);
    }
  }, [occasion]);

  if (!mounted || !occasion) return null;

  return (
    <div className="w-full relative z-20 mb-8 animate-fade-in-up">
      <div className="p-1 rounded-3xl bg-gradient-to-r from-gold via-[#F6A5D6] to-gold" style={{ backgroundSize: '200% 200%', animation: 'gradient-xy 5s ease infinite' }}>
        <div className="bg-card-bg/95 backdrop-blur-md rounded-[22px] p-6 sm:p-8 text-center border-2 border-transparent shadow-[0_0_30px_rgba(246,165,214,0.4)]">
          <span className="text-4xl sm:text-5xl animate-bounce inline-block mb-4">🎉</span>
          <h2 className="font-aref text-2xl sm:text-3xl md:text-4xl text-wine-deep dark:text-[#F6A5D6] font-bold drop-shadow-sm dark:drop-shadow-[0_0_16px_rgba(246,165,214,0.9)] leading-relaxed">
            {occasion.message}
          </h2>
          <div className="flex justify-center gap-3 mt-6 text-2xl">
            <span className="animate-pulse">💖</span>
            <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>✨</span>
            <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>🌹</span>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradient-xy {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}} />
    </div>
  );
}
