import axios from "axios";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

const user = 4895;

const apiClient = axios.create({
  baseURL: "https://mate.academy/students-api/todos",
});

export const getTodos = async () => {
  const res = await apiClient.get(`?userId=${user}`);

  return res.data;
};

export const createTodos = async (title: string) => {
  const res = await apiClient.post(``, {
    userId: user,
    title,
    completed: false,
  });

  return res.data;
};

export const deleteTodos = async (todoId: string) => {
  const res = await apiClient.delete(`/${todoId}`);

  return res.data;
};

export const editTodo = async ({ id, title, completed }: Todo) => {
  const res = await apiClient.patch(`/${id}`, {
    title,
    completed,
  });

  return res.data;
};
