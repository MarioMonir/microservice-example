import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodo, todoKeys } from "@/features/todos/api/api";
import type { Todo } from "@/features/todos/types";

export function useToggleTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (todo: Todo) => updateTodo(todo.id, { done: !todo.done }),
    onMutate: async (todo) => {
      await qc.cancelQueries({ queryKey: todoKeys.all });
      const prev = qc.getQueryData<Todo[]>(todoKeys.all);
      qc.setQueryData<Todo[]>(todoKeys.all, (old = []) =>
        old.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t)),
      );
      return { prev };
    },
    onError: (_err, _todo, ctx) => qc.setQueryData(todoKeys.all, ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: todoKeys.all }),
  });
}
