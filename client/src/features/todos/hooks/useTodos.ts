import { useQuery } from "@tanstack/react-query";
import { listTodos, todoKeys } from "@/features/todos/api/api";

export function useTodos() {
  return useQuery({
    queryKey: todoKeys.all,
    queryFn: listTodos,
  });
}
