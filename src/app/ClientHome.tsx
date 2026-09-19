"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Message, TimeTogether } from "@/types";
import { getEgyptTodayString, formatDateArabic, calculateTimeTogether } from "@/lib/date";
import { generateCardImage } from "@/lib/exportCard";
import FloralCorner from "@/components/FloralCorner";
import ThemeToggle from "@/components/ThemeToggle";
import FloatingEffects from "@/components/FloatingEffects";

export default function ClientHome({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [timeTogether, setTimeTogether] = useState<TimeTogether | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const messageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Initial and periodic time counter calculation
    const updateTimer = () => {
      setTimeTogether(calculateTimeTogether("2024-02-25T00:00:00"));
    };
    updateTimer();
    const timer = setInterval(updateTimer, 1000);

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

  const todayStr = getEgyptTodayString();

  return (
    <>
      <ThemeToggle className="absolute top-5 left-5 z-50" />
      <FloatingEffects count={12} />

      <div className="w-full max-w-[680px] md:max-w-[780px] lg:max-w-[860px] mx-auto p-4 sm:p-6 md:p-10 flex flex-col gap-8 md:gap-10 relative z-10 min-h-screen">

        {/* Header Section */}
        <header className="flex flex-col items-center text-center gap-5 mt-4">
          <div className="relative group">
            {/* Decorative floral rings behind image */}
            <div className="absolute -inset-4 border-2 border-rose/30 rounded-full"></div>
            <div className="absolute -inset-2 border border-gold/40 rounded-full rotate-45"></div>

            <div className="w-[160px] h-[160px] md:w-[180px] md:h-[180px] rounded-full p-2 bg-gradient-to-tr from-wine via-rose to-gold shadow-[0_10px_25px_rgba(74,42,112,0.3)] relative z-10 overflow-hidden group-hover:scale-105 transition-transform duration-500">
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
            <h2 className="font-aref text-2xl md:text-3xl text-wine dark:text-[#F6A5D6] dark:drop-shadow-[0_0_16px_rgba(246,165,214,0.9)] mb-2 drop-shadow-sm font-bold">
              رسايلك الجميلة الذيك يا حبيبي هنا
            </h2>
            <div className="font-cormorant italic text-gold text-xl md:text-2xl tracking-widest mt-1 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
              For my one and only Laila
            </div>

            <div className="mt-6 w-full border border-rose/30 rounded-3xl p-6 relative shadow-[var(--shadow)] transition-all duration-500 bg-card-bg/10 backdrop-blur-sm">
              {/* Title INSIDE the frame */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                <span className="font-aref text-2xl md:text-3xl text-wine dark:text-[#F9C88A] dark:drop-shadow-[0_0_14px_rgba(249,200,138,0.85)] drop-shadow-sm text-center font-bold">
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
            <h1 className="font-aref text-2xl sm:text-3xl md:text-4xl text-wine-deep dark:text-[#E0AAEF] dark:drop-shadow-[0_0_14px_rgba(224,170,239,0.85)] mb-2 drop-shadow-sm relative inline-block font-bold">
              <span className="absolute -left-7 sm:-left-9 top-1/2 -translate-y-1/2 text-rose text-lg sm:text-xl opacity-75">❦</span>
              {currentMessage ? formatDateArabic(currentMessage.date) : formatDateArabic(todayStr)}
              <span className="absolute -right-7 sm:-right-9 top-1/2 -translate-y-1/2 text-rose text-lg sm:text-xl opacity-75 flex scale-x-[-1]">❦</span>
            </h1>
          </div>

          <div className="text-xl sm:text-2xl md:text-3xl leading-[2] sm:leading-[2.2] text-text-main font-semibold relative z-10 transition-opacity duration-500 px-2 sm:px-6 md:px-10 break-words w-full max-w-full whitespace-pre-wrap">
            {currentMessage?.message}
          </div>

          <div className="relative z-10 mt-4" data-html2canvas-ignore="true">
            <button
              onClick={downloadImage}
              disabled={isDownloading}
              className="bg-gradient-to-r from-wine to-wine-deep text-white border-none py-3 px-6 sm:px-8 rounded-full font-markazi text-xl sm:text-2xl cursor-pointer inline-flex items-center gap-2.5 sm:gap-3 transition-all duration-300 shadow-[0_8px_20px_rgba(90,39,128,0.3)] hover:shadow-[0_10px_25px_rgba(90,39,128,0.5)] hover:-translate-y-1 active:scale-95 group-hover:scale-105 disabled:opacity-50"
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
          <h2 className="font-aref text-3xl text-wine dark:text-[#F8F4FF] dark:drop-shadow-[0_0_12px_rgba(255,182,217,0.7)] mb-7 text-center flex items-center justify-center gap-4 before:content-[''] before:flex-1 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:to-rose/50 after:content-[''] after:flex-1 after:h-[2px] after:bg-gradient-to-l after:from-transparent after:to-rose/50">
            <span className="text-2xl">📖</span> أرشيف الذكريات
          </h2>

          <div className="flex justify-center mt-2 mb-7 sm:mb-8 px-1">
            <div className="inline-flex items-center justify-center gap-2 sm:gap-2.5 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white/90 dark:bg-[#1E142B]/90 border-2 border-rose/50 dark:border-rose/60 shadow-[0_0_22px_rgba(142,74,159,0.35),0_4px_15px_rgba(90,39,128,0.12),inset_0_0_12px_rgba(255,255,255,0.8)] dark:shadow-[0_0_25px_rgba(185,154,230,0.45),inset_0_0_15px_rgba(185,154,230,0.15)] backdrop-blur-md transition-all whitespace-nowrap max-w-full overflow-x-auto hover:scale-[1.02]">
              <span className="text-sm sm:text-lg shrink-0 animate-pulse drop-shadow-[0_0_8px_rgba(255,105,180,0.8)]">🌸</span>
              <span className="font-markazi text-xs sm:text-base md:text-xl text-wine-deep dark:text-[#F8F4FF] font-extrabold tracking-wide text-center whitespace-nowrap drop-shadow-[0_0_6px_rgba(142,74,159,0.2)] dark:drop-shadow-[0_0_10px_rgba(185,154,230,0.7)]">
                دا المكان الهيكون فيه كل كلمة حلوة بكتبهالك يا قلب بابا
              </span>
              <span className="text-sm sm:text-lg shrink-0 animate-pulse drop-shadow-[0_0_8px_rgba(255,105,180,0.8)]">🌸</span>
            </div>
          </div>

          <div className="flex flex-col gap-3.5 sm:gap-4 max-h-[45vh] overflow-y-auto px-1 sm:px-2 py-1 scrollbar-timeline w-full">
            {messages.filter(msg => msg.id !== currentMessage?.id && msg.date <= todayStr).map((msg) => (
              <Link
                key={msg.id}
                href={`/message/${msg.id}`}
                className="w-full min-h-[64px] border px-3.5 sm:px-5 py-3 sm:py-3.5 rounded-2xl text-right cursor-pointer transition-all duration-300 flex items-center justify-between gap-3 hover:-translate-y-1 hover:shadow-lg bg-gradient-to-r from-white/95 via-cream/90 to-white/95 dark:from-[#1E142B]/95 dark:via-[#261738]/90 dark:to-[#1E142B]/95 border-wine/20 dark:border-rose/30 hover:border-rose/60 dark:hover:border-rose/70 backdrop-blur-md no-underline group shadow-[0_4px_16px_rgba(90,39,128,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_0_25px_rgba(185,154,230,0.25)] relative overflow-hidden"
              >
                {/* Subtle top shimmer bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Right side: Date with icon */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-8 h-8 rounded-xl bg-wine/10 dark:bg-rose/15 flex items-center justify-center text-sm text-wine dark:text-rose-pale border border-wine/20 dark:border-rose/30 shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shadow-sm">
                    📅
                  </span>
                  <span className="font-aref text-base sm:text-xl md:text-2xl text-wine-deep dark:text-[#F8F4FF] font-bold drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(185,154,230,0.5)] whitespace-nowrap group-hover:text-wine dark:group-hover:text-rose-pale transition-colors">
                    {formatDateArabic(msg.date)}
                  </span>
                </div>

                {/* Center flourish connector line (desktop/tablet) */}
                <div className="hidden sm:flex flex-1 items-center justify-center mx-4 opacity-30 group-hover:opacity-80 transition-opacity duration-300">
                  <div className="w-full border-b border-dashed border-rose/50"></div>
                  <span className="text-xs text-rose mx-2.5 select-none shrink-0">❦</span>
                  <div className="w-full border-b border-dashed border-rose/50"></div>
                </div>

                {/* Left side: Luxury CTA Button */}
                <div className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-wine via-[#74359D] to-wine-deep dark:from-wine dark:via-[#7A3EAA] dark:to-wine-deep text-white px-3.5 sm:px-4 py-2 rounded-full font-markazi text-sm sm:text-base md:text-lg font-bold shadow-[0_3px_12px_rgba(90,39,128,0.25)] hover:shadow-[0_5px_18px_rgba(116,53,157,0.45)] dark:shadow-[0_0_15px_rgba(185,154,230,0.3)] group-hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 whitespace-nowrap">
                  <span>افتكري ذكرياتنا يا روحي</span>
                  <span className="text-base group-hover:translate-x-0.5 transition-transform">💌</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
