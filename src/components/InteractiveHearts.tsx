'use client';

import { useEffect, useRef } from 'react';

const EMOJIS = ['💖', '🌸', '💕', '✨', '🌹', '💝', '💗', '🌺'];

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  vx: number;
  vy: number;
  opacity: number;
  scale: number;
  el: HTMLDivElement;
}

export default function InteractiveHearts() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const nextId = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const animate = () => {
      particlesRef.current = particlesRef.current.filter(p => {
        p.vy -= 0.15; // float upward
        p.vx *= 0.97;
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.018;
        p.scale += 0.01;

        if (p.opacity <= 0) {
          p.el.remove();
          return false;
        }
        p.el.style.transform = `translate(${p.x}px, ${p.y}px) scale(${p.scale})`;
        p.el.style.opacity = String(Math.max(0, p.opacity));
        return true;
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    const spawnParticle = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Spawn 2-3 hearts per touch for richness
      const count = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.style.cssText = `
          position: absolute;
          left: 0; top: 0;
          font-size: ${16 + Math.random() * 14}px;
          pointer-events: none;
          user-select: none;
          z-index: 9999;
          will-change: transform, opacity;
        `;
        el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        container.appendChild(el);

        const angle = (Math.random() * Math.PI) - (Math.PI / 2) + (Math.random() - 0.5) * 1.5;
        const speed = 1.5 + Math.random() * 2;

        const p: Particle = {
          id: nextId.current++,
          x, y,
          emoji: el.textContent,
          vx: Math.cos(angle) * speed * 0.6,
          vy: Math.sin(angle) * speed - 2,
          opacity: 1,
          scale: 0.7 + Math.random() * 0.5,
          el,
        };
        el.style.transform = `translate(${x}px, ${y}px) scale(${p.scale})`;
        particlesRef.current.push(p);
      }
    };

    const handleTouch = (e: TouchEvent) => {
      Array.from(e.changedTouches).forEach(t => spawnParticle(t.clientX, t.clientY));
    };
    const handleClick = (e: MouseEvent) => {
      spawnParticle(e.clientX, e.clientY);
    };

    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('click', handleClick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      particlesRef.current.forEach(p => p.el.remove());
      particlesRef.current = [];
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden"
      aria-hidden="true"
    />
  );
}
