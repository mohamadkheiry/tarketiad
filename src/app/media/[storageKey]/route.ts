import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeMediaPath } from "@/lib/media-storage";

export const runtime = "nodejs";

export async function GET(request: NextRequest, context: { params: Promise<{ storageKey: string }> }) {
  const { storageKey } = await context.params;
  const item = await db.mediaItem.findUnique({ where: { storageKey } });
  const publiclyVisible = item?.active && (item.category !== "RECOVERY_STORY" || item.consentConfirmed);
  if (!item || (!publiclyVisible && !(await getSession()))) return new NextResponse("Not found", { status: 404 });

  try {
    const filePath = safeMediaPath(storageKey);
    const fileStat = await stat(filePath);
    const range = request.headers.get("range");
    const commonHeaders = {
      "Accept-Ranges": "bytes",
      "Content-Type": item.mimeType,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": publiclyVisible && item.category === "ACTIVITY" ? "public, max-age=86400" : "private, no-store",
    };

    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match) return new NextResponse(null, { status: 416 });
      const suffixLength = !match[1] && match[2] ? Number(match[2]) : 0;
      const start = suffixLength ? Math.max(fileStat.size - suffixLength, 0) : match[1] ? Number(match[1]) : 0;
      const end = suffixLength ? fileStat.size - 1 : match[2] ? Math.min(Number(match[2]), fileStat.size - 1) : fileStat.size - 1;
      if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start > end || start >= fileStat.size) {
        return new NextResponse(null, { status: 416, headers: { "Content-Range": `bytes */${fileStat.size}` } });
      }
      const stream = Readable.toWeb(createReadStream(filePath, { start, end })) as ReadableStream;
      return new NextResponse(stream, {
        status: 206,
        headers: { ...commonHeaders, "Content-Length": String(end - start + 1), "Content-Range": `bytes ${start}-${end}/${fileStat.size}` },
      });
    }

    const stream = Readable.toWeb(createReadStream(filePath)) as ReadableStream;
    return new NextResponse(stream, { headers: { ...commonHeaders, "Content-Length": String(fileStat.size) } });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
