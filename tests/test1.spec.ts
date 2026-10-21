import { test, expect } from "@playwright/test";

test("API GET returns 200 and JSON", async ({ request }) => {
  const response = await request.get(
    "https://jsonplaceholder.typicode.com/todos/1"
  );

  expect(response.status()).toBe(200);

  const data = (await response.json()) as { id: number };
  expect(data.id).toBe(1);
});