import { open, stat } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { safeMediaPath } from "@/lib/media-storage";

export const runtime = "nodejs";

function fileWebStream(filePath: string, start: number, end: number) {
  let handle: Awaited<ReturnType<typeof open>> | null = null;
  let position = start;
  let finished = false;

  async function finish(controller?: ReadableStreamDefaultController<Uint8Array>) {
    if (finished) return;
    finished = true;
    const current = handle;
    handle = null;
    await current?.close().catch(() => undefined);
    controller?.close();
  }

  return new ReadableStream<Uint8Array>({
    async start() {
      handle = await open(filePath, "r");
    },
    async pull(controller) {
      if (finished || !handle) return;
      const length = Math.min(64 * 1024, end - position + 1);
      if (length <= 0) return finish(controller);
      const buffer = Buffer.allocUnsafe(length);
      try {
        const { bytesRead } = await handle.read(buffer, 0, length, position);
        if (finished) return;
        if (!bytesRead) return finish(controller);
        position += bytesRead;
        controller.enqueue(new Uint8Array(buffer.buffer, buffer.byteOffset, bytesRead));
        if (position > end) await finish(controller);
      } catch (error) {
        if (!finished) {
          await finish();
          controller.error(error);
        }
      }
    },
    async cancel() {
      await finish();
    },
  });
}

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
      const stream = fileWebStream(filePath, start, end);
      return new NextResponse(stream, {
        status: 206,
        headers: { ...commonHeaders, "Content-Length": String(end - start + 1), "Content-Range": `bytes ${start}-${end}/${fileStat.size}` },
      });
    }

    const stream = fileWebStream(filePath, 0, fileStat.size - 1);
    return new NextResponse(stream, { headers: { ...commonHeaders, "Content-Length": String(fileStat.size) } });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
