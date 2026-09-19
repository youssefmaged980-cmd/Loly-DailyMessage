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
      const msgLength = message.message?.length || 0;
      // Aggressive font scaling for long messages
      const fontSize = msgLength < 80 ? 30 : msgLength < 250 ? 24 : msgLength < 600 ? 19 : msgLength < 1200 ? 16 : 14;

      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: 1080px;
        z-index: -1;
        direction: rtl;
        background-color: #1F162B;
        border-radius: 32px;
        padding: 48px 60px;
        border: 1px solid rgba(185,154,230,0.3);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        box-sizing: border-box;
      `;

      const dateEl = document.createElement('div');
      dateEl.style.cssText = `
        color: #B99AE6;
        font-size: 24px;
        font-weight: bold;
        line-height: 1.5;
        width: 100%;
        text-align: center;
      `;
      dateEl.innerText = formatDateArabic(message.date);

      const dividerEl = document.createElement('div');
      dividerEl.style.cssText = `
        width: 60%;
        height: 1px;
        margin: 0 auto;
        background: linear-gradient(to right, transparent, rgba(185,154,230,0.5), transparent);
      `;

      const msgEl = document.createElement('div');
      msgEl.style.cssText = `
        color: #F8F5FF;
        font-size: ${fontSize}px;
        line-height: 1.7;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        word-break: normal;
        width: 100%;
        text-align: right;
        direction: rtl;
      `;
      msgEl.innerText = message.message || '';

      wrapper.appendChild(dateEl);
      wrapper.appendChild(dividerEl);
      wrapper.appendChild(msgEl);
      document.body.appendChild(wrapper);

      await new Promise(r => setTimeout(r, 150));

      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(wrapper, {
        cacheBust: true,
        pixelRatio: 2,
        width: 1080,
      });

      document.body.removeChild(wrapper);

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `laila-message.png`;
      link.click();
    } catch (err) {
      console.error('Image error:', err);
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
