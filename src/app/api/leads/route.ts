import { createHash, randomUUID } from "node:crypto";
import { and, count, eq, gt, lt } from "drizzle-orm";
import { after } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { addons, backends, estimate, normalize, scopes, timelines, visuals } from "@/lib/pricing";
import { leadMessage, sendTelegram } from "@/lib/telegram";

// PRD §5.5.G: pencatatan lead dari tombol WhatsApp kalkulator (navigator.sendBeacon).

const MAX_BYTES = 2048;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
// Masa simpan 12 bulan (PRD §8.4, halaman /kebijakan-privasi).
const RETENTION_MS = 365 * 24 * 60 * 60 * 1000;

const keys = <T extends object>(o: T) =>
  Object.keys(o) as [Extract<keyof T, string>, ...Extract<keyof T, string>[]];

// Hanya opsi yang ada di pricing.ts; field lain (mis. harga dari klien) dibuang.
const schema = z.object({
  scope: z.enum(keys(scopes)),
  visual: z.enum(keys(visuals)),
  backend: z.enum(keys(backends)),
  addons: z
    .array(z.enum(keys(addons)))
    .max(Object.keys(addons).length)
    .refine((a) => new Set(a).size === a.length),
  timeline: z.enum(keys(timelines)),
});

// Pengirim beacon tidak membaca respons; 204 juga dipakai untuk penolakan rate limit (diam-diam).
const noContent = () => new Response(null, { status: 204 });
const badRequest = () => new Response(null, { status: 400 });

export async function POST(request: Request) {
  const body = await request.text();
  if (new TextEncoder().encode(body).length > MAX_BYTES) return new Response(null, { status: 413 });

  let json: unknown;
  try {
    json = JSON.parse(body);
  } catch {
    return badRequest();
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) return badRequest();
  const config = parsed.data;
  // Konfigurasi yang melanggar guard rule tidak mungkin datang dari kalkulator.
  if (normalize(config).notices.length > 0) return badRequest();

  const salt = process.env.IP_HASH_SALT;
  if (!salt) throw new Error("IP_HASH_SALT belum diisi (lihat .env.example)");
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  // IP mentah tidak pernah disimpan (PRD §5.5.G, §8.4).
  const ipHash = createHash("sha256").update(`${salt}:${ip}`).digest("hex");

  const since = new Date(Date.now() - WINDOW_MS);
  const [{ n }] = await db
    .select({ n: count() })
    .from(leads)
    .where(and(eq(leads.ipHash, ipHash), gt(leads.createdAt, since)));
  if (n >= MAX_PER_WINDOW) return noContent();

  const id = randomUUID();
  const createdAt = new Date();
  const total = estimate(config).total; // dihitung ulang di server
  await db.insert(leads).values({ id, ...config, estimatedPrice: total, ipHash, createdAt });

  // Setelah respons terkirim. Gagal kirim tidak membatalkan lead; notifiedAt tetap kosong.
  after(async () => {
    // ponytail: pembersihan menumpang lead baru, tanpa cron; cukup selama lead terus masuk.
    await db
      .delete(leads)
      .where(lt(leads.createdAt, new Date(Date.now() - RETENTION_MS)))
      .catch((error) => console.error("Hapus lead > 12 bulan gagal", error));
    try {
      await sendTelegram(leadMessage(config, total, createdAt));
      await db.update(leads).set({ notifiedAt: new Date() }).where(eq(leads.id, id));
    } catch (error) {
      console.error("Notifikasi Telegram lead gagal", id, error);
    }
  });

  return noContent();
}
