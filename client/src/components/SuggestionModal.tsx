// src/components/SuggestionModal.tsx
import React, { useEffect, useState } from "react";
import { type Task, useBoardStore } from "../store/boardStore";

type Props = {
  task: Task | null;
  open: boolean;
  onClose: () => void;
};

const SuggestionModal: React.FC<Props> = ({ task, open, onClose }) => {
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const getAISuggestion = useBoardStore((state) => state.getAISuggestion);

  useEffect(() => {
    const fetchSuggestion = async () => {
      if (!task) return;
      setLoading(true);
      try {
        const result = await getAISuggestion(task);
        setSuggestion(result ?? "");

      } catch (err) {
        setSuggestion("Failed to generate suggestion.");
      } finally {
        setLoading(false);
      }
    };

    if (open && task) {
      fetchSuggestion();
    }
  }, [open, task, getAISuggestion]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">
          AI Suggestions for: <span className="text-blue-600">{task?.name}</span>
        </h2>
        {loading ? (
          <p className="text-sm text-gray-500">Generating suggestions...</p>
        ) : (
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{suggestion}</p>
        )}
      </div>
    </div>
  );
};

export default SuggestionModal;
