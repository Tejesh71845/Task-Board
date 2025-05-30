import { useState, useEffect } from "react";
import type { Task, Subtask } from "../pages/BoardPage";

type Props = {
  boardId: string;
  taskToEdit?: Task | null;
  initialStatus?: "To Do" | "In Progress" | "Completed" | "Won't do";
  onTaskCreated: () => void;
  onClose: () => void;
};

export const AddTaskModal = ({
  boardId,
  taskToEdit,
  initialStatus = "To Do",
  onTaskCreated,
  onClose,
}: Props) => {
  const statusIcons = {
    "To Do": "⏳",
    "In Progress": "🔄",
    "Completed": "✅",
    "Won't do": "❌",
  };

  const [name, setName] = useState(taskToEdit?.name ?? "");
  const [description, setDescription] = useState(taskToEdit?.description ?? "");
  const [status, setStatus] = useState<Task["status"]>(taskToEdit?.status ?? initialStatus);
  const [icon, setIcon] = useState(taskToEdit?.icon ?? statusIcons[initialStatus]);
  const [dueDate, setDueDate] = useState(
    taskToEdit?.dueDate ? new Date(taskToEdit.dueDate).toISOString().split("T")[0] : ""
  );

  // 🔹 Subtasks state
  const [subtasks, setSubtasks] = useState<{ id: string; title: string }[]>(
    taskToEdit?.subtasks?.map((st) => ({ id: st._id || crypto.randomUUID(), title: st.title })) ?? []
  );

  useEffect(() => {
    if (!taskToEdit) {
      setIcon(statusIcons[status]);
    }
  }, [status]);

  const handleSubmit = async () => {
    try {
      const payload = {
        name,
        description,
        status,
        icon: statusIcons[status] || icon,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        subtasks: subtasks.map((st) => ({
          title: st.title,
          isCompleted: false, // new subtasks start incomplete
        })),
      };

      const res = await fetch(
        taskToEdit ? `/api/tasks/${taskToEdit._id}` : `/api/tasks`,
        {
          method: taskToEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(taskToEdit ? payload : { ...payload, boardId }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to save task:", res.status, errorText);
        alert("Failed to save task");
        return;
      }

      onTaskCreated();
      onClose();
    } catch (error) {
      console.error("Network error while saving task:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {taskToEdit ? "Edit Task" : "Add New Task"}
        </h2>

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
          className="w-full mb-2 p-2 border rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value as Task["status"])}
        >
          <option>To Do</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>Won't do</option>
        </select>

        {/* 🔹 Due Date */}
        <label className="block mb-1 text-sm font-medium text-gray-700">Due Date</label>
        <input
          type="date"
          className="w-full mb-4 p-2 border rounded"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        {/* 🔹 Subtasks */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Subtasks</label>
            <button
              type="button"
              onClick={() =>
                setSubtasks([...subtasks, { id: crypto.randomUUID(), title: "" }])
              }
              className="text-xs text-blue-500 hover:underline"
            >
              + Add Subtask
            </button>
          </div>

          <div className="space-y-2">
            {subtasks.map((subtask, index) => (
              <div key={subtask.id} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder={`Subtask ${index + 1}`}
                  value={subtask.title}
                  onChange={(e) => {
                    const updated = [...subtasks];
                    updated[index].title = e.target.value;
                    setSubtasks(updated);
                  }}
                  className="w-full px-2 py-1 border rounded text-sm"
                />
                <button
                  type="button"
                  onClick={() =>
                    setSubtasks(subtasks.filter((_, i) => i !== index))
                  }
                  className="text-red-500 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            {taskToEdit ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};
