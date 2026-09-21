'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface Props {
  message: string | null;
}

export default function MilestoneOverlay({ message }: Props) {
  useEffect(() => {
    if (!message) return;

    // Golden confetti burst for milestones
    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        ...opts,
        origin: { y: 0.6 },
        particleCount: Math.floor(200 * particleRatio),
      });
    };

    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#F6A5D6', '#FFD700', '#fff'] });
    fire(0.2,  { spread: 60, colors: ['#F9C88A', '#F6A5D6', '#E0AAEF'] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#FFD700', '#F6A5D6'] });
    fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#fff', '#F6A5D6'] });
    fire(0.1,  { spread: 120, startVelocity: 45, colors: ['#F9C88A', '#FFD700'] });
  }, [message]);

  if (!message) return null;

  return (
    <div className="w-full relative z-20 mb-6 animate-fade-in-up">
      <div className="rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(246,165,214,0.5)]"
           style={{ background: 'linear-gradient(135deg, #5A2780 0%, #3D1558 50%, #8B4D9E 100%)' }}>
        <div className="p-6 sm:p-8 text-center">
          <div className="text-4xl sm:text-5xl mb-3 animate-bounce">🏆</div>
          <p className="font-aref text-xl sm:text-2xl md:text-3xl text-[#F6A5D6] font-bold leading-relaxed"
             style={{ textShadow: '0 0 20px rgba(246,165,214,0.8), 0 0 40px rgba(246,165,214,0.4)' }}>
            {message}
          </p>
          <div className="flex justify-center gap-3 mt-5 text-2xl">
            {['💖','🌸','✨','🌹','💕'].map((e, i) => (
              <span key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.15}s` }}>{e}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
