export interface Message {
  id: string;
  date: string;
  title?: string;
  message: string;
  createdAt?: string;
}

export interface TimeTogether {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}
