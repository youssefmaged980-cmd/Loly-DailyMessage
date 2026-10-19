"use client";

import { getEnvelopeIcon, getMessageTypeLabel, Message, MESSAGE_TYPE_DETAILS } from "@/types";

type Props = {
  message: Message;
  onOpen: (message: Message) => void;
  compact?: boolean;
};

export default function MessageEnvelope({ message, onOpen, compact = false }: Props) {
  const type = message.type ?? "morning";
  const details = MESSAGE_TYPE_DETAILS[type];
  const envelopeIcon = getEnvelopeIcon(message) === "sun" ? "☀️" : "💗";
  const style = {
    morning: {
      card: "border-[#D9B76F]/55 bg-gradient-to-br from-[#FFFDF5] via-[#FFF6E7] to-[#F7E9D7] text-[#684A69] dark:from-[#302536] dark:via-[#30233A] dark:to-[#382A36] dark:text-[#FFF2D2]",
      badge: "border-[#D4AD5D]/45 bg-[#FFF7DF]/90 text-[#85632B] dark:bg-[#493B3A] dark:text-[#F7D991]",
      envelope: "text-[#C99D50]",
      seal: "border-[#F6D98D] bg-gradient-to-br from-[#FFF0AF] to-[#E7B95D] text-[#765322] shadow-[#D29C45]/35",
    },
    extra: {
      card: "border-[#DFA6C8]/55 bg-gradient-to-br from-[#FFF9FC] via-[#FDEDF6] to-[#F0E7FA] text-[#683C70] dark:from-[#302034] dark:via-[#35223B] dark:to-[#2B2039] dark:text-[#F9E8FF]",
      badge: "border-[#D78AB7]/45 bg-[#FFF0F7]/90 text-[#8E4E79] dark:bg-[#492C49] dark:text-[#F4BDE0]",
      envelope: "text-[#BB72A7]",
      seal: "border-[#F7C7E4] bg-gradient-to-br from-[#F8D9F3] to-[#C57BB4] text-white shadow-[#C67CB8]/35",
    },
    special: {
      card: "border-[#D9B66B]/60 bg-gradient-to-br from-[#33243D] via-[#261B32] to-[#1D1729] text-[#FFF4D8] shadow-[0_10px_35px_rgba(39,20,52,0.25)]",
      badge: "border-[#D8B35E]/45 bg-[#574238]/70 text-[#FFE4A5]",
      envelope: "text-[#D9AE5C]",
      seal: "border-[#F6D994] bg-gradient-to-br from-[#FFE9A8] to-[#C99139] text-[#4D2D46] shadow-[#E2B752]/35",
    },
    apology: {
      card: "border-[#D98BAE]/60 bg-gradient-to-br from-[#FFF5F8] via-[#F9E9F1] to-[#EEE4F4] text-[#653C5D] dark:from-[#33202F] dark:via-[#302037] dark:to-[#241B32] dark:text-[#FFEAF3]",
      badge: "border-[#D98BAE]/50 bg-[#FFF0F5]/90 text-[#8A496A] dark:bg-[#4A2B42] dark:text-[#FFC5DA]",
      envelope: "text-[#C879A2]",
      seal: "border-[#F5C4D7] bg-gradient-to-br from-[#FFE4EE] to-[#D982AA] text-[#703B5D] shadow-[#CC78A0]/35",
    },
  }[type];

  const formattedDate = new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${message.date}T12:00:00Z`));

  return (
    <button
      type="button"
      onClick={() => onOpen(message)}
      aria-label={`افتح ${getMessageTypeLabel(message)}: ${message.title || formattedDate}`}
      className={`group relative flex w-full flex-col overflow-hidden rounded-[1.9rem] border p-4 text-right shadow-[0_14px_38px_rgba(42,20,54,0.17)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(142,74,159,0.26)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 sm:p-5 ${compact ? "min-h-52" : "min-h-60"} ${style.card}`}
      dir="rtl"
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-[7px] rounded-[1.5rem] border border-white/35 dark:border-white/10" />
      <span aria-hidden="true" className="pointer-events-none absolute -left-12 -top-14 h-36 w-36 rounded-full bg-white/25 blur-3xl transition-opacity group-hover:opacity-80" />
      <div className="flex w-full items-center justify-between gap-2">
        <span className={`inline-flex max-w-[70%] items-center gap-1.5 rounded-full border px-3.5 py-1 font-markazi text-base font-bold shadow-sm ${style.badge}`}>
          <span aria-hidden="true">{envelopeIcon}</span>{getMessageTypeLabel(message)}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-current/15 bg-white/35 px-3 py-1.5 font-markazi text-base font-semibold leading-none text-current/80 shadow-sm backdrop-blur-sm dark:bg-black/10">
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5 opacity-70">
            <rect x="3" y="4.5" width="14" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M6.5 3v3M13.5 3v3M3.5 8h13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M7 11h2M11 11h2M7 14h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span>{formattedDate}</span>
        </span>
      </div>

      <span className={`relative mx-auto my-3 flex h-28 w-full max-w-[17rem] items-center justify-center ${style.envelope}`} aria-hidden="true">
        <span className="absolute inset-x-[18%] top-1/2 h-16 -translate-y-1/2 rounded-full bg-current/15 blur-2xl transition-opacity duration-500 group-hover:opacity-80" />
        <svg viewBox="0 0 240 132" className="absolute inset-x-0 bottom-0 h-full w-full drop-shadow-[0_9px_10px_rgba(30,16,40,0.2)] transition-transform duration-500 group-hover:-translate-y-0.5" fill="none">
          <rect x="17" y="25" width="206" height="94" rx="18" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeOpacity=".68" strokeWidth="2.5" />
          <path d="m20 39 84 58a27 27 0 0 0 32 0l84-58" stroke="currentColor" strokeOpacity=".72" strokeWidth="2.6" strokeLinecap="round" />
          <path d="m20 115 69-54m131 54-69-54" stroke="currentColor" strokeOpacity=".43" strokeWidth="2" strokeLinecap="round" />
          <path d="m20 39 84 58a27 27 0 0 0 32 0l84-58" fill="currentColor" fillOpacity=".09" />
          <path d="m19 40 89 63a20 20 0 0 0 24 0l89-63" stroke="currentColor" strokeOpacity=".25" strokeWidth="1" />
        </svg>
        <span className={`relative z-10 mt-5 grid h-12 w-12 place-items-center rounded-full border-2 text-xl shadow-[0_5px_14px_rgba(35,18,45,0.25)] ring-4 ring-white/20 transition duration-500 group-hover:scale-110 group-hover:rotate-6 ${style.seal}`}>
          <span className="absolute inset-1 rounded-full border border-current/30" />
          <span className="relative">{envelopeIcon}</span>
        </span>
      </span>

      <span className={`mt-auto block w-full border-t border-current/15 pt-3 font-aref font-bold leading-relaxed ${compact ? "text-lg" : "text-xl"}`}>
        {message.title || details.caption}
      </span>
      {message.description && (
        <span className="mt-1.5 block line-clamp-2 w-full border-r-2 border-current/35 pr-2 font-markazi text-base leading-relaxed opacity-80">
          {message.description}
        </span>
      )}
      <span aria-hidden="true" className="pointer-events-none absolute bottom-2 left-3 text-sm opacity-50">✧</span>
    </button>
  );
}
