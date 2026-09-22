"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Message, TimeTogether } from "@/types";
import { getEgyptTodayString, formatDateArabic, calculateTimeTogether, getSpecialOccasion, getTimeGreeting, getMilestoneMessage, SpecialOccasion } from "@/lib/date";
import { generateCardImage } from "@/lib/exportCard";
import FloralCorner from "@/components/FloralCorner";
import ThemeToggle from "@/components/ThemeToggle";
import FloatingEffects from "@/components/FloatingEffects";
import CelebrationOverlay from "@/components/CelebrationOverlay";
import MilestoneOverlay from "@/components/MilestoneOverlay";
import InteractiveHearts from "@/components/InteractiveHearts";
import { motion } from "framer-motion";

export default function ClientHome({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [timeTogether, setTimeTogether] = useState<TimeTogether | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [occasion, setOccasion] = useState<SpecialOccasion | null>(null);
  const [greeting, setGreeting] = useState<{ emoji: string; text: string } | null>(null);
  const [milestoneMsg, setMilestoneMsg] = useState<string | null>(null);
  const [randomMsg, setRandomMsg] = useState<Message | null>(null);
  const messageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Initial and periodic time counter calculation
    const updateTimer = () => {
      setTimeTogether(calculateTimeTogether("2024-02-25T00:00:00"));
    };
    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    setOccasion(getSpecialOccasion(new Date()));
    setGreeting(getTimeGreeting());

    // Filter messages up to Cairo today so future scheduled messages don't leak
    const todayString = getEgyptTodayString();
    const validMessages = initialMessages.filter((m: Message) => m.date <= todayString);
    setMessages(validMessages);

    if (validMessages.length > 0) {
      setCurrentMessage(validMessages[0]);
    } else {
      setCurrentMessage({
        id: 'fallback',
        date: todayString,
        message: "حبيبتي ليلى، حتى لو مفيش رسالة مكتوبة النهاردة، حبي ليكي بيكبر كل لحظة. بحبك دايماً ❤️"
      });
    }

    return () => clearInterval(timer);
  }, [initialMessages]);

  // Compute milestone after timeTogether is known
  useEffect(() => {
    if (!timeTogether) return;
    const days = parseInt(timeTogether.days, 10);
    setMilestoneMsg(getMilestoneMessage(days));
  }, [timeTogether]);

  const downloadImage = async () => {
    if (!currentMessage || isDownloading) return;
    setIsDownloading(true);
    try {
      const dataUrl = await generateCardImage({
        date: currentMessage.date,
        messageText: currentMessage.message,
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `laila-message-${currentMessage.date || "today"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("حدث خطأ أثناء حفظ الصورة");
    } finally {
      setIsDownloading(false);
    }
  };

  // Web Audio API magic chime - works on all mobile browsers without a file
  const playMagicChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const notes = [880, 1108, 1320, 1760]; // A5, C#6, E6, A6
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

  const pickRandomMessage = () => {
    const pool = messages.filter(m => m.id !== currentMessage?.id);
    if (pool.length === 0) return;
    setRandomMsg(pool[Math.floor(Math.random() * pool.length)]);
    playMagicChime();
  };

  const closeRandom = () => setRandomMsg(null);

  const todayStr = getEgyptTodayString();

  return (
    <>
      <ThemeToggle className="absolute top-5 left-5 z-50" />
      <FloatingEffects count={12} />
      <InteractiveHearts />

      {/* Random Message Modal */}
      {randomMsg && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={closeRandom}
        >
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" />
          {/* Sheet on mobile, centered card on desktop */}
          <div
            className="relative z-10 w-full sm:max-w-lg bg-card-bg sm:rounded-[28px] rounded-t-[28px] border border-rose/40 shadow-[0_0_60px_rgba(246,165,214,0.4)] animate-fade-in-up flex flex-col"
            style={{ maxHeight: '85dvh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header - sticky */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border-color/40 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💌</span>
                <p className="font-aref text-lg text-wine dark:text-[#E0AAEF] font-bold">
                  {formatDateArabic(randomMsg.date)}
                </p>
              </div>
              <button
                onClick={closeRandom}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-border-color/30 hover:bg-rose/20 text-text-muted hover:text-rose transition-all text-lg font-bold shrink-0"
                aria-label="إغلاق"
              >
                ✕
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-5 py-4 text-center">
              {randomMsg.title && (
                <div className="flex justify-center mb-4">
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-wine via-[#74359D] to-wine-deep text-white px-4 py-1.5 rounded-full font-markazi text-base sm:text-lg font-bold shadow-[0_0_15px_rgba(142,74,159,0.5)] border border-white/20">
                    <span>✨</span>
                    <span>{randomMsg.title}</span>
                  </span>
                </div>
              )}
              <p className="font-markazi text-xl sm:text-2xl text-text-main leading-relaxed whitespace-pre-wrap">
                {randomMsg.message}
              </p>
            </div>

            {/* Footer - sticky */}
            <div className="px-5 pb-6 pt-3 border-t border-border-color/40 shrink-0 flex justify-center">
              <button
                onClick={pickRandomMessage}
                className="bg-gradient-to-r from-wine to-wine-deep text-white px-7 py-2.5 rounded-full font-markazi text-xl font-bold shadow-[0_0_20px_rgba(142,74,159,0.5)] hover:shadow-[0_0_30px_rgba(142,74,159,0.7)] hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer"
              >
                🎲 ذكرى تانية
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-[680px] md:max-w-[780px] lg:max-w-[860px] mx-auto p-4 sm:p-6 md:p-10 flex flex-col gap-8 md:gap-10 relative z-10 min-h-screen">
        
        <CelebrationOverlay occasion={occasion} />
        <MilestoneOverlay message={milestoneMsg} />

        {/* Smart time greeting banner */}
        {greeting && (
          <div className="w-full flex justify-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/80 dark:bg-[#1E142B]/80 border border-rose/40 dark:border-rose/50 shadow-[0_4px_20px_rgba(142,74,159,0.35)] dark:shadow-[0_4px_20px_rgba(185,154,230,0.3)] backdrop-blur-md">
              <span className="text-xl">{greeting.emoji}</span>
              <span className="font-aref text-base sm:text-lg text-wine dark:text-[#F6A5D6] font-bold drop-shadow-[0_0_8px_rgba(142,74,159,0.5)] dark:drop-shadow-[0_0_10px_rgba(246,165,214,0.7)]">
                {greeting.text}
              </span>
            </div>
          </div>
        )}

        {/* Header Section */}
        <header className="flex flex-col items-center text-center gap-5 mt-4">
          <div className="relative group">
            {/* Decorative floral rings behind image */}
            <div className="absolute -inset-4 border-2 border-rose/30 rounded-full"></div>
            <div className="absolute -inset-2 border border-gold/40 rounded-full rotate-45"></div>

            <div className="w-[160px] h-[160px] md:w-[180px] md:h-[180px] rounded-full p-2 bg-gradient-to-tr from-wine via-rose to-gold shadow-[0_0_35px_rgba(142,74,159,0.5),0_10px_25px_rgba(74,42,112,0.3)] relative z-10 overflow-hidden group-hover:scale-105 transition-transform duration-500">
              <div className="w-full h-full rounded-full border-4 border-bg-color overflow-hidden bg-rose-pale relative flex items-center justify-center">
                {/* Fallback pattern just in case image doesn't load */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,204,245,0.4)_0%,transparent_100%)] flex items-center justify-center">
                  <span className="font-aref text-6xl text-wine opacity-40">L</span>
                </div>
                <img
                  src="/laila.jpg"
                  alt="ليلى"
                  className="w-full h-full object-cover rounded-full relative z-10 transition-transform duration-700 hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Floating flower icons near the image */}
            <div className="absolute -bottom-2 -right-4 text-3xl drop-shadow-md z-20">🌺</div>
            <div className="absolute top-4 -left-6 text-2xl drop-shadow-md z-20">💮</div>
            <div className="absolute -top-4 right-2 text-xl drop-shadow-md z-20 opacity-70">✨</div>
          </div>

          <div className="mt-6 animate-fade-in-up flex flex-col items-center">
            <h2 className="font-aref text-2xl md:text-3xl text-wine dark:text-[#F6A5D6] dark:drop-shadow-[0_0_16px_rgba(246,165,214,0.9)] mb-2 drop-shadow-[0_0_12px_rgba(142,74,159,0.5)] font-bold">
              رسايلك الجميلة الذيك يا حبيبي هنا
            </h2>
            <div className="font-cormorant italic text-gold text-xl md:text-2xl tracking-widest mt-1 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
              For my one and only Laila
            </div>

            <div className="mt-6 w-full border border-rose/30 rounded-3xl p-6 relative shadow-[var(--shadow)] transition-all duration-500 bg-card-bg/10 backdrop-blur-sm">
              {/* Title INSIDE the frame */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                <span className="font-aref text-2xl md:text-3xl text-wine dark:text-[#F9C88A] dark:drop-shadow-[0_0_14px_rgba(249,200,138,0.85)] drop-shadow-[0_0_12px_rgba(142,74,159,0.5)] text-center font-bold">
                  ايامنا الحلوة اللي عشناها سوا يا قلبي
                </span>
                <span className="text-rose text-2xl md:text-3xl animate-pulse drop-shadow-[0_0_8px_rgba(255,105,180,0.8)]">🌸</span>
              </div>

              <div className="flex flex-row gap-2 md:gap-4 mt-2 dir-ltr items-center justify-center relative z-0">
                {timeTogether && (
                  <>
                    <div className="flex flex-col items-center justify-center bg-card-bg/90 border border-rose/30 rounded-2xl w-[65px] h-[80px] md:w-20 md:h-24 shadow-[0_5px_15px_rgba(74,42,112,0.15)] backdrop-blur-md relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-b from-rose-pale/50 to-transparent"></div>
                      <span className="font-aref text-3xl md:text-4xl text-wine-deep dark:text-[#F6A5D6] font-bold counter-glow relative z-10">
                        {timeTogether.days}
                      </span>
                      <span className="font-markazi text-sm text-text-muted mt-1 relative z-10">يوم</span>
                    </div>
                    <span className="text-rose text-2xl font-bold animate-pulse mb-4">:</span>
                    <div className="flex flex-col items-center justify-center bg-card-bg/90 border border-rose/30 rounded-2xl w-[65px] h-[80px] md:w-20 md:h-24 shadow-[0_5px_15px_rgba(74,42,112,0.15)] backdrop-blur-md relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-b from-rose-pale/50 to-transparent"></div>
                      <span className="font-aref text-3xl md:text-4xl text-wine-deep dark:text-[#F6A5D6] font-bold counter-glow relative z-10">
                        {timeTogether.hours}
                      </span>
                      <span className="font-markazi text-sm text-text-muted mt-1 relative z-10">ساعة</span>
                    </div>
                    <span className="text-rose text-2xl font-bold animate-pulse mb-4">:</span>
                    <div className="flex flex-col items-center justify-center bg-card-bg/90 border border-rose/30 rounded-2xl w-[65px] h-[80px] md:w-20 md:h-24 shadow-[0_5px_15px_rgba(74,42,112,0.15)] backdrop-blur-md relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-b from-rose-pale/50 to-transparent"></div>
                      <span className="font-aref text-3xl md:text-4xl text-wine-deep dark:text-[#F6A5D6] font-bold counter-glow relative z-10">
                        {timeTogether.minutes}
                      </span>
                      <span className="font-markazi text-sm text-text-muted mt-1 relative z-10">دقيقة</span>
                    </div>
                    <span className="text-rose text-2xl font-bold animate-pulse mb-4">:</span>
                    <div className="flex flex-col items-center justify-center bg-card-bg/90 border border-rose/30 rounded-2xl w-[65px] h-[80px] md:w-20 md:h-24 shadow-[0_5px_15px_rgba(74,42,112,0.15)] backdrop-blur-md relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-b from-rose-pale/50 to-transparent"></div>
                      <span className="font-aref text-3xl md:text-4xl text-wine-deep dark:text-[#F6A5D6] font-bold counter-glow relative z-10">
                        {timeTogether.seconds}
                      </span>
                      <span className="font-markazi text-sm text-text-muted mt-1 relative z-10">ثانية</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Message Card */}
        <main
          ref={messageRef}
          style={{ backgroundColor: 'var(--card-bg)' }}
          className="rounded-[32px] pt-12 sm:pt-14 pb-10 px-6 sm:px-10 md:px-14 shadow-[var(--card-shadow)] border border-border-color text-center relative min-h-[260px] flex flex-col justify-center items-center gap-6 sm:gap-8 animate-fade-in-up transition-all duration-500 overflow-hidden group w-full"
        >
          {/* Decorative Corners */}
          <FloralCorner className="floral-corner-tl opacity-50 group-hover:opacity-75 transition-opacity" />
          <FloralCorner className="floral-corner-tr opacity-50 group-hover:opacity-75 transition-opacity" />
          <FloralCorner className="floral-corner-bl opacity-50 group-hover:opacity-75 transition-opacity" />
          <FloralCorner className="floral-corner-br opacity-50 group-hover:opacity-75 transition-opacity" />

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-rose to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-rose to-transparent opacity-50"></div>

          <div className="relative z-10 w-full mb-1 sm:mb-2 flex flex-col items-center">
            <h1 className="font-aref text-2xl sm:text-3xl md:text-4xl text-wine-deep dark:text-[#E0AAEF] dark:drop-shadow-[0_0_14px_rgba(224,170,239,0.85)] mb-2 drop-shadow-[0_0_12px_rgba(142,74,159,0.5)] relative inline-block font-bold">
              <span className="absolute -left-7 sm:-left-9 top-1/2 -translate-y-1/2 text-rose text-lg sm:text-xl opacity-75">❦</span>
              {currentMessage ? formatDateArabic(currentMessage.date) : formatDateArabic(todayStr)}
              <span className="absolute -right-7 sm:-right-9 top-1/2 -translate-y-1/2 text-rose text-lg sm:text-xl opacity-75 flex scale-x-[-1]">❦</span>
            </h1>
          </div>

          {/* Title inside card - pill style matching archive */}
          {currentMessage?.title && (
            <div className="relative z-10 w-full flex justify-center -mb-2">
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-wine via-[#74359D] to-wine-deep dark:from-wine dark:via-[#7A3EAA] dark:to-wine-deep text-white px-5 py-2 rounded-full font-markazi text-lg sm:text-xl font-bold shadow-[0_0_15px_rgba(142,74,159,0.5)] dark:shadow-[0_0_18px_rgba(185,154,230,0.35)] border border-white/20">
                <span>✨</span>
                <span>{currentMessage.title}</span>
              </span>
            </div>
          )}

          <div className="text-xl sm:text-2xl md:text-3xl leading-[2] sm:leading-[2.2] text-text-main font-semibold relative z-10 transition-opacity duration-500 px-2 sm:px-6 md:px-10 break-words w-full max-w-full whitespace-pre-wrap">
            {currentMessage?.message}
          </div>

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
        </main>

        {/* Archive Section */}
        <section className="mt-8 mb-12 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
            <h2 className="font-aref text-2xl sm:text-3xl text-wine dark:text-[#F8F4FF] drop-shadow-[0_0_10px_rgba(142,74,159,0.5)] dark:drop-shadow-[0_0_12px_rgba(255,182,217,0.7)] flex items-center gap-3">
              <span className="text-xl sm:text-2xl">📖</span> أرشيف الذكريات
            </h2>
            {messages.length > 1 && (
              <button
                onClick={pickRandomMessage}
                className="flex items-center gap-2 bg-gradient-to-r from-[#8B4D9E] to-[#5A2780] dark:from-[#F6A5D6]/20 dark:to-[#E0AAEF]/20 dark:border dark:border-rose/40 text-white dark:text-[#F6A5D6] px-4 py-2 rounded-full font-markazi text-lg font-bold shadow-[0_0_18px_rgba(142,74,159,0.45)] dark:shadow-[0_4px_15px_rgba(246,165,214,0.25)] hover:shadow-[0_0_28px_rgba(142,74,159,0.65)] hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <span className="text-base">💌</span>
                <span>وحشني كلامنا</span>
              </button>
            )}
          </div>

          <div className="flex justify-center mt-2 mb-7 sm:mb-8 px-1">
            <div className="inline-flex items-center justify-center gap-2 sm:gap-2.5 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white/90 dark:bg-[#1E142B]/90 border-2 border-rose/50 dark:border-rose/60 shadow-[0_0_22px_rgba(142,74,159,0.35),0_4px_15px_rgba(90,39,128,0.12),inset_0_0_12px_rgba(255,255,255,0.8)] dark:shadow-[0_0_25px_rgba(185,154,230,0.45),inset_0_0_15px_rgba(185,154,230,0.15)] backdrop-blur-md transition-all whitespace-nowrap max-w-full overflow-x-auto hover:scale-[1.02]">
              <span className="text-sm sm:text-lg shrink-0 animate-pulse drop-shadow-[0_0_8px_rgba(255,105,180,0.8)]">🌸</span>
              <span className="font-markazi text-xs sm:text-base md:text-xl text-wine-deep dark:text-[#F8F4FF] font-extrabold tracking-wide text-center whitespace-nowrap drop-shadow-[0_0_8px_rgba(142,74,159,0.4)] dark:drop-shadow-[0_0_10px_rgba(185,154,230,0.7)]">
                دا المكان الهيكون فيه كل كلمة حلوة بكتبهالك يا قلب بابا
              </span>
              <span className="text-sm sm:text-lg shrink-0 animate-pulse drop-shadow-[0_0_8px_rgba(255,105,180,0.8)]">🌸</span>
            </div>
          </div>

          <div className="flex flex-col gap-3.5 sm:gap-4 max-h-[45vh] overflow-y-auto px-1 sm:px-2 py-1 scrollbar-timeline w-full">
            {messages.filter(msg => msg.id !== currentMessage?.id && msg.date <= todayStr).map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
              >
                <Link
                  href={`/message/${msg.id}`}
                  onClick={playMagicChime}
                  className="w-full min-h-[64px] border px-3.5 sm:px-5 py-3 sm:py-3.5 rounded-2xl text-right cursor-pointer transition-all duration-300 flex items-center justify-between gap-3 hover:-translate-y-1 hover:shadow-lg bg-gradient-to-r from-white/95 via-cream/90 to-white/95 dark:from-[#1E142B]/95 dark:via-[#261738]/90 dark:to-[#1E142B]/95 border-wine/20 dark:border-rose/30 hover:border-rose/60 dark:hover:border-rose/70 backdrop-blur-md no-underline group shadow-[0_4px_16px_rgba(90,39,128,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_0_25px_rgba(185,154,230,0.25)] relative overflow-hidden"
                >
                {/* Subtle top shimmer bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Right side: Date + Title */}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-wine/10 dark:bg-rose/15 flex items-center justify-center text-sm text-wine dark:text-rose-pale border border-wine/20 dark:border-rose/30 shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-sm">
                      📅
                    </span>
                    <span className="font-aref text-base sm:text-xl md:text-2xl text-wine-deep dark:text-[#F8F4FF] font-bold drop-shadow-[0_0_8px_rgba(142,74,159,0.4)] dark:drop-shadow-[0_0_8px_rgba(185,154,230,0.5)] whitespace-nowrap group-hover:text-wine dark:group-hover:text-rose-pale transition-colors">
                      {formatDateArabic(msg.date)}
                    </span>
                  </div>

                </div>

                {/* Center flourish connector line (desktop/tablet) */}
                <div className="hidden sm:flex flex-1 items-center justify-center mx-4 opacity-30 group-hover:opacity-80 transition-opacity duration-300">
                  <div className="w-full border-b border-dashed border-rose/50"></div>
                  <span className="text-xs text-rose mx-2.5 select-none shrink-0">❦</span>
                  <div className="w-full border-b border-dashed border-rose/50"></div>
                </div>

                {/* Left side: CTA Button - shows title or default */}
                <div className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-wine via-[#74359D] to-wine-deep dark:from-wine dark:via-[#7A3EAA] dark:to-wine-deep text-white px-3 sm:px-4 py-2 rounded-full font-markazi text-sm sm:text-base font-bold shadow-[0_0_15px_rgba(142,74,159,0.4)] hover:shadow-[0_0_20px_rgba(142,74,159,0.6)] dark:shadow-[0_0_15px_rgba(185,154,230,0.3)] group-hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 max-w-[160px] sm:max-w-[220px]">
                  <span className="line-clamp-2 text-center leading-snug">{msg.title || 'افتكري ذكرياتنا'}</span>
                  <span className="text-base group-hover:translate-x-0.5 transition-transform shrink-0">💌</span>
                </div>
              </Link>
            </motion.div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
