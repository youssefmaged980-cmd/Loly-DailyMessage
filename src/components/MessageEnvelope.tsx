"use client";

import { Message, MESSAGE_TYPE_DETAILS } from "@/types";

type Props = {
  message: Message;
  onOpen: (message: Message) => void;
  compact?: boolean;
};

export default function MessageEnvelope({ message, onOpen, compact = false }: Props) {
  const type = message.type ?? "morning";
  const details = MESSAGE_TYPE_DETAILS[type];
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
      aria-label={`افتح ${message.typeLabel?.trim() || details.label}: ${message.title || formattedDate}`}
      className={`group relative flex w-full flex-col overflow-hidden rounded-[1.75rem] border p-4 text-right shadow-[0_12px_32px_rgba(42,20,54,0.2)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_42px_rgba(142,74,159,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 ${compact ? "min-h-52" : "min-h-60"} ${style.card}`}
      dir="rtl"
    >
      <span aria-hidden="true" className="pointer-events-none absolute -left-12 -top-14 h-36 w-36 rounded-full bg-white/25 blur-3xl transition-opacity group-hover:opacity-80" />
      <div className="flex w-full items-center justify-between gap-2">
        <span className={`inline-flex max-w-[70%] items-center gap-1.5 rounded-full border px-3.5 py-1 font-markazi text-base font-bold shadow-sm ${style.badge}`}>
          <span aria-hidden="true">{details.icon}</span>{message.typeLabel?.trim() || details.label}
        </span>
        <span className="shrink-0 font-markazi text-sm opacity-75">{formattedDate}</span>
      </div>

      <span className={`relative mx-auto my-3 flex h-28 w-full max-w-[17rem] items-center justify-center ${style.envelope}`} aria-hidden="true">
        <span className="absolute inset-x-[12%] top-0 h-[77%] rounded-t-xl border border-current/25 bg-white/75 shadow-[0_3px_12px_rgba(36,20,46,0.15)] transition-transform duration-500 group-hover:-translate-y-1 dark:bg-white/10">
          <span className="absolute inset-x-5 top-4 h-px bg-current/20" />
          <span className="absolute inset-x-8 top-7 h-px bg-current/15" />
          <span className="absolute left-1/2 top-3 -translate-x-1/2 text-xs opacity-50">✦</span>
        </span>
        <svg viewBox="0 0 240 132" className="absolute inset-x-0 bottom-0 h-[88%] w-full drop-shadow-[0_8px_8px_rgba(30,16,40,0.22)]" fill="none">
          <rect x="17" y="25" width="206" height="94" rx="17" fill="currentColor" fillOpacity=".18" stroke="currentColor" strokeOpacity=".78" strokeWidth="2.5" />
          <path d="M20 39 105 98a25 25 0 0 0 30 0l85-59" stroke="currentColor" strokeOpacity=".82" strokeWidth="3" strokeLinecap="round" />
          <path d="m20 114 67-52m133 52-67-52" stroke="currentColor" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 41 105 98a25 25 0 0 0 30 0l87-57-102 62z" fill="currentColor" fillOpacity=".16" />
        </svg>
        <span className={`relative z-10 mt-5 grid h-12 w-12 place-items-center rounded-full border-2 text-xl shadow-[0_5px_14px_rgba(35,18,45,0.28)] transition duration-500 group-hover:scale-110 group-hover:rotate-6 ${style.seal}`}>
          <span className="absolute inset-1 rounded-full border border-current/35" />
          <span className="relative">{type === "morning" ? "☀" : type === "extra" ? "♥" : "✦"}</span>
        </span>
      </span>

      <span className={`mt-auto block w-full font-aref font-bold leading-relaxed ${compact ? "text-lg" : "text-xl"}`}>
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
