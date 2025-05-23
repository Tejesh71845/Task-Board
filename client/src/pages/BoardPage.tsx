import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../components/Loader";
import { AddTaskModal } from "../components/AddTaskModal";
import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableTask } from "../components/DraggableTask";
import { useDroppable } from "@dnd-kit/core";

// Types
export type Task = {
  _id: string;
  name: string;
  description: string;
  icon: string;
  status: "In Progress" | "Completed" | "Won't do" | "To Do";
};

export type Board = {
  _id: string;
  name: string;
  description?: string;
};

export type BoardResponse = {
  board: Board;
  tasks: Task[];
};

const statuses = ["To Do", "In Progress", "Completed", "Won't do"] as const;

const DroppableColumn = ({
  status,
  tasks,
  onDelete,
  onAdd,
}: {
  status: Task["status"];
  tasks: Task[];
  onDelete: (id: string) => void;
  onAdd: () => void;
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
            <DraggableTask key={task._id} task={task} onDelete={onDelete} />
          ))}
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
  const [boardData, setBoardData] = useState<BoardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModalStatus, setShowModalStatus] = useState<Task["status"] | null>(null);


  const fetchBoard = async () => {
    try {
      const res = await fetch(`/api/boards/${boardId}`);
      if (!res.ok) throw new Error("Board not found");
      const data = await res.json();
      setBoardData(data);
    } catch (err) {
      console.error("Failed to fetch board:", err);
      setBoardData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (boardId) fetchBoard();
  }, [boardId]);

  const handleDelete = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete task");

      setBoardData((prev) =>
        prev
          ? {
            ...prev,
            tasks: prev.tasks.filter((task) => task._id !== taskId),
          }
          : null
      );
    } catch (err) {
      console.error(err);
      alert("Error deleting task");
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !boardData) return;

    const taskId = active.id.toString();
    const destinationStatus = over.id.toString() as Task["status"];

    const draggedTask = boardData.tasks.find((t) => t._id === taskId);
    if (!draggedTask) return;

    // Only update status if dragged to a new column
    if (draggedTask.status !== destinationStatus && statuses.includes(destinationStatus)) {
      try {
        // Optimistic UI update
        setBoardData((prev) =>
          prev
            ? {
              ...prev,
              tasks: prev.tasks.map((task) =>
                task._id === taskId ? { ...task, status: destinationStatus } : task
              ),
            }
            : null
        );

        const res = await fetch(`/api/tasks/${taskId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: destinationStatus }),
        });

        if (!res.ok) throw new Error("Failed to update task status");
      } catch (err) {
        console.error("Error updating task status:", err);
        alert("Could not update task status");
        fetchBoard(); // Re-fetch in case of error
      }
    }
  };

  if (loading) return <Loader />;
  if (!boardData) return <div className="text-center mt-10">Board not found.</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{boardData.board.name}</h1>
      {boardData.board.description && (
        <p className="text-sm text-gray-500 mb-6">
          {boardData.board.description}
        </p>
      )}

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {statuses.map((status) => (
            <DroppableColumn
              key={status}
              status={status}
              tasks={boardData.tasks.filter((t) => t.status === status)}
              onDelete={handleDelete}
              onAdd={() => setShowModalStatus(status)}
            />
          ))}
        </div>
      </DndContext>

      {showModalStatus && boardId && (
        <AddTaskModal
          boardId={boardId}
          initialStatus={showModalStatus}
          onTaskCreated={async () => {
            await fetchBoard();
            setShowModalStatus(null);
          }}
          onClose={() => setShowModalStatus(null)}
        />
      )}

    </div>
  );
};
