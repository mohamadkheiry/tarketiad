# راهنمای استقرار و پشتیبانی

این راهنما روش استاندارد انتشار پروژه با Docker Compose، کنترل سلامت، پشتیبان‌گیری، بازگردانی و به‌روزرسانی را توضیح می‌دهد.

## معماری تولید

```text
کاربر → HTTP/HTTPS یا Reverse Proxy → sepidar_app:3000 → sepidar_db:5432
                                          │
                                          └→ Volume دائمی PostgreSQL
```

در `docker-compose.yml` فقط پورت اپلیکیشن روی Host منتشر می‌شود. PostgreSQL در شبکه داخلی Compose باقی می‌ماند.

## آماده‌سازی سرور

حداقل پیشنهادی:

- Ubuntu 24.04 LTS یا جدیدتر
- 2 vCPU، 2 GB RAM و 10 GB فضای آزاد
- Docker Engine و Docker Compose Plugin
- دسترسی SSH با کاربر عضو گروه `docker`

بررسی:

```bash
docker --version
docker compose version
df -h
```

## انتشار اولیه

```bash
git clone https://github.com/mohamadkheiry/tarketiad.git
cd tarketiad
cp .env.production.example .env
chmod 600 .env
```

مقادیر `.env` را با رمزهای مستقل و تصادفی تنظیم کنید. هرگز گذرواژه SSH، GitHub یا سرویس دیگری را برای دیتابیس یا مدیر سایت دوباره استفاده نکنید.

نمونه تولید Secret:

```bash
openssl rand -base64 48
openssl rand -base64 32
```

اجرا:

```bash
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 app
curl -f http://127.0.0.1:8012/api/health
```

در اولین اجرا، Container اپلیکیشن Schema دیتابیس را همگام و داده پایه و مدیر اولیه را ایجاد می‌کند. Seed محتوای ویرایش‌شده را بازنویسی نمی‌کند.

## انتشار نسخه جدید

```bash
cd /path/to/tarketiad
git pull --ff-only
docker compose build --pull app
docker compose up -d
docker compose ps
curl -f http://127.0.0.1:8012/api/health
```

پس از انتشار، ورود پنل، صفحه اصلی و ثبت یک درخواست آزمایشی را کنترل کنید.

## اتصال Nginx و HTTPS

برای دامنه واقعی، پورت اپ را فقط روی Loopback منتشر کنید:

```env
APP_BIND_IP=127.0.0.1
APP_PORT=8012
NEXT_PUBLIC_SITE_URL=https://example.com
COOKIE_SECURE=true
```

نمونه Nginx:

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    client_max_body_size 2m;

    location / {
        proxy_pass http://127.0.0.1:8012;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

سپس با Certbot یا سرویس مدیریت‌شده، TLS را فعال کنید. تا پیش از HTTPS، سامانه برای دریافت داده حساس روی اینترنت عمومی مناسب نیست.

## پشتیبان‌گیری

پیشنهاد حداقل: روزانه، نگهداری ۱۴ نسخه و یک نسخه رمزگذاری‌شده خارج از سرور.

```bash
mkdir -p backups
docker compose exec -T db pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc > "backups/sepidar-$(date +%F-%H%M).dump"
```

فایل‌های `.env` و تنظیمات Reverse Proxy نیز باید جداگانه و رمزگذاری‌شده نگهداری شوند. تصاویر پروژه داخل Git هستند و با Clone بازیابی می‌شوند.

## اعمال نسخه مرجع محتوا

Seed معمولی محتوای ویرایش‌شده در پنل را حفظ می‌کند. تنها زمانی که می‌خواهید متن‌های مرجع موجود در کد عمداً جایگزین محتوای فعلی شوند، پس از تهیه پشتیبان اجرا کنید:

```bash
docker compose exec -e FORCE_CONTENT_SEED=true app npm run db:seed
```

این فرمان خدمات، پرسش‌ها و متن‌های اصلی را بازنویسی می‌کند، اما تنظیمات تماس و درخواست‌های مشاوره را حذف نمی‌کند. سپس صفحه اصلی و پنل محتوا را بررسی کنید.

## بازگردانی دیتابیس

این عملیات داده فعلی را جایگزین می‌کند؛ ابتدا نسخه پشتیبان جدید بگیرید و مسیر فایل را دقیق بررسی کنید.

```bash
docker compose stop app
docker compose exec -T db dropdb -U "$POSTGRES_USER" --if-exists "$POSTGRES_DB"
docker compose exec -T db createdb -U "$POSTGRES_USER" "$POSTGRES_DB"
docker compose exec -T db pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists < backups/FILE.dump
docker compose start app
curl -f http://127.0.0.1:8012/api/health
```

## مانیتورینگ و عیب‌یابی

```bash
docker compose ps
docker compose logs -f --tail=200 app
docker compose logs -f --tail=200 db
docker stats sepidar_app sepidar_db
curl -i http://127.0.0.1:8012/api/health
```

پاسخ سالم:

```json
{"status":"ok","database":"connected","timestamp":"..."}
```

کد 503 یعنی اپ اجراست اما دیتابیس در دسترس نیست. ابتدا Health و Log کانتینر `db` و سپس `DATABASE_URL` را بررسی کنید.

## Rollback

قبل از هر انتشار، Tag نسخه پایدار بسازید. برای بازگشت:

```bash
git fetch --tags
git checkout <stable-tag>
docker compose up -d --build
```

اگر نسخه جدید Schema را به شکل ناسازگار تغییر داده است، فقط بازگشت کد کافی نیست و باید Backup سازگار دیتابیس نیز Restore شود.

## چک‌لیست امنیت تولید

- [ ] HTTPS معتبر و Redirect کامل HTTP به HTTPS
- [ ] `AUTH_SECRET` تصادفی و حداقل ۳۲ کاراکتر
- [ ] گذرواژه مستقل و قوی برای PostgreSQL و مدیر
- [ ] حذف یا غیرفعال‌سازی کاربران سابق
- [ ] محدودیت فایروال برای SSH و پورت اپ
- [ ] ورود SSH با Key و غیرفعال‌کردن Password در صورت امکان
- [ ] به‌روزرسانی ماهانه Imageها و وابستگی‌ها
- [ ] اجرای `npm audit --omit=dev` قبل از انتشار
- [ ] پشتیبان روزانه و تست فصلی Restore
- [ ] بازبینی Audit Log و درخواست‌های بایگانی‌شده
- [ ] سیاست رسمی حفظ و حذف داده‌های حساس

## برنامه پشتیبانی پیشنهادی

- روزانه: بررسی Health، خطاهای اپ و موفقیت Backup
- هفتگی: بررسی فضای Disk، درخواست‌های بدون پیگیری و کاربران فعال
- ماهانه: به‌روزرسانی امنیتی OS، Docker و npm؛ تست فرم و ورود
- فصلی: تست کامل Restore، بازبینی دسترسی‌ها و سیاست نگهداری داده

## نکته درباره اسرار

فایل `.env` باید فقط روی سرور و با Permission برابر `600` باشد. اسرار را در Issue، Commit، Screenshot یا پیام عمومی قرار ندهید. در صورت افشای احتمالی، Secret و گذرواژه‌ها را فوراً Rotate کنید.
