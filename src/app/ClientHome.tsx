"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Message, MESSAGE_TYPE_DETAILS, TimeTogether } from "@/types";
import { getEgyptTodayString, formatDateArabic, calculateTimeTogether, getSpecialOccasion, getTimeGreeting, getMilestoneMessage, formatMonthName, SpecialOccasion } from "@/lib/date";
import { generateCardImage, prepareImageSaveWindow, saveGeneratedImage } from "@/lib/exportCard";
import FloralCorner from "@/components/FloralCorner";
import ThemeToggle from "@/components/ThemeToggle";
import FloatingEffects from "@/components/FloatingEffects";
import CelebrationOverlay from "@/components/CelebrationOverlay";
import MilestoneOverlay from "@/components/MilestoneOverlay";
import InteractiveHearts from "@/components/InteractiveHearts";
import ReplySection from "@/components/ReplySection";
import MessageEnvelope from "@/components/MessageEnvelope";
import { motion } from "framer-motion";

function getLatestUploadedMessage(messages: Message[]): Message | null {
  return [...messages].sort((a, b) => {
    const aCreatedAt = Date.parse(a.createdAt ?? "");
    const bCreatedAt = Date.parse(b.createdAt ?? "");
    if (Number.isFinite(aCreatedAt) && Number.isFinite(bCreatedAt) && aCreatedAt !== bCreatedAt) {
      return bCreatedAt - aCreatedAt;
    }
    return b.date.localeCompare(a.date);
  })[0] ?? null;
}

export default function ClientHome({ initialMessages, messageLoadError }: { initialMessages: Message[]; messageLoadError?: string | null }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(() => getLatestUploadedMessage(initialMessages));
  const [timeTogether, setTimeTogether] = useState<TimeTogether | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [occasion, setOccasion] = useState<SpecialOccasion | null>(null);
  const [greeting, setGreeting] = useState<{ emoji: string; text: string } | null>(null);
  const [milestoneMsg, setMilestoneMsg] = useState<string | null>(null);
  const [randomMsg, setRandomMsg] = useState<Message | null>(null);
  const [selectedArchiveMonth, setSelectedArchiveMonth] = useState<string | null>(null);
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

    // Keep every saved message; the latest uploaded message is the featured letter.
    const todayString = getEgyptTodayString();
    setMessages(initialMessages);

    const latestMessage = getLatestUploadedMessage(initialMessages);
    if (latestMessage) {
      setCurrentMessage(latestMessage);
    } else {
      setCurrentMessage({
        id: 'fallback',
        date: todayString,
        type: "morning",
        title: "رسالة الصباح",
        description: "ظرف صغير مليان حب ليكي",
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

  const downloadImage = async (targetMessage: Message | null = currentMessage) => {
    if (!targetMessage || isDownloading) return;
    const fallbackWindow = prepareImageSaveWindow();
    setIsDownloading(true);
    try {
      const dataUrl = await generateCardImage({
        date: targetMessage.date,
        title: targetMessage.title,
        description: targetMessage.description,
        messageText: targetMessage.message,
      });
      const result = await saveGeneratedImage(dataUrl, `laila-message-${targetMessage.date || "today"}.png`, fallbackWindow);
      if (result === "opened") alert("اتفتحت الصورة في Safari. اضغطي عليها مطولًا واختاري حفظ في الصور.");
    } catch (error) {
      fallbackWindow?.close();
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
    const pool = messages.filter((m) => m.id !== currentMessage?.id && m.date <= getEgyptTodayString());
    if (pool.length === 0) return;
    setRandomMsg(pool[Math.floor(Math.random() * pool.length)]);
    playMagicChime();
  };

  const closeRandom = () => setRandomMsg(null);

  const todayStr = getEgyptTodayString();
  const archiveMessages = messages.filter((msg) => msg.id !== currentMessage?.id && msg.date <= todayStr);
  const archiveMonths = Array.from(new Set(archiveMessages.map(msg => msg.date.slice(0, 7))));
  const formatArchiveMonth = (monthKey: string) => new Intl.DateTimeFormat("ar-EG", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${monthKey}-01T12:00:00Z`));

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
          {/* Blurred overlay */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          {/* Modal card */}
          <div
            className="relative z-10 w-full sm:max-w-lg animate-fade-in-up flex flex-col overflow-hidden
              rounded-t-[32px] sm:rounded-[32px]
              border border-rose/50 dark:border-[#b99ae6]/60
              shadow-[0_0_60px_rgba(142,74,159,0.6),0_0_120px_rgba(142,74,159,0.3)]
              dark:shadow-[0_0_60px_rgba(185,154,230,0.5),0_0_120px_rgba(185,154,230,0.25)]
              bg-gradient-to-br from-[#FDFAFF]/95 to-[#EDE3F1]/95 dark:from-[#1F162B]/95 dark:to-[#120E1A]/95"
            style={{
              maxHeight: '88dvh',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Top glow bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-rose to-transparent opacity-80" />

            {/* Decorative bg circles */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-rose/10 dark:bg-rose/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-wine/10 dark:bg-wine/20 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-rose/20 shrink-0 relative">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl drop-shadow-[0_0_8px_rgba(255,105,180,0.8)]">{MESSAGE_TYPE_DETAILS[randomMsg.type ?? "morning"].icon}</span>
                <div>
                  <p className="font-aref text-lg text-wine dark:text-[#E0AAEF] font-bold drop-shadow-[0_0_8px_rgba(142,74,159,0.5)] dark:drop-shadow-[0_0_10px_rgba(224,170,239,0.8)]">
                    {formatDateArabic(randomMsg.date)}
                  </p>
                  <p className="font-markazi text-sm text-rose dark:text-[#F9C88A]">{randomMsg.typeLabel?.trim() || MESSAGE_TYPE_DETAILS[randomMsg.type ?? "morning"].label}</p>
                </div>
              </div>
              <button
                onClick={closeRandom}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-wine/10 hover:bg-rose/20 text-wine hover:text-rose transition-all text-base font-bold shrink-0 border border-wine/20"
                aria-label="إغلاق"
              >
                ✕
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-5 py-5 text-center scrollbar-timeline">
              {randomMsg.title && (
                <div className="flex justify-center mb-5">
                  <span className="inline-flex max-w-full items-center gap-1.5 bg-gradient-to-r from-wine via-[#74359D] to-wine-deep text-white px-5 py-2 rounded-full font-aref text-lg sm:text-xl font-bold leading-relaxed shadow-[0_0_18px_rgba(142,74,159,0.55)] border border-white/20 break-words">
                    <span>✨</span>
                    <span>{randomMsg.title}</span>
                  </span>
                </div>
              )}
              {randomMsg.description && (
                <p className="max-w-xl mx-auto mb-5 px-4 py-2.5 rounded-2xl border border-rose/20 dark:border-[#b99ae6]/25 bg-rose/5 dark:bg-[#b99ae6]/10 font-markazi text-lg sm:text-xl text-rose dark:text-[#F9C88A] leading-relaxed text-right relative">
                  <span aria-hidden="true" className="ml-2">🌸</span>
                  {randomMsg.description}
                </p>
              )}
              <p className="font-markazi text-xl sm:text-2xl text-wine-deep dark:text-[#F8F5FF] leading-[1.9] whitespace-pre-wrap drop-shadow-[0_0_6px_rgba(142,74,159,0.2)]">
                {randomMsg.message}
              </p>
              
              <ReplySection key={randomMsg.id} message={randomMsg} />
            </div>

            {/* Footer */}
            <div className="px-5 pb-7 pt-4 border-t border-rose/20 shrink-0 flex flex-wrap justify-center gap-3 relative">
              <button
                onClick={() => downloadImage(randomMsg)}
                disabled={isDownloading}
                className="bg-white/70 dark:bg-[#261738] text-wine dark:text-[#E0AAEF] px-5 py-3 rounded-full font-markazi text-lg font-bold shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer border border-rose/30 disabled:opacity-50"
              >
                {isDownloading ? "جارٍ تجهيز الصورة…" : "💾 احفظي الذكرى"}
              </button>
              <button
                onClick={pickRandomMessage}
                className="bg-gradient-to-r from-wine via-[#74359D] to-wine-deep text-white px-8 py-3 rounded-full font-markazi text-xl font-bold shadow-[0_0_25px_rgba(142,74,159,0.6)] hover:shadow-[0_0_35px_rgba(142,74,159,0.8)] hover:-translate-y-1 transition-all active:scale-95 cursor-pointer border border-white/20"
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
            <Link href="/admin" className="font-cormorant italic text-gold text-xl md:text-2xl tracking-widest mt-1 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)] no-underline decoration-transparent outline-none cursor-default sm:cursor-pointer">
              For my one and only Laila
            </Link>

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

        {/* Today's message envelopes */}
        <main
          ref={messageRef}
          className="w-full animate-fade-in-up"
        >
          <div className="relative mx-auto max-w-xl px-5 py-7 text-center sm:py-9">
            <span aria-hidden="true" className="absolute left-4 top-5 text-2xl text-rose/70 animate-pulse">♡</span>
            <span aria-hidden="true" className="absolute right-4 top-12 text-xl text-[#D7A246] animate-pulse">✦</span>
            <p className="mb-2 font-markazi text-xl text-rose dark:text-[#F9C88A]">ظرف صغير… جواه كل الحب</p>
            <h1 className="mb-2 font-aref text-3xl font-bold text-wine-deep drop-shadow-[0_0_12px_rgba(142,74,159,0.45)] dark:text-[#E0AAEF] sm:text-4xl">
              {currentMessage ? formatDateArabic(currentMessage.date) : formatDateArabic(todayStr)}
            </h1>
            <p className="mb-7 font-markazi text-lg text-text-muted">رسالة واحدة مخصوص ليكي يا لولو 💌</p>
            {currentMessage && (
              <div className="relative mx-auto max-w-sm">
                <span aria-hidden="true" className="absolute -left-4 top-20 z-10 text-2xl text-rose drop-shadow-md">♥</span>
                <span aria-hidden="true" className="absolute -right-3 bottom-16 z-10 text-2xl text-[#D7A246] drop-shadow-md">✦</span>
                <MessageEnvelope
                  message={currentMessage}
                  onOpen={(openedMessage) => {
                    setRandomMsg(openedMessage);
                    playMagicChime();
                  }}
                />
              </div>
            )}
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

          <div className="flex flex-col gap-3.5 sm:gap-4 px-1 sm:px-2 py-1 w-full max-h-[55vh] overflow-y-auto scrollbar-timeline pb-4">
            {messageLoadError && (
              <div role="alert" className="mb-2 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-right font-markazi text-lg text-red-700 dark:text-red-200" dir="rtl">
                تعذر تحميل الرسائل من قاعدة البيانات. {messageLoadError.includes("permission-denied") || messageLoadError.includes("PERMISSION_DENIED") ? "صلاحيات Firestore تمنع القراءة. راجع قواعد Firestore في Firebase Console." : "تحقّق من اتصال Firestore، ثم راجع تفاصيل الخطأ في سجل الخادم."}
              </div>
            )}
            {selectedArchiveMonth ? (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedArchiveMonth(null)}
                  className="self-start inline-flex min-h-11 items-center gap-2 rounded-full border border-rose/30 bg-card-bg/80 px-5 py-2 font-markazi text-lg font-bold text-wine shadow-sm transition hover:-translate-x-1 hover:border-rose/60 dark:text-[#E0AAEF]"
                >
                  <span aria-hidden="true">→</span>
                  <span>رجوع للشهور</span>
                </button>
                <h3 className="text-center font-aref text-2xl font-bold text-wine-deep dark:text-[#E0AAEF]">
                  {formatArchiveMonth(selectedArchiveMonth)}
                </h3>
                {archiveMessages.filter(msg => msg.date.startsWith(`${selectedArchiveMonth}-`)).map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                  >
                    <MessageEnvelope
                      message={msg}
                      compact
                      onOpen={(openedMessage) => {
                        setRandomMsg(openedMessage);
                        playMagicChime();
                      }}
                    />
                  </motion.div>
                ))}
              </>
            ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {archiveMonths.map((monthKey, index) => {
                  const count = archiveMessages.filter(msg => msg.date.startsWith(`${monthKey}-`)).length;
                  const monthStars = Number(monthKey.slice(5, 7));
                  return (
                    <motion.button
                      key={monthKey}
                      type="button"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => setSelectedArchiveMonth(monthKey)}
                      className="group relative flex min-h-28 flex-col items-center justify-center gap-2 overflow-hidden rounded-3xl border border-rose/35 bg-gradient-to-br from-white/90 via-cream/80 to-white/90 p-5 text-center shadow-[0_6px_24px_rgba(90,39,128,0.12)] transition hover:-translate-y-1 hover:border-rose/70 hover:shadow-[0_10px_30px_rgba(142,74,159,0.25)] dark:from-[#1E142B] dark:via-[#261738] dark:to-[#1E142B] dark:text-[#F8F4FF]"
                    >
                      <span aria-hidden="true" className="relative grid h-[4.25rem] w-[4.75rem] shrink-0 grid-rows-[1.55rem_1fr] overflow-hidden rounded-2xl border border-rose/40 bg-gradient-to-br from-white via-[#FBEAF3] to-[#EADCF2] shadow-[0_5px_16px_rgba(142,74,159,0.2)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-3deg] dark:from-[#34213F] dark:via-[#2A1A37] dark:to-[#21152D]">
                        <span className="relative flex items-center justify-center bg-gradient-to-r from-[#713B8D] to-[#B86DAD] px-1 font-aref text-sm font-bold leading-none text-white shadow-sm">{formatMonthName(monthKey)}<span className="absolute top-0.5 left-2 h-2 w-2 rounded-full border border-white/80 bg-[#F9C88A]" /><span className="absolute top-0.5 right-2 h-2 w-2 rounded-full border border-white/80 bg-[#F9C88A]" /></span>
                        <span className="grid grid-cols-4 content-center justify-items-center gap-x-1 gap-y-0 text-[8px] leading-[9px] text-[#D7A246]">{Array.from({ length: monthStars }, (_, starIndex) => <span key={starIndex}>✦</span>)}</span>
                      </span>
                      <span className="font-aref text-2xl font-bold text-wine-deep dark:text-[#E0AAEF]">{formatArchiveMonth(monthKey)}</span>
                      <span className="rounded-full bg-rose/10 px-3 py-0.5 font-markazi text-base text-rose dark:bg-[#b99ae6]/15 dark:text-[#F9C88A]">
                        {count} {count === 1 ? "رسالة" : "رسائل"}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
      
      {/* Footer Sign-off */}
      <div className="w-full flex justify-center pt-2 pb-6 opacity-60 hover:opacity-100 transition-opacity duration-500 mt-auto">
        <div className="font-cormorant italic text-wine/60 dark:text-[#E0AAEF]/50 text-sm tracking-[0.2em] flex items-center gap-2 select-none">
          I LOVE YOU MY LOLY <span className="text-sm animate-pulse-slow">❤️</span>
        </div>
      </div>
    </>
  );
}
