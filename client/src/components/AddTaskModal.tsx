import { useState, useEffect } from "react";
import type { Task } from "../pages/BoardPage";

type Props = {
  boardId: string;
  initialStatus?: "To Do" | "In Progress" | "Completed" | "Won't do";
  onTaskCreated: () => void;
  onClose: () => void;
};

export const AddTaskModal = ({
  boardId,
  initialStatus = "To Do",
  onTaskCreated,
  onClose,
}: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("✅");
  const [status, setStatus] = useState(initialStatus);

  // Icon mapping for each status
  const statusIcons = {
    "To Do": "⏳",
    "In Progress": "🔄",
    "Completed": "✅",
    "Won't do": "❌"
  };

  // Update icon when status changes
  useEffect(() => {
    setIcon(statusIcons[status]);
  }, [status]);

  // Set initial icon based on initialStatus
  useEffect(() => {
    setIcon(statusIcons[initialStatus]);
  }, [initialStatus]);

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boardId, name, description, icon, status }),
      });

      if (res.ok) {
        onTaskCreated();
        onClose();
      } else {
        const errorText = await res.text();
        console.error("Failed to create task:", res.status, errorText);
        alert("Failed to create task");
      }
    } catch (error) {
      console.error("Network error while creating task:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>

        <input
          placeholder="Task Name"
          className="w-full mb-2 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Task Description"
          className="w-full mb-2 p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          placeholder="Icon (e.g. ✅, 🔥)"
          className="w-full mb-2 p-2 border rounded"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
        />
        <select
          className="w-full mb-4 p-2 border rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value as Task["status"])}
        >
          <option>To Do</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>Won't do</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};