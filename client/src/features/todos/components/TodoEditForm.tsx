import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import type { Todo } from "@/features/todos/types";

type Props = {
  todo: Todo;
  onSubmit: (title: string) => void;
  pending: boolean;
};

export function TodoEditForm({ todo, onSubmit, pending }: Props) {
  const [value, setValue] = useState(todo.title);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const trimmed = value.trim();
        if (trimmed) onSubmit(trimmed);
      }}
    >
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
      />
      <div className="mt-4 flex justify-end gap-2">
        <Dialog.Close asChild>
          <button
            type="button"
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Cancel
          </button>
        </Dialog.Close>
        <button
          type="submit"
          disabled={!value.trim() || pending}
          className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </form>
  );
}
