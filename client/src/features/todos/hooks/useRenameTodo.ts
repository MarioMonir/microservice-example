import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodo, todoKeys } from "@/features/todos/api/api";

type RenameVars = {
  id: string;
  title: string;
};

export function useRenameTodo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, title }: RenameVars) => updateTodo(id, { title }),
    onSuccess: () => qc.invalidateQueries({ queryKey: todoKeys.all }),
  });
}
