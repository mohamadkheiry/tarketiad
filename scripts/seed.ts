import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const services = [
  {
    slug: "assessment",
    title: "ارزیابی و برنامه درمانی تخصصی",
    summary: "شناخت دقیق شرایط جسمی، روانی و خانوادگی پیش از آغاز درمان.",
    description: "تیم تخصصی پس از گفت‌وگو و ارزیابی اولیه، مسیر درمان را متناسب با نیازها و شرایط هر فرد طراحی می‌کند.",
    icon: "clipboard",
    order: 1,
  },
  {
    slug: "detox",
    title: "سم‌زدایی ایمن و تحت نظارت",
    summary: "پایش حرفه‌ای علائم و حفظ آرامش فرد در مرحله آغازین.",
    description: "فرایند سم‌زدایی با بررسی پزشکی و مراقبت مستمر انجام می‌شود تا ریسک‌ها مدیریت و شرایط فرد پایدار شود.",
    icon: "shield",
    order: 2,
  },
  {
    slug: "therapy",
    title: "روان‌درمانی فردی و گروهی",
    summary: "شناخت الگوها و یادگیری مهارت‌های پایدار برای ادامه مسیر.",
    description: "جلسات فردی و گروهی به شناخت ریشه‌ها، تنظیم هیجان و ساختن راهکارهای سالم برای مواجهه با موقعیت‌های پرخطر کمک می‌کند.",
    icon: "users",
    order: 3,
  },
  {
    slug: "family",
    title: "توانمندسازی خانواده",
    summary: "آموزش و همراهی خانواده برای ساختن یک محیط حمایتگر.",
    description: "خانواده بخشی از مسیر بازتوانی است. جلسات آموزشی و حمایتی، نقش‌ها و مرزهای سالم را روشن می‌کند.",
    icon: "heart",
    order: 4,
  },
  {
    slug: "aftercare",
    title: "پیشگیری از بازگشت و پیگیری",
    summary: "برنامه ادامه درمان برای حفظ دستاوردها پس از ترخیص.",
    description: "پیگیری منظم، برنامه شخصی پیشگیری از بازگشت و دسترسی به حمایت تخصصی، تداوم مسیر را آسان‌تر می‌کند.",
    icon: "route",
    order: 5,
  },
];

const faqs = [
  {
    question: "آیا همه مراحل درمان محرمانه انجام می‌شود؟",
    answer: "بله. حفظ حریم خصوصی مراجعان و خانواده‌ها یکی از اصول اصلی مرکز است و اطلاعات تنها در چارچوب درمان و ضوابط قانونی نگهداری می‌شود.",
    order: 1,
  },
  {
    question: "مدت زمان درمان چقدر است؟",
    answer: "مدت درمان برای همه یکسان نیست و پس از ارزیابی اولیه، با توجه به شرایط جسمی، روانی و حمایت خانوادگی پیشنهاد می‌شود.",
    order: 2,
  },
  {
    question: "آیا خانواده در روند درمان نقش دارد؟",
    answer: "در صورت رضایت مراجع و متناسب با برنامه درمان، خانواده با آموزش و جلسات حمایتی در فرایند بازتوانی مشارکت می‌کند.",
    order: 3,
  },
  {
    question: "پس از ترخیص، پیگیری و حمایت ادامه خواهد داشت؟",
    answer: "بله. برنامه مراقبت پس از ترخیص و پیگیری‌های منظم برای کاهش احتمال بازگشت و حفظ دستاوردهای درمان طراحی می‌شود.",
    order: 4,
  },
];

const content = [
  ["hero.title", "عنوان اصلی", "بازگشت به زندگی، از همین امروز", "home"],
  ["hero.description", "توضیح عنوان اصلی", "در سپیدار، درمان اعتیاد با همراهی تیم تخصصی، برنامه شخصی‌سازی‌شده و حفظ کامل حریم خصوصی آغاز می‌شود.", "home"],
  ["journey.title", "عنوان مسیر درمان", "یک مسیر روشن برای شروع دوباره", "home"],
  ["facility.title", "عنوان معرفی مرکز", "محیطی امن برای بازسازی", "home"],
  ["facility.description", "توضیح معرفی مرکز", "فضای سپیدار با طراحی آرامش‌بخش، حریم خصوصی کامل و امکانات رفاهی مناسب، تجربه‌ای امن و محترمانه را برای شما فراهم می‌کند.", "home"],
  ["cta.title", "عنوان دعوت به تماس", "برای شروع، فقط یک گفت‌وگو کافی‌ست", "home"],
  ["cta.description", "توضیح دعوت به تماس", "ما اینجاییم تا بدون قضاوت، اولین قدم را کنار شما برداریم.", "home"],
];

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@sepidar.local";
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be set and contain at least 12 characters");
  }

  await prisma.user.upsert({
    where: { email },
    update: { active: true, role: UserRole.ADMIN },
    create: {
      name: "مدیر سیستم",
      email,
      passwordHash: await hash(password, 12),
      role: UserRole.ADMIN,
    },
  });

  for (const service of services) {
    await prisma.service.upsert({ where: { slug: service.slug }, update: {}, create: service });
  }
  if ((await prisma.faq.count()) === 0) await prisma.faq.createMany({ data: faqs });
  for (const [key, label, value, group] of content) {
    await prisma.contentEntry.upsert({
      where: { key },
      update: {},
      create: { key, label, value, group },
    });
  }
  await prisma.siteSetting.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
}

main()
  .then(() => console.log("Database seeded successfully."))
  .finally(() => prisma.$disconnect());
