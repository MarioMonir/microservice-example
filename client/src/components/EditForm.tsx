import type { Todo } from "@/features/todos/types";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

export const EditForm = ({
  todo,
  onSubmit,
  pending,
}: {
  todo: Todo;
  onSubmit: (title: string) => void;
  pending: boolean;
}) => {
  const [value, setValue] = useState(todo.title);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const v = value.trim();
        if (v) onSubmit(v);
      }}
    >
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
      <div className="mt-4 flex justify-end gap-2">
        <Dialog.Close asChild>
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </Dialog.Close>
        <button
          type="submit"
          disabled={!value.trim() || pending}
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </form>
  );
};
