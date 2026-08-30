import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { MediaCategory } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { requireApiSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { hasValidSignature, isSupportedMimeType, maxFileSize, mediaTypes, safeMediaPath, uploadDirectory } from "@/lib/media-storage";
import { normalizeVideoForWeb } from "@/lib/video-processing";

export const runtime = "nodejs";

function clean(value: unknown, max: number) {
  return String(value || "").trim().slice(0, max);
}

function boolean(value: unknown) {
  return value === true || value === "true" || value === "on";
}

function validCategory(value: unknown): value is MediaCategory {
  return Object.values(MediaCategory).includes(value as MediaCategory);
}

export async function POST(request: NextRequest) {
  const user = await requireApiSession();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const cleanupPaths = new Set<string>();
  try {
    const form = await request.formData();
    const file = form.get("file");
    const title = clean(form.get("title"), 160);
    const category = form.get("category");
    const consentConfirmed = boolean(form.get("consentConfirmed"));
    const consentReference = clean(form.get("consentReference"), 240);
    const active = boolean(form.get("active"));

    if (!(file instanceof File) || !title || !validCategory(category)) {
      return NextResponse.json({ message: "فایل، عنوان و دسته‌بندی الزامی است." }, { status: 400 });
    }
    if (!isSupportedMimeType(file.type)) {
      return NextResponse.json({ message: "فرمت مجاز نیست. تصویر JPG/PNG/WebP یا ویدیوی MP4/WebM بارگذاری کنید." }, { status: 415 });
    }

    const definition = mediaTypes[file.type];
    if (file.size <= 0 || file.size > maxFileSize(definition.kind)) {
      const limit = maxFileSize(definition.kind) / 1024 / 1024;
      return NextResponse.json({ message: `حجم فایل باید کمتر از ${limit} مگابایت باشد.` }, { status: 413 });
    }
    if (category === MediaCategory.RECOVERY_STORY && active && (!consentConfirmed || !consentReference)) {
      return NextResponse.json({ message: "برای انتشار روایت بهبودی، تأیید و مرجع رضایت آگاهانه را ثبت کنید." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!hasValidSignature(buffer, file.type)) {
      return NextResponse.json({ message: "ساختار فایل با فرمت انتخاب‌شده مطابقت ندارد." }, { status: 415 });
    }

    let storageKey = `${randomUUID()}.${definition.extension}`;
    await mkdir(uploadDirectory(), { recursive: true });
    const sourcePath = safeMediaPath(storageKey);
    cleanupPaths.add(sourcePath);
    await writeFile(sourcePath, buffer, { flag: "wx" });

    let storedMimeType = file.type;
    let storedFileSize = file.size;
    if (definition.kind === "VIDEO") {
      const normalizedStorageKey = `${randomUUID()}.mp4`;
      const normalizedPath = safeMediaPath(normalizedStorageKey);
      cleanupPaths.add(normalizedPath);
      storedFileSize = await normalizeVideoForWeb(sourcePath, normalizedPath);
      if (storedFileSize > maxFileSize("VIDEO")) throw new Error("Normalized video exceeds upload limit");
      await unlink(sourcePath);
      cleanupPaths.delete(sourcePath);
      storageKey = normalizedStorageKey;
      storedMimeType = "video/mp4";
    }

    const item = await db.$transaction(async (transaction) => {
      const created = await transaction.mediaItem.create({
        data: {
          title,
          caption: clean(form.get("caption"), 2000) || null,
          altText: clean(form.get("altText"), 240) || title,
          personName: category === MediaCategory.RECOVERY_STORY ? clean(form.get("personName"), 100) || null : null,
          type: definition.kind,
          category,
          storageKey,
          mimeType: storedMimeType,
          fileSize: storedFileSize,
          consentConfirmed: category === MediaCategory.RECOVERY_STORY ? consentConfirmed : false,
          consentReference: category === MediaCategory.RECOVERY_STORY && consentConfirmed ? consentReference || null : null,
          featured: boolean(form.get("featured")),
          active,
          order: Number(form.get("order")) || 0,
        },
      });
      await transaction.auditLog.create({ data: { action: "CREATE", entity: "MediaItem", entityId: created.id, summary: `رسانه «${created.title}» بارگذاری شد.`, userId: user.id } });
      return created;
    });
    cleanupPaths.clear();
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    await Promise.all([...cleanupPaths].map((filePath) => unlink(filePath).catch(() => undefined)));
    console.error("Media upload or normalization failed", error);
    return NextResponse.json({ message: "بارگذاری یا آماده‌سازی فایل انجام نشد. از سالم‌بودن فایل مطمئن شوید و دوباره تلاش کنید." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await requireApiSession();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const id = clean(body.id, 80);
    const category = body.category;
    const title = clean(body.title, 160);
    const consentConfirmed = boolean(body.consentConfirmed);
    const consentReference = clean(body.consentReference, 240);
    const active = boolean(body.active);
    if (!id || !title || !validCategory(category)) return NextResponse.json({ message: "اطلاعات رسانه کامل نیست." }, { status: 400 });
    if (category === MediaCategory.RECOVERY_STORY && active && (!consentConfirmed || !consentReference)) {
      return NextResponse.json({ message: "برای انتشار روایت بهبودی، تأیید و مرجع رضایت آگاهانه را ثبت کنید." }, { status: 400 });
    }
    const item = await db.mediaItem.update({
      where: { id },
      data: {
        title,
        caption: clean(body.caption, 2000) || null,
        altText: clean(body.altText, 240) || title,
        personName: category === MediaCategory.RECOVERY_STORY ? clean(body.personName, 100) || null : null,
        category,
        consentConfirmed: category === MediaCategory.RECOVERY_STORY ? consentConfirmed : false,
        consentReference: category === MediaCategory.RECOVERY_STORY && consentConfirmed ? consentReference || null : null,
        featured: boolean(body.featured),
        active,
        order: Number(body.order) || 0,
      },
    });
    await db.auditLog.create({ data: { action: "UPDATE", entity: "MediaItem", entityId: item.id, summary: `رسانه «${item.title}» ویرایش شد.`, userId: user.id } });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ message: "ویرایش رسانه انجام نشد." }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await requireApiSession();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await request.json();
    const item = await db.mediaItem.delete({ where: { id: clean(id, 80) } });
    await db.auditLog.create({ data: { action: "DELETE", entity: "MediaItem", entityId: item.id, summary: `رسانه «${item.title}» حذف شد.`, userId: user.id } });
    await unlink(safeMediaPath(item.storageKey)).catch(() => undefined);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "حذف رسانه انجام نشد." }, { status: 400 });
  }
}
