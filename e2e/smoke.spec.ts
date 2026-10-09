import { expect, test } from "@playwright/test";

// PRD §8.5: halaman utama termuat, kalkulator menghitung contoh uji §5.5.B,
// dan tautan WhatsApp terbentuk benar.

test.beforeEach(async ({ page }) => {
  // Jangan mencatat lead uji ke database / Telegram.
  await page.route("**/api/leads", (route) => route.fulfill({ status: 204 }));
});

test("halaman utama termuat dengan tema gelap", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("kalkulator: contoh uji PRD = Rp 11.900.000 dan pesan WhatsApp sama", async ({ page }) => {
  await page.goto("/#harga");
  const calc = page.locator("#kalkulator");
  // Di mobile kalkulator berupa wizard: maju dengan "Lanjut" sampai opsinya tampil.
  // Input disembunyikan visual (seluruh kartu yang diklik), jadi dipilih lewat label.
  const choose = async (role: "radio" | "checkbox", name: RegExp) => {
    const input = calc.getByRole(role, { name });
    const card = calc.locator("label", { has: page.getByRole(role, { name }) });
    while (!(await card.isVisible())) await page.getByRole("button", { name: "Lanjut" }).click();
    await input.check({ force: true });
  };
  await choose("radio", /Web App/);
  await choose("radio", /Animasi interaktif/);
  await choose("checkbox", /Pembayaran online/);
  await choose("radio", /Priority Sprint/);

  await expect(page.locator("#ringkasan p.sr-only")).toHaveText("Total estimasi Rp 11.900.000");

  const href = await page
    .getByRole("link", { name: /Konsultasikan Estimasi Ini via WhatsApp/ })
    .getAttribute("href");
  const url = new URL(href ?? "");
  expect(url.hostname).toBe("wa.me");
  expect(url.pathname).toMatch(/^\/\d{10,15}$/);
  expect(url.searchParams.get("text")).toContain("• Estimasi Biaya: Rp 11.900.000");
});
