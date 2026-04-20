import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo, todoKeys } from "@/features/todos/api/api";

export function useDeleteTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: todoKeys.all }),
  });
}
