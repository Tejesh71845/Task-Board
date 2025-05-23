import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Trash2, GripVertical } from "lucide-react";
import type { Task } from "../pages/BoardPage";

type Props = {
  task: Task;
  onDelete: (id: string) => void;
};

export const DraggableTask = ({ task, onDelete }: Props) => {
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
          <button
            onClick={() => onDelete(task._id)}
            className="text-gray-400 hover:text-red-600"
          >
            <Trash2 size={20} />
          </button>
        </div>
        {task.description && (
          <p className="text-xs text-gray-500">{task.description}</p>
        )}
      </div>
    </div>
  );
};
