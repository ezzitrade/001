import { test, expect } from "@playwright/test";

test("play page loads canvas", async ({ page }) => {
  await page.goto("/play");
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveCount(1);
});

test("marketing pages render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("EZZI World")).toBeVisible();

  await page.goto("/docs");
  await expect(page.getByText("Docs")).toBeVisible();

  await page.goto("/roadmap");
  await expect(page.getByText("Roadmap")).toBeVisible();

  await page.goto("/devlog");
  await expect(page.getByText("Devlog")).toBeVisible();
});

test("dashboard renders", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByText("Dashboard")).toBeVisible();
});
