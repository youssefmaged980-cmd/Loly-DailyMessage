import { TimeTogether } from "@/types";

/**
 * Returns today's date formatted as YYYY-MM-DD specifically for Cairo/Egypt timezone.
 * This guarantees midnight unlocking happens precisely at 12:00 AM Cairo time.
 */
export function getEgyptTodayString(): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Africa/Cairo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date());
  } catch {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}

/**
 * Formats a date string (YYYY-MM-DD or ISO) into Arabic full text.
 * Example: "السبت، 19 سبتمبر 2026"
 */
export function formatDateArabic(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return date.toLocaleDateString('ar-EG-u-nu-latn', options);
}

/**
 * Calculates the exact elapsed time together from the anniversary date.
 */
export function calculateTimeTogether(startDateStr: string = "2024-02-25T00:00:00"): TimeTogether {
  const now = new Date();
  const startDate = new Date(startDateStr);
  const diffTime = Math.max(0, now.getTime() - startDate.getTime());

  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffTime / 1000 / 60) % 60);
  const seconds = Math.floor((diffTime / 1000) % 60);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return {
    days: formatNumber(days),
    hours: formatNumber(hours),
    minutes: formatNumber(minutes),
    seconds: formatNumber(seconds)
  };
}

export interface SpecialOccasion {
  id: string;
  message: string;
}

/**
 * Checks if the given date matches any special milestones and returns the corresponding celebration.
 * @param date The date to check
 */
export function getSpecialOccasion(date: Date = new Date()): SpecialOccasion | null {
  const day = date.getDate();
  const month = date.getMonth() + 1; // 1-indexed (1-12)

  if (month === 1 && day === 1) {
    return {
      id: "NEW_YEAR",
      message: "كل سنة وانتي عامي الجميل والوحيد والاول والاخير بحبك"
    };
  }

  if (month === 7 && day === 8) {
    return {
      id: "BIRTHDAY",
      message: "كل سنة وبنتي اجمل وحدة فالدنيا دي كلها بحبك"
    };
  }

  if (month === 2 && day === 14) {
    return {
      id: "VALENTINE_GLOBAL",
      message: "كل عيد حب وانتي حبيبتي ونور عيني"
    };
  }

  if (month === 11 && day === 4) {
    return {
      id: "VALENTINE_EGYPT",
      message: "كل عيد حب وحنااا سوا يا روح قلبي"
    };
  }

  return null;
}
