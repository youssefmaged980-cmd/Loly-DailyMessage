"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { generateCardImage } from "@/lib/exportCard";

interface Message {
  id: string;
  date: string;
  message: string;
}

export default function ClientMessage({ initialMessage }: { initialMessage: Message | null }) {
  const [message, setMessage] = useState<Message | null>(initialMessage);
  const [isDark, setIsDark] = useState<boolean>(true);
  const messageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const themeAttr = document.documentElement.getAttribute('data-theme');
    if (themeAttr === 'light') {
      setIsDark(false);
    } else if (themeAttr === 'dark') {
      setIsDark(true);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    createEffects();
  }, [initialMessage]);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    const themeName = nextDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeName);
    try {
      localStorage.setItem('theme', themeName);
    } catch (e) {}
  };

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
      const dataUrl = await generateCardImage({
        date: message.date,
        messageText: message.message,
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `laila-message-${message.date || 'today'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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

      <div className="w-full max-w-[680px] md:max-w-[780px] lg:max-w-[860px] mx-auto p-4 sm:p-6 md:p-10 flex flex-col items-center justify-center relative z-10 min-h-screen">

        <div className="w-full flex justify-between items-center mb-6">
          <Link
            href="/"
            className="font-markazi text-2xl text-wine hover:text-rose transition-colors flex items-center gap-2 drop-shadow-sm no-underline bg-card-bg/70 px-4 py-2 rounded-full border border-border-color backdrop-blur-sm shadow-sm"
          >
            &rarr; عودة للصفحة الرئيسية
          </Link>

          <button
            onClick={toggleTheme}
            className="bg-card-bg/70 border border-border-color p-2 rounded-full text-wine text-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-sm flex items-center justify-center w-11 h-11 backdrop-blur-sm"
            aria-label={isDark ? "التبديل إلى الوضع الصباحي" : "التبديل إلى الوضع الليلي"}
            title={isDark ? "التبديل إلى الوضع الصباحي (Light Mode) ☀️" : "التبديل إلى الوضع الليلي (Dark Mode) 🌙"}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>

        <main
          ref={messageRef}
          style={{ backgroundColor: 'var(--card-bg)' }}
          className="w-full rounded-[32px] pt-12 sm:pt-14 pb-10 px-6 sm:px-10 md:px-14 shadow-[var(--card-shadow)] border border-border-color text-center relative min-h-[260px] flex flex-col justify-center items-center gap-6 sm:gap-8 animate-fade-in-up transition-all duration-500 overflow-hidden group"
        >
          <FloralCorner className="floral-corner-tl opacity-50 group-hover:opacity-75 transition-opacity" />
          <FloralCorner className="floral-corner-tr opacity-50 group-hover:opacity-75 transition-opacity" />
          <FloralCorner className="floral-corner-bl opacity-50 group-hover:opacity-75 transition-opacity" />
          <FloralCorner className="floral-corner-br opacity-50 group-hover:opacity-75 transition-opacity" />

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-rose to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-rose to-transparent opacity-50"></div>

          <div className="relative z-10 w-full mb-1 sm:mb-2 flex flex-col items-center">
            <h1 className="font-aref text-2xl sm:text-3xl md:text-4xl text-wine-deep dark:text-[#F3ECFB] dark:drop-shadow-[0_0_12px_rgba(185,154,230,0.55)] mb-2 drop-shadow-sm relative inline-block">
              <span className="absolute -left-7 sm:-left-9 top-1/2 -translate-y-1/2 text-rose text-lg sm:text-xl opacity-75">❦</span>
              {message ? formatDateArabic(message.date) : ""}
              <span className="absolute -right-7 sm:-right-9 top-1/2 -translate-y-1/2 text-rose text-lg sm:text-xl opacity-75 flex scale-x-[-1]">❦</span>
            </h1>
          </div>

          <div className="text-xl sm:text-2xl md:text-3xl leading-[2] sm:leading-[2.2] text-text-main font-semibold relative z-10 transition-opacity duration-500 px-2 sm:px-6 md:px-10 break-words w-full max-w-full whitespace-pre-wrap">
            {message?.message}
          </div>

          {message && message.id !== 'error' && (
            <div className="relative z-10 mt-4" data-html2canvas-ignore="true">
              <button
                onClick={downloadImage}
                className="bg-gradient-to-r from-wine to-wine-deep text-white border-none py-3 px-6 sm:px-8 rounded-full font-markazi text-xl sm:text-2xl cursor-pointer inline-flex items-center gap-2.5 sm:gap-3 transition-all duration-300 shadow-[0_8px_20px_rgba(90,39,128,0.3)] hover:shadow-[0_10px_25px_rgba(90,39,128,0.5)] hover:-translate-y-1 active:scale-95 group-hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-white shrink-0">
                  <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                </svg>
                <span>نزلي الرسالة عندك يا عيوني لو حابة</span>
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}