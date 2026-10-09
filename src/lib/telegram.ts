import { addons, backends, type Config, formatRupiah, scopes, timelines, visuals } from "./pricing";

const wib = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

/** Format notifikasi lead (PRD §5.5.G). */
export function leadMessage(config: Config, total: number, at: Date) {
  return [
    `🆕 Lead baru — ${formatRupiah(total)}`,
    `${scopes[config.scope].short} · ${visuals[config.visual].short} · ${backends[config.backend].short}`,
    `Add-ons: ${config.addons.map((a) => addons[a].short).join(", ") || "Tidak ada"}`,
    `Timeline: ${timelines[config.timeline].short}`,
    `${wib.format(at)} WIB`,
  ].join("\n");
}

/** Kirim ke grup Telegram pemilik. Hanya dipanggil dari server (/api/leads). */
export async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID belum diisi");
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  if (!res.ok) throw new Error(`Telegram ${res.status}: ${await res.text()}`);
}
