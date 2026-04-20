import type { Todo, TodoFilter } from "./types";

export function filterTodos(todos: Todo[], filter: TodoFilter): Todo[] {
  if (filter === "all") return todos;
  if (filter === "done") return todos.filter((t) => t.done);
  return todos.filter((t) => !t.done);
}

export function countRemaining(todos: Todo[]): number {
  return todos.filter((t) => !t.done).length;
}
