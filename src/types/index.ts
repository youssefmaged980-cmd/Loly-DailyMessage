export type MessageType = "morning" | "extra" | "special" | "apology";
export type EnvelopeIcon = "heart" | "sun" | "sparklingHeart" | "heartWithArrow" | "giftHeart" | "rose" | "bouquet" | "couple" | "handsHeart" | "loveLetter" | "infinity" | "rings" | "ribbon" | "dove" | "lily";

export const ENVELOPE_ICON_DETAILS: Record<EnvelopeIcon, { label: string }> = {
  heart: { label: "قلب مرسوم" },
  sun: { label: "شروق رومانسي" },
  sparklingHeart: { label: "قلب محاط بالنجوم" },
  heartWithArrow: { label: "قلب وسهم" },
  giftHeart: { label: "قلب مربوط بشريطة" },
  rose: { label: "وردة طويلة" },
  bouquet: { label: "باقة زهور" },
  couple: { label: "قلبان متعانقان" },
  handsHeart: { label: "قلب بين كفين" },
  loveLetter: { label: "خطاب حب" },
  infinity: { label: "علامة حب لا ينتهي" },
  rings: { label: "خاتمان متداخلان" },
  ribbon: { label: "فيونكة رومانسية" },
  dove: { label: "حمامتان متقابلتان" },
  lily: { label: "زهرة زنبق" },
};

export const MESSAGE_TYPE_DETAILS: Record<MessageType, { label: string; caption: string }> = {
  morning: { label: "رسالة صباحية", caption: "بداية حلوة ليومك" },
  extra: { label: "رسالة جميلة", caption: "كلمة حب زيادة" },
  special: { label: "رسالة مميزة", caption: "رسالة معمولة عشانك" },
  apology: { label: "رسالة مصالحة", caption: "حقك عليا يا حبيبتي" },
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
  const icon = message.envelopeIcon as string | undefined;
  return icon && Object.prototype.hasOwnProperty.call(ENVELOPE_ICON_DETAILS, icon) ? icon as EnvelopeIcon : "heart";
}

export interface TimeTogether {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}
