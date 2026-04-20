import clsx from "clsx";
import { Check, Pencil, Trash2 } from "lucide-react";
import type { Todo } from "@/features/todos/types";

type Props = {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
};

export function TodoItem({ todo, onToggle, onEdit, onDelete }: Props) {
  return (
    <li className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm transition hover:border-ring/50 hover:shadow-md">
      <button
        onClick={() => onToggle(todo)}
        className={clsx(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition",
          todo.done
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border hover:border-ring",
        )}
        aria-label={todo.done ? "Mark as active" : "Mark as done"}
      >
        {todo.done && <Check size={14} strokeWidth={3} />}
      </button>

      <span
        className={clsx(
          "flex-1 text-sm",
          todo.done
            ? "text-muted-foreground line-through"
            : "text-foreground",
        )}
      >
        {todo.title}
      </span>

      <div className="flex gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
        <button
          onClick={() => onEdit(todo)}
          className="rounded p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="Edit"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="rounded p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
          aria-label="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </li>
  );
}
