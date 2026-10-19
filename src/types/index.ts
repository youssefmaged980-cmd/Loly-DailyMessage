export type MessageType = "morning" | "extra" | "special";

export const MESSAGE_TYPE_DETAILS: Record<MessageType, { label: string; icon: string; caption: string }> = {
  morning: { label: "رسالة صباحية", icon: "☀️", caption: "بداية حلوة ليومك" },
  extra: { label: "رسالة إضافية", icon: "💌", caption: "كلمة حب زيادة" },
  special: { label: "رسالة مميزة", icon: "✦", caption: "رسالة معمولة عشانك" },
};

export interface Message {
  id: string;
  date: string;
  /** Existing Firestore documents without a type are treated as morning messages. */
  type?: MessageType;
  /** Custom label displayed on the envelope, such as "رسالة الصباح". */
  typeLabel?: string;
  title?: string;
  description?: string;
  message: string;
  createdAt?: string;
  reply?: string;
  reaction?: string;
}

export interface TimeTogether {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}
