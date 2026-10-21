export type MessageType = "morning" | "extra" | "special" | "apology";
export type EnvelopeIcon = "heart" | "sun" | "sparklingHeart" | "heartWithArrow" | "giftHeart" | "rose" | "bouquet" | "couple" | "handsHeart" | "loveLetter";

export const ENVELOPE_ICON_DETAILS: Record<EnvelopeIcon, { label: string; symbol: string }> = {
  heart: { label: "قلب", symbol: "💗" },
  sun: { label: "شمس", symbol: "☀️" },
  sparklingHeart: { label: "قلب لامع", symbol: "💖" },
  heartWithArrow: { label: "قلب بسهم", symbol: "💘" },
  giftHeart: { label: "قلب هدية", symbol: "💝" },
  rose: { label: "وردة", symbol: "🌹" },
  bouquet: { label: "باقة ورد", symbol: "💐" },
  couple: { label: "حضن وحب", symbol: "🥰" },
  handsHeart: { label: "قلب بإيدين", symbol: "🫶" },
  loveLetter: { label: "جواب حب", symbol: "💌" },
};

export const MESSAGE_TYPE_DETAILS: Record<MessageType, { label: string; icon: string; caption: string }> = {
  morning: { label: "رسالة صباحية", icon: "☀️", caption: "بداية حلوة ليومك" },
  extra: { label: "رسالة جميلة", icon: "💌", caption: "كلمة حب زيادة" },
  special: { label: "رسالة مميزة", icon: "✦", caption: "رسالة معمولة عشانك" },
  apology: { label: "رسالة مصالحة", icon: "🥺", caption: "حقك عليا يا حبيبتي" },
};

export interface Message {
  id: string;
  date: string;
  /** Existing Firestore documents without a type are treated as morning messages. */
  type?: MessageType;
  /** Icon shown on the envelope; existing messages default to a heart. */
  envelopeIcon?: EnvelopeIcon;
  /** Custom label displayed on the envelope, such as "رسالة الصباح". */
  typeLabel?: string;
  title?: string;
  description?: string;
  message: string;
  createdAt?: string;
  reply?: string;
  reaction?: string;
}

export function getMessageTypeLabel(message: Pick<Message, "type" | "typeLabel">): string {
  const savedLabel = message.typeLabel?.trim();
  const typeDefault = MESSAGE_TYPE_DETAILS[message.type ?? "morning"].label;
  return savedLabel && savedLabel !== typeDefault ? savedLabel : "بحبك يا لولو";
}

export function getEnvelopeIcon(message: Pick<Message, "envelopeIcon">): EnvelopeIcon {
  return message.envelopeIcon && message.envelopeIcon in ENVELOPE_ICON_DETAILS ? message.envelopeIcon : "heart";
}

export interface TimeTogether {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}
