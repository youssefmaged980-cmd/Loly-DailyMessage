"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Message } from "@/types";
import { formatDateArabic } from "@/lib/date";
import { generateCardImage } from "@/lib/exportCard";
import FloralCorner from "@/components/FloralCorner";
import ThemeToggle from "@/components/ThemeToggle";
import FloatingEffects from "@/components/FloatingEffects";
import ReplySection from "@/components/ReplySection";

export default function ClientMessage({ initialMessage }: { initialMessage: Message | null }) {
  const [message] = useState<Message | null>(initialMessage);
  const [isDownloading, setIsDownloading] = useState(false);
  const messageRef = useRef<HTMLElement>(null);

  const downloadImage = async () => {
    if (!message || isDownloading) return;
    setIsDownloading(true);
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
    } finally {
      setIsDownloading(false);
    }
  };

  // Web Audio API magic chime
  const playMagicChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const notes = [880, 1108, 1320, 1760];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        const start = ctx.currentTime + i * 0.1;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.0, start);
        gain.gain.linearRampToValueAtTime(0.18, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
        osc.start(start);
        osc.stop(start + 0.55);
      });
    } catch (e) {
      console.log('Web Audio not supported', e);
    }
  };

  return (
    <>
      <FloatingEffects count={12} />

      <div className="w-full max-w-[680px] md:max-w-[780px] lg:max-w-[860px] mx-auto p-4 sm:p-6 md:p-10 flex flex-col items-center justify-center relative z-10 min-h-screen">

        <div className="w-full flex justify-between items-center mb-6">
          <Link
            href="/"
            className="font-markazi text-2xl text-wine hover:text-rose transition-colors flex items-center gap-2 drop-shadow-sm no-underline bg-card-bg/70 px-4 py-2 rounded-full border border-border-color backdrop-blur-sm shadow-sm"
          >
            &rarr; عودة للصفحة الرئيسية
          </Link>

          <ThemeToggle />
        </div>

        <main
          ref={messageRef}
          style={{ backgroundColor: 'var(--card-bg)' }}
          className="w-full rounded-[32px] pt-12 sm:pt-14 pb-24 sm:pb-32 px-4 sm:px-10 md:px-14 shadow-[var(--card-shadow)] border border-border-color text-center relative min-h-[260px] flex flex-col justify-center items-center gap-6 sm:gap-8 animate-fade-in-up transition-all duration-500 overflow-hidden group"
        >
          <FloralCorner className="floral-corner-tl opacity-50 group-hover:opacity-75 transition-opacity" />
          <FloralCorner className="floral-corner-tr opacity-50 group-hover:opacity-75 transition-opacity" />

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-rose to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-rose to-transparent opacity-50"></div>

          <div className="relative z-10 w-full mb-1 sm:mb-2 flex flex-col items-center">
            <h1 className="font-aref text-2xl sm:text-3xl md:text-4xl text-wine-deep dark:text-[#E0AAEF] dark:drop-shadow-[0_0_14px_rgba(224,170,239,0.85)] mb-2 drop-shadow-[0_0_12px_rgba(142,74,159,0.5)] relative inline-block font-bold">
              <span className="absolute -left-7 sm:-left-9 top-1/2 -translate-y-1/2 text-rose text-lg sm:text-xl opacity-75">❦</span>
              {message ? formatDateArabic(message.date) : ""}
              <span className="absolute -right-7 sm:-right-9 top-1/2 -translate-y-1/2 text-rose text-lg sm:text-xl opacity-75 flex scale-x-[-1]">❦</span>
            </h1>
          </div>

          <div className="w-full max-w-3xl mx-auto relative z-10 my-2">
            <div className="bg-gradient-to-br from-white/70 to-rose-pale/20 dark:from-[#261738]/70 dark:to-[#1E142B]/40 backdrop-blur-md border border-rose/30 dark:border-[#b99ae6]/20 rounded-[2rem] p-6 sm:p-10 shadow-[0_8px_32px_rgba(142,74,159,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden group/msg">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose/40 to-transparent"></div>
              
              {/* Decorative background elements inside message box */}
              <div className="absolute -top-6 -right-6 text-6xl opacity-10 rotate-12 group-hover/msg:rotate-45 transition-transform duration-700">🌸</div>
              <div className="absolute -bottom-6 -left-6 text-6xl opacity-10 -rotate-12 group-hover/msg:-rotate-45 transition-transform duration-700">🦋</div>

              {/* Show description if exists - styled as archive pill */}
              {message?.description && (
                <div className="w-full flex justify-center mb-6 relative z-10">
                  <span className="inline-flex items-center gap-2 bg-gradient-to-r from-wine via-[#74359D] to-wine-deep dark:from-wine dark:via-[#7A3EAA] dark:to-wine-deep text-white px-6 py-2.5 rounded-full font-markazi text-xl sm:text-2xl font-bold shadow-[0_4px_15px_rgba(142,74,159,0.5)] dark:shadow-[0_4px_18px_rgba(185,154,230,0.35)] border border-white/20 hover:scale-105 transition-transform">
                    <span className="animate-pulse">✨</span>
                    <span>{message.description}</span>
                    <span className="animate-pulse">✨</span>
                  </span>
                </div>
              )}
              
              <div className="text-xl sm:text-2xl md:text-3xl leading-[2] sm:leading-[2.2] text-wine-deep dark:text-[#F8F4FF] font-semibold relative z-10 transition-opacity duration-500 break-words w-full max-w-full whitespace-pre-wrap">
                {message ? message.message : "لم يتم العثور على هذه الرسالة أو أنها لم تُنشر بعد."}
              </div>
            </div>
          </div>

          {message && message.id !== 'error' && (
            <>
              <div className="relative z-10 mt-4" data-html2canvas-ignore="true">
                <button
                  onClick={() => { playMagicChime(); downloadImage(); }}
                  disabled={isDownloading}
                  className="bg-gradient-to-r from-wine to-wine-deep text-white border-none py-3 px-6 sm:px-8 rounded-full font-markazi text-xl sm:text-2xl cursor-pointer inline-flex items-center gap-2.5 sm:gap-3 transition-all duration-300 shadow-[0_0_20px_rgba(142,74,159,0.4)] hover:shadow-[0_0_30px_rgba(142,74,159,0.6)] hover:-translate-y-1 active:scale-95 group-hover:scale-105 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-white shrink-0">
                    <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                  </svg>
                  <span>{isDownloading ? "جاري تحضير الرسالة..." : "نزلي الرسالة عندك يا عيوني لو حابة"}</span>
                </button>
              </div>

              <div className="w-full relative z-10" data-html2canvas-ignore="true">
                <ReplySection message={message} />
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}