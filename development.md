# راهنمای توسعه

این سند برای توسعه‌دهنده‌ای نوشته شده که می‌خواهد بدون آشنایی قبلی، پروژه را اجرا، تغییر و عیب‌یابی کند.

## پیش‌نیازها

- Node.js نسخه 22 LTS یا جدیدتر
- npm نسخه 10 یا جدیدتر
- PostgreSQL نسخه 15 تا 17، یا Docker Desktop
- Git

## راه‌اندازی محیط توسعه

### روش پیشنهادی: دیتابیس با Docker، اپ با Node.js

1. فایل محیطی را بسازید:

   ```bash
   cp .env.example .env
   ```

2. یک PostgreSQL اجرا و `DATABASE_URL` را مطابق آن تنظیم کنید. نمونه:

   ```text
   postgresql://sepidar:dev-password@localhost:5432/sepidar?schema=public
   ```

3. وابستگی‌ها و دیتابیس را آماده کنید:

   ```bash
   npm ci
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. اپ را اجرا کنید:

   ```bash
   npm run dev
   ```

`http://localhost:3000` برای سایت و `/admin/login` برای پنل است.

## متغیرهای محیطی

| نام | اجباری | کاربرد |
| --- | --- | --- |
| `DATABASE_URL` | بله | اتصال PostgreSQL |
| `AUTH_SECRET` | بله | امضای JWT؛ حداقل ۳۲ کاراکتر تصادفی |
| `ADMIN_EMAIL` | برای Seed | ایمیل مدیر اولیه |
| `ADMIN_PASSWORD` | برای Seed | گذرواژه مدیر اولیه؛ حداقل ۱۲ کاراکتر |
| `NEXT_PUBLIC_SITE_URL` | توصیه‌شده | آدرس canonical سایت |
| `COOKIE_SECURE` | توصیه‌شده | در HTTPS برابر `true` و فقط برای بررسی LAN روی HTTP برابر `false` |
| `FORCE_CONTENT_SEED` | خیر | فقط هنگام اعمال عمدی محتوای مرجع برابر `true` شود؛ متن‌های فعلی پنل را بازنویسی می‌کند |

### به‌روزرسانی محتوای مرجع

اجرای معمول `npm run db:seed` داده‌های محتوایی موجود را حفظ می‌کند تا ویرایش‌های مدیر با راه‌اندازی مجدد از بین نرود. اگر نسخه مرجع داخل `scripts/seed.ts` تغییر کرده و قرار است عمداً روی دیتابیس اعمال شود:

```bash
FORCE_CONTENT_SEED=true npm run db:seed
```

این حالت خدمات، پرسش‌های متداول و متن‌های اصلی را به نسخه موجود در کد برمی‌گرداند. در محیط واقعی، ابتدا نسخه پشتیبان بگیرید و پس از اجرا صفحه عمومی را بررسی کنید.

برای ساخت secret در Linux/macOS:

```bash
openssl rand -base64 48
```

در PowerShell:

```powershell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(48))
```

## مدل داده

- `User`: کارکنان پنل، نقش و وضعیت دسترسی
- `ConsultationRequest`: فرم‌ها، وضعیت پیگیری و یادداشت داخلی
- `Service`: خدمات قابل نمایش در سایت
- `Faq`: پرسش و پاسخ قابل مدیریت
- `ContentEntry`: متن‌های کلیدی CMS با کلید یکتا
- `SiteSetting`: تماس، آدرس، ساعت کاری و پیام اضطراری
- `AuditLog`: رویدادهای مهم مدیریتی

پس از تغییر `prisma/schema.prisma`:

```bash
npm run db:generate
npm run db:push
```

برای محیط‌های بزرگ‌تر، به‌جای `db push` از Migrationهای نسخه‌دار Prisma استفاده کنید:

```bash
npx prisma migrate dev --name describe-change
npx prisma migrate deploy
```

## الگوی توسعه قابلیت جدید

1. مدل یا قرارداد داده را مشخص کنید.
2. اعتبارسنجی ورودی را در `src/lib/validation.ts` اضافه کنید.
3. Route Handler مربوط را در `src/app/api` ایجاد کنید.
4. برای عملیات مدیریتی `requireApiSession()` را فراخوانی کنید.
5. رابط را با اجزای کوچک در `src/components` بسازید.
6. حالت Loading، Error، Empty و Success را پوشش دهید.
7. `typecheck`، `lint` و `build` را اجرا کنید.
8. جریان اصلی را در مرورگر روی دسکتاپ و موبایل آزمایش کنید.

## قواعد رابط کاربری

- جهت کل سند RTL است؛ فقط شماره تلفن، ایمیل و شناسه‌های فنی `dir="ltr"` بگیرند.
- از متغیرهای رنگی `src/app/globals.css` استفاده کنید.
- پس‌زمینه اصلی سفید است؛ سبز جنگلی رنگ برند و زعفرانی فقط Accent است.
- متن واقعی UI باید HTML باشد، نه بخشی از تصویر.
- دکمه‌ها و فیلدها باید حالت Focus قابل مشاهده داشته باشند.
- انیمیشن باید `prefers-reduced-motion` را رعایت کند.
- از Cardهای تودرتو و شلوغی بصری خودداری کنید.

مرجع طراحی در `docs/design/homepage-concept.png` و `docs/design/admin-concept.png` نگهداری می‌شود.

## احراز هویت

1. کاربر ایمیل و گذرواژه را به `/api/auth/login` ارسال می‌کند.
2. گذرواژه با bcrypt بررسی می‌شود.
3. JWT با `AUTH_SECRET` امضا و در Cookie از نوع HttpOnly و SameSite=Lax قرار می‌گیرد.
4. صفحات مدیریت با `getSession()` و APIها با `requireApiSession()` محافظت می‌شوند.
5. نشست پس از ۸ ساعت منقضی می‌شود.

برای اتصال اینترنت عمومی، `secure` بودن Cookie در حالت Production فعال است؛ بنابراین HTTPS الزامی است.

## تست و کنترل کیفیت

پیش از Merge یا انتشار:

```bash
npm run typecheck
npm run lint
npm run build
npm audit --omit=dev
```

کنترل دستی ضروری:

- صفحه اصلی در عرض‌های ۳۹۰، ۷۶۸ و ۱۴۴۰ پیکسل
- بازشدن منوی موبایل و FAQ
- ثبت موفق و ناموفق فرم مشاوره
- ورود و خروج پنل
- جست‌وجو، انتخاب درخواست، تغییر وضعیت و ذخیره یادداشت
- CRUD خدمات و FAQ
- ویرایش محتوا و مشاهده نتیجه در صفحه اصلی
- ساخت کاربر Editor و کنترل دسترسی
- نبود خطای Console و خطای شبکه

## نگهداری محتوا

متن‌های اصلی از `ContentEntry` خوانده می‌شوند و Seed فقط مقدار اولیه را ایجاد می‌کند. اجرای دوباره Seed، محتوای ویرایش‌شده را بازنویسی نمی‌کند. خدمات نیز با `slug` یکتا Upsert می‌شوند، اما FAQ تنها وقتی جدول خالی باشد افزوده می‌شود.

## خطاهای رایج

### خطای اتصال Prisma

- صحت `DATABASE_URL` و دسترسی پورت PostgreSQL را بررسی کنید.
- `npx prisma db push` را اجرا کنید.
- در Docker، نام Host دیتابیس باید `db` باشد، نه `localhost`.

### ورود انجام نمی‌شود

- Seed را با `ADMIN_EMAIL` و `ADMIN_PASSWORD` صحیح اجرا کنید.
- طول `AUTH_SECRET` حداقل ۳۲ کاراکتر باشد.
- زمان سیستم سرور صحیح باشد؛ JWT به زمان وابسته است.

### تصاویر نمایش داده نمی‌شوند

- فایل‌های `public/images` باید در Artifact یا Image نهایی وجود داشته باشند.
- نام فایل‌ها به بزرگی و کوچکی حروف حساس است.

### بعد از تغییر Schema خطای TypeScript دیده می‌شود

```bash
npm run db:generate
npm run typecheck
```
