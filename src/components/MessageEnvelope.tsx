"use client";

import RomanticMark from "@/components/RomanticMark";
import { getEnvelopeIcon, getMessageTypeLabel, Message, MESSAGE_TYPE_DETAILS } from "@/types";

type Props = {
  message: Message;
  onOpen: (message: Message) => void;
  compact?: boolean;
};

export default function MessageEnvelope({ message, onOpen, compact = false }: Props) {
  const type = message.type ?? "morning";
  const details = MESSAGE_TYPE_DETAILS[type];
  const envelopeIcon = getEnvelopeIcon(message);
  const style = {
    morning: {
      shape: "rounded-[2.3rem_1.3rem_2.3rem_1.3rem]",
      card: "border-[#D9B76F]/55 bg-gradient-to-br from-[#FFFDF5] via-[#FFF6E7] to-[#F7E9D7] text-[#684A69] dark:from-[#302536] dark:via-[#30233A] dark:to-[#382A36] dark:text-[#FFF2D2]",
      badge: "border-[#D4AD5D]/45 bg-[#FFF7DF]/90 text-[#85632B] dark:bg-[#493B3A] dark:text-[#F7D991]",
      envelope: "text-[#C99D50]",
      seal: "border-[#F6D98D] bg-gradient-to-br from-[#FFF0AF] to-[#E7B95D] text-[#765322] shadow-[#D29C45]/35",
    },
    extra: {
      shape: "rounded-[1.35rem_2.3rem_1.35rem_2.3rem]",
      card: "border-[#AD83D5]/60 bg-gradient-to-br from-[#FCF8FF] via-[#F1E8FC] to-[#E6D9F5] text-[#533C70] shadow-[0_12px_34px_rgba(104,65,142,0.19)] dark:from-[#2A2036] dark:via-[#30213F] dark:to-[#211A30] dark:text-[#F3E7FF]",
      badge: "border-[#AE86D0]/55 bg-[#F6EEFF]/95 text-[#684786] dark:bg-[#3D2C50] dark:text-[#E3C7FF]",
      envelope: "text-[#9367B8]",
      seal: "border-[#D7BFF0] bg-gradient-to-br from-[#F4E9FF] to-[#9870C2] text-white shadow-[#8F65B8]/40",
    },
    special: {
      shape: "rounded-[2rem]",
      card: "border-[#D9B66B]/60 bg-gradient-to-br from-[#33243D] via-[#261B32] to-[#1D1729] text-[#FFF4D8] shadow-[0_10px_35px_rgba(39,20,52,0.25)]",
      badge: "border-[#D8B35E]/45 bg-[#574238]/70 text-[#FFE4A5]",
      envelope: "text-[#D9AE5C]",
      seal: "border-[#F6D994] bg-gradient-to-br from-[#FFE9A8] to-[#C99139] text-[#4D2D46] shadow-[#E2B752]/35",
    },
    apology: {
      shape: "rounded-[2.4rem_2.4rem_1.2rem_1.2rem]",
      card: "border-[#D77C91]/65 bg-gradient-to-br from-[#FFF8F7] via-[#FBE8E8] to-[#F1DADD] text-[#713F50] shadow-[0_12px_36px_rgba(150,70,94,0.2)] dark:from-[#35212D] dark:via-[#3B202F] dark:to-[#281A2B] dark:text-[#FFE9EE]",
      badge: "border-[#D77C91]/55 bg-[#FFF0F1]/95 text-[#954B62] dark:bg-[#512B3B] dark:text-[#FFC3D0]",
      envelope: "text-[#BE637F]",
      seal: "border-[#F6C6D0] bg-gradient-to-br from-[#FFE9EC] to-[#CE718B] text-[#713F50] shadow-[#C5657F]/40",
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
      className={`group relative flex w-full flex-col overflow-hidden border p-4 text-right shadow-[0_14px_38px_rgba(42,20,54,0.17)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(142,74,159,0.26)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-2 sm:p-5 ${style.shape} ${compact ? "min-h-52" : "min-h-60"} ${style.card}`}
      dir="rtl"
    >
      <span aria-hidden="true" className={`pointer-events-none absolute inset-[7px] border border-white/35 dark:border-white/10 ${style.shape}`} />
      <span aria-hidden="true" className="pointer-events-none absolute -left-12 -top-14 h-36 w-36 rounded-full bg-white/25 blur-3xl transition-opacity group-hover:opacity-80" />
      <div className="flex w-full items-center justify-between gap-2">
        <span className={`inline-flex max-w-[70%] items-center gap-1.5 rounded-full border px-3.5 py-1 font-markazi text-base font-bold shadow-sm ${style.badge}`}>
          <RomanticMark kind={envelopeIcon} className="h-4 w-4 shrink-0" />{getMessageTypeLabel(message)}
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
        <svg viewBox="0 0 240 132" className={`absolute inset-x-0 bottom-0 h-full w-full drop-shadow-[0_9px_10px_rgba(30,16,40,0.2)] transition-transform duration-500 group-hover:-translate-y-0.5 ${type === "extra" ? "rotate-[-3deg]" : type === "special" ? "scale-105" : type === "apology" ? "translate-y-1" : ""}`} fill="none">
          {type === "morning" && <>
            <path d="M23 103V43a9 9 0 0 1 9-9h176a9 9 0 0 1 9 9v60" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeOpacity=".78" strokeWidth="3" />
            <path d="m23 43 80 53a16 16 0 0 0 34 0l80-53" stroke="currentColor" strokeOpacity=".84" strokeWidth="3" strokeLinecap="round" />
            <path d="M90 36a30 30 0 0 1 60 0" stroke="currentColor" strokeOpacity=".46" strokeWidth="2" />
            <path d="m30 113 61-49m118 49-61-49" stroke="currentColor" strokeOpacity=".45" strokeWidth="2" />
          </>}
          {type === "extra" && <>
            <rect x="28" y="18" width="184" height="88" rx="13" fill="currentColor" fillOpacity=".06" stroke="currentColor" strokeOpacity=".36" strokeWidth="2" />
            <path d="M18 48 89 97q31 24 62 0l71-49v56a12 12 0 0 1-12 12H30a12 12 0 0 1-12-12V48Z" fill="currentColor" fillOpacity=".2" stroke="currentColor" strokeOpacity=".8" strokeWidth="2.6" />
            <path d="m19 48 85 49a30 30 0 0 0 32 0l85-49" stroke="currentColor" strokeOpacity=".78" strokeWidth="2.5" />
            <path d="m29 114 55-43m127 43-55-43" stroke="currentColor" strokeOpacity=".4" strokeWidth="2" />
          </>}
          {type === "special" && <>
            <path d="m120 9 103 43v38l-103 35L17 90V52L120 9Z" fill="currentColor" fillOpacity=".16" stroke="currentColor" strokeOpacity=".9" strokeWidth="3" />
            <path d="m18 52 87 46a30 30 0 0 0 30 0l87-46M18 90l75-43m129 43-75-43" stroke="currentColor" strokeOpacity=".65" strokeWidth="2.5" />
            <path d="m120 18 5 8 9 2-9 3-5 9-4-9-9-3 9-2 4-8Z" fill="currentColor" fillOpacity=".72" />
          </>}
          {type === "apology" && <>
            <path d="M25 30h190a13 13 0 0 1 13 13v55a13 13 0 0 1-13 13H25a13 13 0 0 1-13-13V43a13 13 0 0 1 13-13Z" fill="currentColor" fillOpacity=".14" stroke="currentColor" strokeOpacity=".78" strokeWidth="2.7" strokeDasharray="5 3" />
            <path d="M15 43 92 87q28 18 56 0l77-44" stroke="currentColor" strokeOpacity=".85" strokeWidth="3" strokeLinecap="round" />
            <path d="m16 103 70-47m138 47-70-47" stroke="currentColor" strokeOpacity=".55" strokeWidth="2.5" />
            <path d="M103 76c0-8 10-9 17-1 7-8 17-7 17 1 0 7-17 17-17 17s-17-10-17-17Z" fill="currentColor" fillOpacity=".55" />
          </>}
        </svg>
        <span className={`relative z-10 mt-5 grid h-12 w-12 place-items-center rounded-full border-2 text-xl shadow-[0_5px_14px_rgba(35,18,45,0.25)] ring-4 ring-white/20 transition duration-500 group-hover:scale-110 group-hover:rotate-6 ${style.seal}`}>
          <span className="absolute inset-1 rounded-full border border-current/30" />
          <RomanticMark kind={envelopeIcon} className="relative h-6 w-6" />
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
