import { test, expect } from "@playwright/test";

test.describe("Theme toggle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Todos" })).toBeVisible();
  });

  test("switches to dark theme and persists across reloads", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Toggle theme" }).click();
    await page.getByRole("menuitem", { name: "Dark" }).click();

    await expect(page.locator("html")).toHaveClass(/\bdark\b/);

    // next-themes persists the choice via localStorage.
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  });

  test("switches to light theme", async ({ page }) => {
    // Force dark first so we have something to flip away from.
    await page.getByRole("button", { name: "Toggle theme" }).click();
    await page.getByRole("menuitem", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);

    await page.getByRole("button", { name: "Toggle theme" }).click();
    await page.getByRole("menuitem", { name: "Light" }).click();

    await expect(page.locator("html")).not.toHaveClass(/\bdark\b/);
  });

  test("system option follows the OS color-scheme preference", async ({
    browser,
  }) => {
    const ctx = await browser.newContext({ colorScheme: "dark" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Todos" })).toBeVisible();

    await page.getByRole("button", { name: "Toggle theme" }).click();
    await page.getByRole("menuitem", { name: "System" }).click();

    await expect(page.locator("html")).toHaveClass(/\bdark\b/);

    await ctx.close();
  });

  test('"Todos" heading stays legible after toggling themes', async ({
    page,
  }) => {
    const heading = page.getByRole("heading", { name: "Todos" });

    async function hasContrast() {
      // Foreground must differ from background — guards the earlier regression
      // where a stale `color: var(--text-h)` made the heading invisible.
      const { color, bg } = await heading.evaluate((el) => {
        const fg = getComputedStyle(el).color;
        let node: HTMLElement | null = el as HTMLElement;
        let background = "rgba(0, 0, 0, 0)";
        while (node) {
          const c = getComputedStyle(node).backgroundColor;
          if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") {
            background = c;
            break;
          }
          node = node.parentElement;
        }
        return { color: fg, bg: background };
      });
      expect(color).not.toBe(bg);
    }

    await page.getByRole("button", { name: "Toggle theme" }).click();
    await page.getByRole("menuitem", { name: "Light" }).click();
    await hasContrast();

    await page.getByRole("button", { name: "Toggle theme" }).click();
    await page.getByRole("menuitem", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await hasContrast();
  });
});
