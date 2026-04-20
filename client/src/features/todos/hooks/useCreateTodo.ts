import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo, todoKeys } from "@/features/todos/api/api";

export function useCreateTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (title: string) => createTodo(title),
    onSuccess: () => qc.invalidateQueries({ queryKey: todoKeys.all }),
  });
}
