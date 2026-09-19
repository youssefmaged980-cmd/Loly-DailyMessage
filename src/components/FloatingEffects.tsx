"use client";

import { useEffect, useState } from "react";

interface FloatingItem {
  id: number;
  symbol: string;
  left: number;
  duration: number;
  delay: number;
  scale: number;
  isFalling: boolean;
}

const SYMBOLS = ["🌸", "💮", "🌺", "✨", "💕", "🌹"];

export default function FloatingEffects({ count = 12 }: { count?: number }) {
  const [items, setItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    const generated: FloatingItem[] = [];
    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        left: Math.random() * 100,
        duration: 10 + Math.random() * 20,
        delay: Math.random() * 15,
        scale: 0.5 + Math.random() * 1.5,
        isFalling: Math.random() > 0.5,
      });
    }
    setItems(generated);
  }, [count]);

  if (items.length === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen overflow-hidden z-0 pointer-events-none"
      aria-hidden="true"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={`absolute text-2xl opacity-50 ${
            item.isFalling ? "animate-petal-fall" : "animate-float-up"
          } text-rose-pale select-none pointer-events-none`}
          style={{
            left: `${item.left}vw`,
            animationDuration: `${item.duration}s`,
            animationDelay: `-${item.delay}s`,
            transform: `scale(${item.scale})`,
          }}
        >
          {item.symbol}
        </div>
      ))}
    </div>
  );
}
