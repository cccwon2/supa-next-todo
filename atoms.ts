import { atom } from "jotai";
import { Todo } from "./types";

export const todoListAtom = atom<Todo[]>([]);
