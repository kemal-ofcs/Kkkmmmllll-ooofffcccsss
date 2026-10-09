import { expect, test } from "@playwright/test";

test("halaman utama termuat dengan tema gelap", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
