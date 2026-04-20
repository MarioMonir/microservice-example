import type { Todo, TodoFilter } from "../types";
import { TodoItem } from "@/features/todos/components/TodoItem";

type Props = {
  todos: Todo[];
  filter: TodoFilter;
  isLoading: boolean;
  onToggle: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
};

export function TodoList({
  todos,
  filter,
  isLoading,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  if (isLoading) {
    return (
      <ul className="space-y-2">
        <li className="rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
          Loading…
        </li>
      </ul>
    );
  }

  if (todos.length === 0) {
    return (
      <ul className="space-y-2">
        <li className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          {filter === "all"
            ? "No todos yet. Add your first one above."
            : `No ${filter} todos.`}
        </li>
      </ul>
    );
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
