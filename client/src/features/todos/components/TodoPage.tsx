import { useState } from "react";
import { useTodos } from "../hooks/useTodos";
import { useCreateTodo } from "../hooks/useCreateTodo";
import { useToggleTodo } from "../hooks/useToggleTodo";
import { useRenameTodo } from "../hooks/useRenameTodo";
import { useDeleteTodo } from "../hooks/useDeleteTodo";
import { countRemaining, filterTodos } from "../utils";
import type { Todo, TodoFilter } from "../types";
import { TodoHeader } from "./TodoHeader";
import { TodoCreateForm } from "./TodoCreateForm";
import { TodoFilters } from "./TodoFilters";
import { TodoList } from "./TodoList";
import { TodoEditDialog } from "./TodoEditDialog";

export function TodoPage() {
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [editing, setEditing] = useState<Todo | null>(null);

  const { data: todos = [], isLoading } = useTodos();
  const createTodo = useCreateTodo();
  const toggleTodo = useToggleTodo();
  const renameTodo = useRenameTodo();
  const deleteTodo = useDeleteTodo();

  const visible = filterTodos(todos, filter);
  const remaining = countRemaining(todos);

  function handleRename(title: string) {
    if (!editing) return;
    renameTodo.mutate(
      { id: editing.id, title },
      { onSuccess: () => setEditing(null) },
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12 text-left">
        <TodoHeader remaining={remaining} total={todos.length} />
        <TodoCreateForm
          onCreate={createTodo.mutate}
          pending={createTodo.isPending}
        />
        <TodoFilters value={filter} onChange={setFilter} />
        <TodoList
          todos={visible}
          filter={filter}
          isLoading={isLoading}
          onToggle={toggleTodo.mutate}
          onEdit={setEditing}
          onDelete={deleteTodo.mutate}
        />
      </div>

      <TodoEditDialog
        todo={editing}
        onClose={() => setEditing(null)}
        onSubmit={handleRename}
        pending={renameTodo.isPending}
      />
    </div>
  );
}
