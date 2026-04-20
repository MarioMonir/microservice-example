import clsx from "clsx";
import type { TodoFilter } from "@/features/todos/types";

const FILTERS: readonly TodoFilter[] = ["all", "active", "done"];

type Props = {
  value: TodoFilter;
  onChange: (filter: TodoFilter) => void;
};

export function TodoFilters({ value, onChange }: Props) {
  return (
    <div className="mb-4 flex gap-1 rounded-lg bg-muted p-1 text-sm">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={clsx(
            "flex-1 rounded-md px-3 py-1.5 capitalize transition",
            value === f
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
