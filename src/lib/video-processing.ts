import { execFile } from "node:child_process";
import { stat } from "node:fs/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const processingTimeoutMs = 15 * 60 * 1000;

export async function normalizeVideoForWeb(inputPath: string, outputPath: string) {
  await execFileAsync(process.env.FFMPEG_PATH || "ffmpeg", [
    "-nostdin",
    "-hide_banner",
    "-loglevel", "error",
    "-xerror",
    "-y",
    "-i", inputPath,
    "-map", "0:v:0",
    "-map", "0:a:0?",
    "-map_metadata", "-1",
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-crf", "23",
    "-profile:v", "main",
    "-level:v", "4.0",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", "128k",
    "-ac", "2",
    "-movflags", "+faststart",
    "-max_muxing_queue_size", "1024",
    "-f", "mp4",
    outputPath,
  ], { timeout: processingTimeoutMs, maxBuffer: 4 * 1024 * 1024, windowsHide: true });

  const output = await stat(outputPath);
  if (!output.isFile() || output.size <= 0) throw new Error("FFmpeg produced an empty output file");
  return output.size;
}
