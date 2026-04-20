import { Plus } from "lucide-react";
import { useCallback, useState } from "react";

type Props = {
  onCreate: (title: string) => void;
  pending: boolean;
};

export function TodoCreateForm({ onCreate, pending }: Props) {
  const [title, setTitle] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmed = title.trim();
      if (!trimmed) return;
      onCreate(trimmed);
      setTitle("");
    },
    [onCreate, title],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex gap-2 rounded-xl border border-border bg-card p-2 shadow-sm transition focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs doing?"
        className="flex-1 bg-transparent px-2 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      <button
        type="submit"
        disabled={!title.trim() || pending}
        className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={16} />
        Add
      </button>
    </form>
  );
}
