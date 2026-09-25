export interface Message {
  id: string;
  date: string;
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
