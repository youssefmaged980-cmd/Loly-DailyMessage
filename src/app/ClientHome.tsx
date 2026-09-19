"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";

interface Message {
  id: string;
  date: string;
  message: string;
}

interface TimeTogether {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

export default function ClientHome({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [timeTogether, setTimeTogether] = useState<TimeTogether | null>(null);
  const messageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Generate flying petals and hearts
    createEffects();

    // Calculate time together dynamically
    const calculateTime = () => {
      const now = new Date();
      const startDate = new Date("2024-02-25T00:00:00");
      const diffTime = Math.abs(now.getTime() - startDate.getTime());

      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffTime / 1000 / 60) % 60);
      const seconds = Math.floor((diffTime / 1000) % 60);

      const formatNumber = (num: number) => num.toString().padStart(2, '0');

      setTimeTogether({
        days: formatNumber(days),
        hours: formatNumber(hours),
        minutes: formatNumber(minutes),
        seconds: formatNumber(seconds)
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayString = `${yyyy}-${mm}-${dd}`;

    const validMessages = initialMessages.filter((m: Message) => m.date <= todayString);
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

  const createEffects = () => {
    const container = document.getElementById('effectsContainer');
    if (!container) return;
    container.innerHTML = '';

    const elementsCount = 12;
    const symbols = ['🌸', '💮', '🌺', '✨', '💕', '🌹'];

    for (let i = 0; i < elementsCount; i++) {
      const el = document.createElement('div');
      // Randomly choose float up or fall down
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
    if (!messageRef.current) return;
    try {
      const dataUrl = await toPng(messageRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        filter: (node) => {
          return !node.dataset || node.dataset.html2canvasIgnore !== 'true';
        }
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `laila-message-${currentMessage?.date || "today"}.png`;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
      alert("حدث خطأ أثناء حفظ الصورة");
    }
  };

  const formatDateArabic = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ar-EG-u-nu-latn', options);
  };

  const shareToWhatsApp = () => {
    if (!currentMessage) return;
    const shareText = `رسالة اليوم (${formatDateArabic(currentMessage.date)}):\n\n"${currentMessage.message}"\n\n❤️💌`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
  };

  // Floral SVG corner component
  const FloralCorner = ({ className }: { className: string }) => (
    <svg viewBox="0 0 100 100" className={`floral-corner fill-rose ${className}`}>
      <path d="M 0,0 C 20,0 40,10 50,30 C 60,10 80,0 100,0 C 80,20 70,40 50,50 C 70,60 80,80 100,100 C 80,100 60,90 50,70 C 40,90 20,100 0,100 C 20,80 30,60 50,50 C 30,40 20,20 0,0 Z" />
    </svg>
  );

  return (
    <>
      <button
        onClick={toggleTheme}
        className="absolute top-5 left-5 bg-transparent border-none text-wine text-2xl cursor-pointer z-50 hover:scale-110 transition-transform"
        aria-label="تبديل المظهر"
      >
        🌙
      </button>

      <div id="effectsContainer" className="fixed top-0 left-0 w-screen h-screen overflow-hidden z-0 pointer-events-none"></div>

      <div className="w-full max-w-[650px] mx-auto p-6 md:p-10 flex flex-col gap-10 relative z-10 min-h-screen">

        {/* Header Section */}
        <header className="flex flex-col items-center text-center gap-5 mt-4">
          <div className="relative group">
            {/* Decorative floral rings behind image */}
            <div className="absolute -inset-4 border-2 border-rose/30 rounded-full"></div>
            <div className="absolute -inset-2 border border-gold/40 rounded-full rotate-45"></div>

            <div className="w-[160px] h-[160px] md:w-[180px] md:h-[180px] rounded-full p-2 bg-gradient-to-tr from-wine via-rose to-gold shadow-[0_10px_25px_rgba(140,43,70,0.3)] relative z-10 overflow-hidden group-hover:scale-105 transition-transform duration-500">
              <div className="w-full h-full rounded-full border-4 border-bg-color overflow-hidden bg-rose-pale relative flex items-center justify-center">
                {/* Fallback pattern just in case image doesn't load */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,158,174,0.4)_0%,transparent_100%)] flex items-center justify-center">
                  <span className="font-aref text-6xl text-wine opacity-40">L</span>
                </div>
                <img
                  src="/laila.jpg"
                  alt=""
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
            <h2 className="font-aref text-2xl md:text-3xl text-wine mb-2 drop-shadow-sm opacity-90">
              رسالتك الحلوة زيك يا حبيبتي
            </h2>
            <div className="font-cormorant italic text-gold text-xl md:text-2xl tracking-widest mt-1">For my one and only Laila</div>

            <div className="mt-6 w-full border border-rose/30 rounded-3xl p-6 relative shadow-[var(--shadow)] transition-all duration-500 bg-card-bg/10 backdrop-blur-sm">
              {/* Title INSIDE the frame */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                <span className="font-aref text-2xl md:text-3xl text-wine drop-shadow-sm text-center">ايامنا الحلوة اللي عشناها سوا يا قلبي</span>
                <span className="text-rose text-2xl md:text-3xl animate-pulse">🌸</span>
              </div>

              <div className="flex flex-row gap-2 md:gap-4 mt-2 dir-ltr items-center justify-center relative z-0">
                {timeTogether && (
                  <>
                    <div className="flex flex-col items-center justify-center bg-card-bg/90 border border-rose/30 rounded-2xl w-[65px] h-[80px] md:w-20 md:h-24 shadow-[0_5px_15px_rgba(140,43,70,0.15)] backdrop-blur-md relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-b from-rose-pale/50 to-transparent"></div>
                      <span className="font-aref text-3xl md:text-4xl text-wine-deep relative z-10">{timeTogether.days}</span>
                      <span className="font-markazi text-sm text-text-muted mt-1 relative z-10">يوم</span>
                    </div>
                    <span className="text-rose text-2xl font-bold animate-pulse mb-4">:</span>
                    <div className="flex flex-col items-center justify-center bg-card-bg/90 border border-rose/30 rounded-2xl w-[65px] h-[80px] md:w-20 md:h-24 shadow-[0_5px_15px_rgba(140,43,70,0.15)] backdrop-blur-md relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-b from-rose-pale/50 to-transparent"></div>
                      <span className="font-aref text-3xl md:text-4xl text-wine-deep relative z-10">{timeTogether.hours}</span>
                      <span className="font-markazi text-sm text-text-muted mt-1 relative z-10">ساعة</span>
                    </div>
                    <span className="text-rose text-2xl font-bold animate-pulse mb-4">:</span>
                    <div className="flex flex-col items-center justify-center bg-card-bg/90 border border-rose/30 rounded-2xl w-[65px] h-[80px] md:w-20 md:h-24 shadow-[0_5px_15px_rgba(140,43,70,0.15)] backdrop-blur-md relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-b from-rose-pale/50 to-transparent"></div>
                      <span className="font-aref text-3xl md:text-4xl text-wine-deep relative z-10">{timeTogether.minutes}</span>
                      <span className="font-markazi text-sm text-text-muted mt-1 relative z-10">دقيقة</span>
                    </div>
                    <span className="text-rose text-2xl font-bold animate-pulse mb-4">:</span>
                    <div className="flex flex-col items-center justify-center bg-card-bg/90 border border-rose/30 rounded-2xl w-[65px] h-[80px] md:w-20 md:h-24 shadow-[0_5px_15px_rgba(140,43,70,0.15)] backdrop-blur-md relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-b from-rose-pale/50 to-transparent"></div>
                      <span className="font-aref text-3xl md:text-4xl text-wine-deep relative z-10">{timeTogether.seconds}</span>
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
          className="rounded-[32px] py-10 px-8 shadow-[var(--card-shadow)] border border-border-color text-center relative min-h-[250px] flex flex-col justify-center items-center gap-6 animate-fade-in-up transition-all duration-500 overflow-hidden group"
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
              {currentMessage ? formatDateArabic(currentMessage.date) : formatDateArabic(new Date().toISOString())}
              <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-rose text-xl opacity-70 flex scale-x-[-1]">❦</span>
            </h1>
          </div>

          <div className="text-2xl md:text-3xl leading-[2] text-text-main font-semibold relative z-10 transition-opacity duration-500 px-4 md:px-12 break-words w-full max-w-full">
            {currentMessage?.message}
          </div>

          <div className="relative z-10 mt-4" data-html2canvas-ignore="true">
            <button
              onClick={downloadImage}
              className="bg-gradient-to-r from-wine to-wine-deep text-paper border-none py-3 px-8 rounded-full font-markazi text-2xl cursor-pointer inline-flex items-center gap-3 transition-all duration-300 shadow-[0_8px_20px_rgba(194,30,86,0.3)] hover:shadow-[0_10px_25px_rgba(194,30,86,0.5)] hover:-translate-y-1 group-hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current">
                <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
              </svg>
              نزلي الرسالة عندك يا عيوني لو حابة
            </button>
          </div>
        </main>

        {/* Archive Section */}
        <section className="mt-8 mb-12 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="font-aref text-3xl text-wine mb-8 text-center flex items-center justify-center gap-4 before:content-[''] before:flex-1 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:to-rose/50 after:content-[''] after:flex-1 after:h-[2px] after:bg-gradient-to-l after:from-transparent after:to-rose/50">
            <span className="text-2xl">📖</span> أرشيف الذكريات
          </h2>

          <div className="flex flex-col gap-4 max-h-[45vh] overflow-y-auto px-4 py-2 scrollbar-timeline">
            {messages.filter(msg => msg.id !== currentMessage?.id).map((msg) => (
              <Link
                key={msg.id}
                href={`/message/${msg.id}`}
                className="border p-5 rounded-2xl text-right cursor-pointer transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:-translate-y-1 hover:shadow-md bg-card-bg/60 border-border-color hover:bg-rose-pale/40 hover:border-rose/50 backdrop-blur-sm no-underline group"
              >
                <span className="font-aref text-2xl text-wine/80 drop-shadow-sm group-hover:text-wine transition-colors">
                  {formatDateArabic(msg.date)}
                </span>
                <span className="font-markazi text-xl sm:max-w-[70%] text-right text-text-muted opacity-80 group-hover:opacity-100 transition-opacity">
                  اقري مسدج قديمة وافتكري ذكرياتنا يا روحي
                </span>
              </Link>
            ))}

            {messages.filter(msg => msg.id !== currentMessage?.id).length === 0 && (
              <div className="text-center font-markazi text-2xl text-text-muted mt-8 opacity-70">
                دا المكان الهيكون فيه كل كلمة حلوة بكتبهالك يا قلب بابا 🌸
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
