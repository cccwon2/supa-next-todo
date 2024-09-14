import axios from "axios";
import { Todo } from "../types";

const API_URL = "/api";

export const getTodos = async (): Promise<Todo[]> => {
  const response = await axios.get(`${API_URL}/todos`);
  return response.data;
};

export const getTodo = async (id: number): Promise<Todo> => {
  const response = await axios.get(`${API_URL}/todos/${id}`);
  return response.data;
};

export const createTodo = async (data: Partial<Todo>): Promise<Todo> => {
  const response = await axios.post(`${API_URL}/todos`, data);
  return response.data;
};

export const updateTodo = async (
  id: number,
  data: Partial<Todo>
): Promise<Todo> => {
  const response = await axios.put(`${API_URL}/todos/${id}`, data);
  return response.data;
};

export const patchTodo = async (
  id: number,
  data: Partial<Todo>
): Promise<Todo> => {
  const response = await axios.patch(`${API_URL}/todos/${id}`, data);
  return response.data;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/todos/${id}`);
};
