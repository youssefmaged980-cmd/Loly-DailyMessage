"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";

interface Message {
  id: string;
  date: string;
  message: string;
}

export default function ClientMessage({ initialMessage }: { initialMessage: Message | null }) {
  const [message, setMessage] = useState<Message | null>(initialMessage);
  const messageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Generate flying petals and hearts
    createEffects();
  }, [initialMessage]);

  const createEffects = () => {
    const container = document.getElementById('effectsContainer');
    if (!container) return;
    container.innerHTML = '';

    const elementsCount = 15;
    const symbols = ['🌸', '💮', '🌺', '✨', '💕', '🌹'];

    for (let i = 0; i < elementsCount; i++) {
      const el = document.createElement('div');
      const isFalling = Math.random() > 0.5;
      const animationClass = isFalling ? 'animate-petal-fall' : 'animate-float-up';

      el.className = `absolute text-2xl opacity-50 ${animationClass} text-rose-pale select-none pointer-events-none`;
      el.innerText = symbols[Math.floor(Math.random() * symbols.length)];

      const leftPos = Math.random() * 100;
      const animDuration = 10 + Math.random() * 20;
      const delay = Math.random() * 15;
      const size = 0.5 + Math.random() * 1.5;

      el.style.left = `${leftPos}vw`;
      el.style.animationDuration = `${animDuration}s`;
      el.style.animationDelay = `-${delay}s`;
      el.style.transform = `scale(${size})`;

      container.appendChild(el);
    }
  };

  const downloadImage = async () => {
    if (!message) return;
    try {
      const canvas = document.createElement('canvas');
      const cardWidth = 900;
      const padding = 64;
      const textWidth = cardWidth - padding * 2;
      const ctx = canvas.getContext('2d')!;

      const dateText = formatDateArabic(message.date);
      const msgText = message.message || '';

      // Determine font size based on message length
      const msgLength = msgText.length;
      const fontSize = msgLength < 100 ? 36 : msgLength < 300 ? 28 : msgLength < 700 ? 22 : 18;

      // Helper: wrap text into lines
      const getLines = (text: string, font: string, maxWidth: number) => {
        ctx.font = font;
        const wordArr = text.split(' ');
        const lines: string[] = [];
        let current = '';
        for (const word of wordArr) {
          const test = current ? current + ' ' + word : word;
          if (ctx.measureText(test).width > maxWidth && current) {
            lines.push(current);
            current = word;
          } else {
            current = test;
          }
        }
        if (current) lines.push(current);
        return lines;
      };

      const dateFont = `bold 32px serif`;
      const msgFont = `${fontSize}px serif`;

      const dateLines = getLines(dateText, dateFont, textWidth);
      const msgLines = getLines(msgText, msgFont, textWidth);

      const lineHeightDate = 48;
      const lineHeightMsg = fontSize * 1.9;
      const topPad = 80;
      const bottomPad = 80;
      const dateSection = dateLines.length * lineHeightDate + 32;
      const msgSection = msgLines.length * lineHeightMsg;
      const cardHeight = topPad + dateSection + msgSection + bottomPad;

      canvas.width = cardWidth;
      canvas.height = Math.max(cardHeight, 500);

      // Background
      ctx.fillStyle = '#1F162B';
      ctx.beginPath();
      ctx.roundRect(0, 0, cardWidth, canvas.height, 40);
      ctx.fill();

      // Top gradient line
      const topGrad = ctx.createLinearGradient(cardWidth * 0.2, 0, cardWidth * 0.8, 0);
      topGrad.addColorStop(0, 'transparent');
      topGrad.addColorStop(0.5, 'rgba(185,154,230,0.6)');
      topGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = topGrad;
      ctx.fillRect(cardWidth * 0.2, 12, cardWidth * 0.6, 2);

      // Bottom gradient line
      const botGrad = ctx.createLinearGradient(cardWidth * 0.2, 0, cardWidth * 0.8, 0);
      botGrad.addColorStop(0, 'transparent');
      botGrad.addColorStop(0.5, 'rgba(185,154,230,0.6)');
      botGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = botGrad;
      ctx.fillRect(cardWidth * 0.2, canvas.height - 14, cardWidth * 0.6, 2);

      // Date text
      ctx.textAlign = 'center';
      ctx.direction = 'rtl';
      ctx.fillStyle = '#B99AE6';
      ctx.font = dateFont;
      let y = topPad;
      for (const line of dateLines) {
        ctx.fillText(line, cardWidth / 2, y);
        y += lineHeightDate;
      }

      // Divider
      y += 8;
      ctx.fillStyle = 'rgba(185,154,230,0.3)';
      ctx.fillRect(cardWidth * 0.3, y, cardWidth * 0.4, 1);
      y += 32;

      // Message text
      ctx.fillStyle = '#F8F5FF';
      ctx.font = msgFont;
      for (const line of msgLines) {
        ctx.fillText(line, cardWidth / 2, y);
        y += lineHeightMsg;
      }

      // Border
      ctx.strokeStyle = 'rgba(185,154,230,0.3)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(2, 2, cardWidth - 4, canvas.height - 4, 40);
      ctx.stroke();

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `laila-message-${message.date || 'archive'}.png`;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('حدث خطأ أثناء حفظ الصورة');
    }
  };


  const formatDateArabic = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ar-EG-u-nu-latn', options);
  };

  const FloralCorner = ({ className }: { className: string }) => (
    <svg viewBox="0 0 100 100" className={`floral-corner fill-rose ${className}`}>
      <path d="M 0,0 C 20,0 40,10 50,30 C 60,10 80,0 100,0 C 80,20 70,40 50,50 C 70,60 80,80 100,100 C 80,100 60,90 50,70 C 40,90 20,100 0,100 C 20,80 30,60 50,50 C 30,40 20,20 0,0 Z" />
    </svg>
  );

  return (
    <>
      <div id="effectsContainer" className="fixed top-0 left-0 w-screen h-screen overflow-hidden z-0 pointer-events-none"></div>

      <div className="w-full max-w-[650px] mx-auto p-6 md:p-10 flex flex-col items-center justify-center relative z-10 min-h-screen">

        <Link
          href="/"
          className="self-start mb-6 font-markazi text-2xl text-wine hover:text-rose transition-colors flex items-center gap-2 drop-shadow-sm no-underline bg-card-bg/50 px-4 py-2 rounded-full border border-border-color backdrop-blur-sm"
        >
          &rarr; عودة للصفحة الرئيسية
        </Link>

        {/* Message Card */}
        <main
          ref={messageRef}
          style={{ backgroundColor: 'var(--card-bg)' }}
          className="w-full rounded-[32px] py-14 px-8 shadow-[var(--card-shadow)] border border-border-color text-center relative min-h-[300px] flex flex-col justify-center items-center gap-8 animate-fade-in-up transition-all duration-500 overflow-hidden group"
        >
          {/* Decorative Corners */}
          <FloralCorner className="floral-corner-tl" />
          <FloralCorner className="floral-corner-tr" />
          <FloralCorner className="floral-corner-bl" />
          <FloralCorner className="floral-corner-br" />

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-rose to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-rose to-transparent opacity-50"></div>

          <div className="relative z-10 w-full mb-2 flex flex-col items-center">
            <h1 className="font-aref text-2xl md:text-4xl text-wine mb-2 drop-shadow-sm relative inline-block">
              <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-rose text-xl opacity-70">❦</span>
              {message ? formatDateArabic(message.date) : ""}
              <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-rose text-xl opacity-70 flex scale-x-[-1]">❦</span>
            </h1>
          </div>

          <div className="text-2xl md:text-3xl leading-[2] text-text-main font-semibold relative z-10 transition-opacity duration-500 px-4 md:px-12 break-words w-full max-w-full">
            {message?.message}
          </div>

          {message && message.id !== 'error' && (
            <div className="relative z-10 mt-4" data-html2canvas-ignore="true">
              <button
                onClick={downloadImage}
                className="bg-gradient-to-r from-wine to-wine-deep text-paper border-none py-3 px-8 rounded-full font-markazi text-2xl cursor-pointer inline-flex items-center gap-3 transition-all duration-300 shadow-[0_8px_20px_rgba(108,63,160,0.3)] hover:shadow-[0_10px_25px_rgba(108,63,160,0.5)] hover:-translate-y-1 group-hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current">
                  <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                </svg>
                نزلي الرسالة عندك يا عيوني لو حابة
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
