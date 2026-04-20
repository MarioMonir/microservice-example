import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { Todo } from "@/features/todos/types";
import { TodoEditForm } from "@/features/todos/components/TodoEditForm";

type Props = {
  todo: Todo | null;
  onClose: () => void;
  onSubmit: (title: string) => void;
  pending: boolean;
};

export function TodoEditDialog({ todo, onClose, onSubmit, pending }: Props) {
  return (
    <Dialog.Root open={!!todo} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-foreground/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-base font-semibold text-foreground">
              Edit todo
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="rounded p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </div>

          {todo && (
            <TodoEditForm todo={todo} onSubmit={onSubmit} pending={pending} />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
