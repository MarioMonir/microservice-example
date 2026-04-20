import { test, expect, type Page } from "@playwright/test";

async function addTodo(page: Page, title: string) {
  await page.getByPlaceholder("What needs doing?").fill(title);
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.getByText(title, { exact: true })).toBeVisible();
}

test("core todo journey: create, toggle, filter, edit, delete, persist", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Todos" })).toBeVisible();
  await expect(
    page.getByText("No todos yet. Add your first one above."),
  ).toBeVisible();
  await expect(page.getByText("0 remaining · 0 total")).toBeVisible();

  // Create three todos. They render newest-first, so "Ship app" ends up on top.
  await addTodo(page, "Buy milk");
  await addTodo(page, "Walk the dog");
  await addTodo(page, "Ship app");
  await expect(page.getByText("3 remaining · 3 total")).toBeVisible();

  // Mark the top todo ("Ship app") as done.
  await page.getByRole("button", { name: "Mark as done" }).first().click();
  await expect(page.getByText("2 remaining · 3 total")).toBeVisible();
  await expect(page.getByText("Ship app")).toHaveClass(/line-through/);

  // Filter: active hides the done one.
  await page.getByRole("button", { name: "active", exact: true }).click();
  await expect(page.getByText("Ship app")).not.toBeVisible();
  await expect(page.getByText("Buy milk")).toBeVisible();
  await expect(page.getByText("Walk the dog")).toBeVisible();

  // Filter: done shows only the done one.
  await page.getByRole("button", { name: "done", exact: true }).click();
  await expect(page.getByText("Ship app")).toBeVisible();
  await expect(page.getByText("Buy milk")).not.toBeVisible();
  await expect(page.getByText("Walk the dog")).not.toBeVisible();

  // Back to all.
  await page.getByRole("button", { name: "all", exact: true }).click();

  // Edit "Walk the dog" -> "Walk the cat". The Edit buttons are ordered newest-first:
  // [Ship app, Walk the dog, Buy milk] -> index 1.
  await page.getByRole("button", { name: "Edit" }).nth(1).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("Edit todo")).toBeVisible();
  const editInput = dialog.getByRole("textbox");
  await expect(editInput).toHaveValue("Walk the dog");
  await editInput.fill("Walk the cat");
  await dialog.getByRole("button", { name: "Save" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByText("Walk the cat")).toBeVisible();
  await expect(page.getByText("Walk the dog")).not.toBeVisible();

  // Toggle "Ship app" back to active; all three remaining now.
  await page.getByRole("button", { name: "Mark as active" }).click();
  await expect(page.getByText("3 remaining · 3 total")).toBeVisible();

  // Delete "Buy milk" (the oldest, last in the list -> index 2).
  await page.getByRole("button", { name: "Delete" }).nth(2).click();
  await expect(page.getByText("Buy milk")).not.toBeVisible();
  await expect(page.getByText("2 remaining · 2 total")).toBeVisible();

  // Persistence: reload and confirm remaining todos survive.
  await page.reload();
  await expect(page.getByText("Ship app")).toBeVisible();
  await expect(page.getByText("Walk the cat")).toBeVisible();
  await expect(page.getByText("2 remaining · 2 total")).toBeVisible();

  // Clear the rest; empty state returns. Wait between clicks so the first
  // delete finishes before we re-query for the next row.
  await page.getByRole("button", { name: "Delete" }).first().click();
  await expect(page.getByText("1 remaining · 1 total")).toBeVisible();
  await page.getByRole("button", { name: "Delete" }).first().click();
  await expect(page.getByText("0 remaining · 0 total")).toBeVisible();
  await expect(
    page.getByText("No todos yet. Add your first one above."),
  ).toBeVisible();
});