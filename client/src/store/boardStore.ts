import { create } from "zustand";
import axios from "axios";

// Base URL for your backend
const API_BASE_URL = "http://localhost:8080"; // Change this to your backend port

export type Subtask = {
  _id: string;
  title: string;
  isCompleted: boolean;
};

export type Task = {
  _id: string;
  name: string;
  description: string;
  status: string;
  icon?: string;
  dueDate?: string;
  subtasks?: Subtask[];
  completion?: number;
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
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  getAISuggestion: (task: Task) => Promise<string | null>;
}

export const useBoardStore = create<BoardStore>((set) => ({
  board: null,
  loading: false,
  error: null,

  fetchBoard: async (boardId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_BASE_URL}/api/boards/${boardId}`);
      set({
        board: { ...res.data.board, tasks: res.data.tasks },
        loading: false,
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateBoard: async (data) => {
    try {
      if (!data || !data._id) return;
      const res = await axios.put(`${API_BASE_URL}/api/boards/${data._id}`, data);
      set((state) => ({ board: { ...state.board!, ...res.data } }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  toggleSubtask: async (taskId, subtaskId) => {
    try {
      const res = await axios.patch(`${API_BASE_URL}/api/tasks/${taskId}/toggle-subtask/${subtaskId}`);
      const updatedTask: Task = res.data;

      set((state) => {
        if (!state.board) return state;

        const updatedTasks = state.board.tasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        );

        return {
          board: {
            ...state.board,
            tasks: updatedTasks,
          },
        };
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  getAISuggestion: async (task: Task) => {
  try {
    console.log('Sending AI request for task:', task); // Debug log
    
    const res = await axios.post(`${API_BASE_URL}/api/ai/suggest`, {
      title: task.name,           // Changed from taskName to title
      description: task.description || '',
      subtasks: task.subtasks || [],
    });

    console.log('AI response:', res.data); // Debug log
    return res.data.suggestion || null;
  } catch (error: any) {
    console.error('AI suggestion error:', error); // Debug log
    set({ error: error.message });
    return null;
  }
},
}));
