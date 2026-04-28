/**
 * One-shot: grab a frame from each public/video/*.mp4 → *_poster.jpg
 * Run: node scripts/extract-video-posters.mjs
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpeg from "ffmpeg-static";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const videoDir = path.join(root, "public", "video");

if (!ffmpeg) {
  throw new Error("ffmpeg-static did not resolve to a binary path");
}

const names = ["water_festival", "krathong", "trivia"];

for (const name of names) {
  const input = path.join(videoDir, `${name}.mp4`);
  const output = path.join(videoDir, `${name}_poster.jpg`);
  if (!existsSync(input)) {
    console.warn(`skip (missing): ${input}`);
    continue;
  }
  console.log(`${name}.mp4 → ${name}_poster.jpg`);
  execFileSync(
    ffmpeg,
    [
      "-y",
      "-ss",
      "0.25",
      "-i",
      input,
      "-frames:v",
      "1",
      "-q:v",
      "2",
      "-update",
      "1",
      output,
    ],
    { stdio: "inherit" },
  );
}

console.log("done");
