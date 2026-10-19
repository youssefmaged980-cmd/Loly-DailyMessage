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
      aria-label={`افتح ${details.label}: ${message.title || formattedDate}`}
      className={`group relative flex w-full flex-col overflow-hidden rounded-[1.75rem] border p-4 text-right shadow-[0_8px_24px_rgba(74,42,112,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(142,74,159,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 ${compact ? "min-h-48" : "min-h-56"} ${style.card}`}
      dir="rtl"
    >
      <div className="flex w-full items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-markazi text-base font-bold ${style.badge}`}>
          <span aria-hidden="true">{details.icon}</span>{message.typeLabel?.trim() || details.label}
        </span>
        <span className="font-markazi text-sm opacity-75">{formattedDate}</span>
      </div>

      <span className={`relative mx-auto my-3 flex h-24 w-full max-w-[15rem] items-center justify-center ${style.envelope}`} aria-hidden="true">
        <svg viewBox="0 0 240 132" className="absolute inset-0 h-full w-full drop-shadow-md" fill="none">
          <rect x="17" y="25" width="206" height="94" rx="17" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeOpacity=".72" strokeWidth="2.5" />
          <path d="M20 39 105 98a25 25 0 0 0 30 0l85-59" stroke="currentColor" strokeOpacity=".8" strokeWidth="3" strokeLinecap="round" />
          <path d="m20 114 67-52m133 52-67-52" stroke="currentColor" strokeOpacity=".4" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 41 105 98a25 25 0 0 0 30 0l87-57" fill="currentColor" fillOpacity=".09" />
        </svg>
        <span className={`relative z-10 mt-1 grid h-11 w-11 place-items-center rounded-full border-2 text-xl shadow-lg transition duration-300 group-hover:scale-110 group-hover:rotate-6 ${style.seal}`}>
          {type === "morning" ? "☀" : type === "extra" ? "♥" : "✦"}
        </span>
      </span>

      <span className={`mt-auto block w-full font-aref font-bold leading-snug ${compact ? "text-lg" : "text-xl"}`}>
        {message.title || details.caption}
      </span>
      {message.description && (
        <span className="mt-1 block line-clamp-2 w-full font-markazi text-base leading-snug opacity-80">
          {message.description}
        </span>
      )}
    </button>
  );
}
