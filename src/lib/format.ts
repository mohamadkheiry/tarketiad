export const faNumber = new Intl.NumberFormat("fa-IR");

export function faDate(value: Date | string) {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export const statusLabels: Record<string, string> = {
  NEW: "جدید",
  CONTACTED: "تماس گرفته شد",
  APPOINTMENT: "نوبت ثبت شد",
  CLOSED: "بسته‌شده",
  ARCHIVED: "بایگانی",
};
