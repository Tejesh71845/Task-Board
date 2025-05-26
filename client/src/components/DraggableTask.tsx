import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Trash2, GripVertical, EditIcon } from "lucide-react";
import { format, isBefore, parseISO } from "date-fns";
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-2 bg-white rounded-md p-3 shadow-sm border"
    >
      {/* Drag handle */}
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

        {/* ✅ Completion Progress Bar */}
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
  );
};
