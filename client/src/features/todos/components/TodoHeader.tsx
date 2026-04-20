import { ListTodo } from "lucide-react";

import { ThemeToggle } from "@/components/ui/ThemeToggle";

type Props = {
  remaining: number;
  total: number;
};

export function TodoHeader({ remaining, total }: Props) {
  return (
    <header className="mb-8 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <ListTodo size={20} />
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Todos</h1>
        <p className="text-sm text-muted-foreground">
          {remaining} remaining · {total} total
        </p>
      </div>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}
