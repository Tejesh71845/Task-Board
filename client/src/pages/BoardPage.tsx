// pages/BoardPage.tsx
import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader } from "../components/Loader";
import { AddTaskModal } from "../components/AddTaskModal";
import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableTask } from "../components/DraggableTask";
import { useDroppable } from "@dnd-kit/core";
import { useBoardStore } from "../store/boardStore";

export type Subtask = {
  _id: string;
  title: string;
  isCompleted: boolean;
};

export type Task = {
  _id: string;
  name: string;
  description: string;
  icon: string;
  status: "To Do" | "In Progress" | "Completed" | "Won't do";
  dueDate?: string;
  completion?: number;
  subtasks: Subtask[];
};

export type Board = {
  _id: string;
  name: string;
  description?: string;
  tasks: Task[];
};

const statuses = ["To Do", "In Progress", "Completed", "Won't do"] as const;

const DroppableColumn = ({
  status,
  tasks,
  onDelete,
  onAdd,
  onEdit,
}: {
  status: Task["status"];
  tasks: Task[];
  onDelete: (id: string) => void;
  onAdd: () => void;
  onEdit: (task: Task) => void;
}) => {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className="bg-gray-100 p-4 rounded-md shadow-sm">
      <h2 className="font-semibold text-lg mb-3">{status}</h2>

      <SortableContext
        items={tasks.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3 min-h-[50px]">
          {tasks.map((task) => (
            <DraggableTask
              key={task._id}
              task={task}
              onDelete={onDelete}
              onEdit={() => onEdit(task)}
            />
          ))}
          {tasks.length === 0 && (
            <p className="text-sm text-gray-400">No tasks found.</p>
          )}
        </div>
      </SortableContext>

      <button
        className="mt-4 w-full py-2 px-3 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
        onClick={onAdd}
      >
        + Add task
      </button>
    </div>
  );
};

export const BoardPage = () => {
  const { boardId } = useParams();
  const [showModalStatus, setShowModalStatus] = useState<Task["status"] | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<Task["status"] | "">("");
  const [sortBy, setSortBy] = useState<"name" | "dueDate">("name");

  const { board, loading, fetchBoard } = useBoardStore();

  useEffect(() => {
    if (boardId) {
      fetchBoard(boardId);
    }
  }, [boardId, fetchBoard]);

  const handleDelete = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete task");
      if (boardId) fetchBoard(boardId);
    } catch (err) {
      console.error(err);
      alert("Error deleting task");
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowModalStatus(task.status);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !board) return;

    const taskId = active.id.toString();
    const destinationStatus = over.id.toString() as Task["status"];

    const draggedTask = board.tasks.find((t) => t._id === taskId);
    if (!draggedTask || draggedTask.status === destinationStatus) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: destinationStatus }),
      });
      if (!res.ok) throw new Error("Failed to update task status");
      if (boardId) fetchBoard(boardId);
    } catch (err) {
      console.error("Error updating task status:", err);
      alert("Could not update task status");
    }
  };

  const filteredSortedTasks = useMemo(() => {
    if (!board) return [];

    let tasks = [...board.tasks];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.name.toLowerCase().includes(term) ||
          t.description?.toLowerCase().includes(term)
      );
    }

    if (filterStatus) {
      tasks = tasks.filter((t) => t.status === filterStatus);
    }

    if (sortBy === "name") {
      tasks.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "dueDate") {
      tasks.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    }

    return tasks;
  }, [board, searchTerm, filterStatus, sortBy]);

  if (loading) return <Loader />;
  if (!board) return <div className="text-center mt-10">Board not found.</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold">{board.name}</h1>
          {board.description && (
            <p className="text-sm text-gray-500">{board.description}</p>
          )}
        </div>

        <Link
          to={`/board/${boardId}/analytics`}
          className="text-sm text-blue-600 hover:underline mt-2 md:mt-0"
        >
          View Analytics →
        </Link>
      </div>


      <div className="mb-6 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded w-full md:w-1/3"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as Task["status"] | "")}
          className="px-3 py-2 border border-gray-300 rounded"
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "name" | "dueDate")}
          className="px-3 py-2 border border-gray-300 rounded"
        >
          <option value="name">Sort by Name</option>
          <option value="dueDate">Sort by Due Date</option>
        </select>

        {(searchTerm || filterStatus) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("");
            }}
            className="text-sm text-blue-600 underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {statuses.map((status) => (
            <DroppableColumn
              key={status}
              status={status}
              tasks={filteredSortedTasks.filter((t) => t.status === status)}
              onDelete={handleDelete}
              onAdd={() => setShowModalStatus(status)}
              onEdit={handleEditTask}
            />
          ))}
        </div>
      </DndContext>

      {(showModalStatus || editingTask) && boardId && (
        <AddTaskModal
          boardId={boardId}
          initialStatus={showModalStatus || undefined}
          taskToEdit={editingTask}
          onTaskCreated={() => {
            fetchBoard(boardId);
            setEditingTask(null);
            setShowModalStatus(null);
          }}
          onClose={() => {
            setEditingTask(null);
            setShowModalStatus(null);
          }}
        />
      )}
    </div>
  );
};
