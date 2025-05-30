import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, GripVertical, EditIcon, Lightbulb } from "lucide-react";
import { format, isBefore, parseISO } from "date-fns";
import { useBoardStore } from "../store/boardStore";
import { useState } from "react";
import type { Task } from "../pages/BoardPage";

type Props = {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
};

export const DraggableTask = ({ task, onDelete, onEdit }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isOverdue = task.dueDate
    ? isBefore(parseISO(task.dueDate), new Date())
    : false;

  const toggleSubtask = useBoardStore((state) => state.toggleSubtask);
  const getAISuggestion = useBoardStore((state) => state.getAISuggestion);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  const handleSuggestion = async () => {
    setShowModal(true);
    setLoading(true);
    try {
      const result = await getAISuggestion(task);
      setSuggestion(result ?? "No suggestion available.");
    } catch {
      setSuggestion("Failed to load AI suggestion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-start gap-2 bg-white rounded-md p-3 shadow-sm border"
      >
        <button {...attributes} {...listeners}>
          <GripVertical className="text-gray-400 hover:text-gray-600 cursor-grab" />
        </button>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm font-semibold flex items-center gap-1">
              <span>{task.icon}</span> {task.name}
            </h3>
            <div className="flex gap-1">
              <button
                onClick={handleSuggestion}
                className="text-yellow-500 hover:text-yellow-600"
                title="Get AI suggestion"
              >
                <Lightbulb size={18} />
              </button>
              <button
                onClick={() => onEdit(task)}
                className="text-blue-500 hover:underline text-sm"
              >
                <EditIcon size={18} />
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-xs text-gray-500 mb-1">{task.description}</p>
          )}

          {task.dueDate && (
            <p
              className={`text-xs font-medium flex items-center gap-1 ${
                isOverdue ? "text-red-600" : "text-gray-500"
              }`}
            >
              <span>🕒</span>
              {format(parseISO(task.dueDate), "dd MMM yyyy")}
              {isOverdue && <span className="ml-1">(Overdue)</span>}
            </p>
          )}

          {task.subtasks && task.subtasks.length > 0 && (
            <div className="mt-2 space-y-1">
              {task.subtasks.map((subtask) => (
                <label
                  key={subtask._id}
                  className="flex items-center gap-2 text-xs"
                >
                  <input
                    type="checkbox"
                    checked={subtask.isCompleted}
                    onChange={() => toggleSubtask(task._id, subtask._id)}
                    className="form-checkbox rounded text-green-500"
                  />
                  <span
                    className={
                      subtask.isCompleted
                        ? "line-through text-gray-400"
                        : ""
                    }
                  >
                    {subtask.title}
                  </span>
                </label>
              ))}
            </div>
          )}

          {task.status !== "Won't do" && (
            <div className="w-full mt-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300 ease-in-out"
                  style={{ width: `${task.completion || 0}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1 text-right">
                {task.completion || 0}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Suggestion Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg max-w-md w-full shadow-lg">
            <h2 className="text-lg font-semibold mb-2">💡 Task Suggestion</h2>
            {loading ? (
              <p className="text-sm text-gray-500">Generating suggestion...</p>
            ) : (
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {suggestion}
              </p>
            )}
            <div className="mt-4 text-right">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
