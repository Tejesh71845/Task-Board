import { create } from "zustand";
import axios from "axios";

export type Task = {
  _id: string;
  title: string;
  description: string;
  status: string;
  icon?: string;
};

export type Board = {
  _id: string;
  name: string;
  description?: string;
  tasks: Task[];
};

interface BoardStore {
  board: Board | null;
  loading: boolean;
  error: string | null;
  fetchBoard: (boardId: string) => Promise<void>;
  updateBoard: (data: Partial<Board>) => Promise<void>;
}

export const useBoardStore = create<BoardStore>((set) => ({
  board: null,
  loading: false,
  error: null,

  fetchBoard: async (boardId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`/api/boards/${boardId}`);
      set({ board: { ...res.data.board, tasks: res.data.tasks }, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateBoard: async (data) => {
    try {
      if (!data || !data._id) return;
      const res = await axios.put(`/api/boards/${data._id}`, data);
      set((state) => ({ board: { ...state.board!, ...res.data } }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
