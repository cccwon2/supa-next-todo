import { atom } from "jotai";
import { Todo } from "./app/types/todo";
import { User } from "@supabase/supabase-js";

export const todoListAtom = atom<Todo[]>([]);
export const userAtom = atom<User | null>(null);
export const todoAtom = atom<Todo | null>(null);
