import type { Todo } from "../types";

const API_URL = import.meta.env.VITE_API_URL;
const BASE = `${API_URL}/api/v1/todos`;

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T | null> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${init.method ?? "GET"} ${path} failed (${res.status}): ${text}`);
  }
  if (res.status === 204) return null;
  return (await res.json()) as T;
}

export async function listTodos(): Promise<Todo[]> {
  const todos = (await request<Todo[]>("")) ?? [];
  return todos.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createTodo(title: string): Promise<Todo> {
  const todo = await request<Todo>("", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
  if (!todo) throw new Error("createTodo: empty response");
  return todo;
}

export async function updateTodo(
  id: string,
  patch: Partial<Pick<Todo, "title" | "done">>,
): Promise<Todo> {
  const todo = await request<Todo>(`/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
  if (!todo) throw new Error("updateTodo: empty response");
  return todo;
}

export async function deleteTodo(id: string): Promise<void> {
  await request<void>(`/${id}`, { method: "DELETE" });
}

export const todoKeys = {
  all: ["todos"] as const,
};
