import { EditIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Board = {
  _id: string;
  name: string;
  description?: string;
};

export const HomePage = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoard, setNewBoard] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: "", description: "" });
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchBoards = async () => {
    const res = await fetch("/api/boards");
    const data = await res.json();
    setBoards(data);
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleAddBoard = async () => {
    setError(null);
    if (!newBoard.name.trim()) {
      setError("Board name is required");
      return;
    }

    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBoard),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to add board");
      }

      setNewBoard({ name: "", description: "" });
      fetchBoards();
    } catch (err) {
      setError("Board with this name already exists.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this board?")) return;

    await fetch(`/api/boards/${id}`, {
      method: "DELETE",
    });

    fetchBoards();
  };

  const handleEdit = (board: Board) => {
    setEditingId(board._id);
    setEditData({ name: board.name, description: board.description || "" });
  };

  const handleUpdate = async (id: string) => {
    setError(null);
    if (!editData.name.trim()) {
      setError("Board name is required");
      return;
    }

    try {
      const res = await fetch(`/api/boards/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to update");
      }

      setEditingId(null);
      fetchBoards();
    } catch (err) {
      setError("Another board with this name already exists.");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Boards</h1>

      <div className="mb-6 p-4 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Create New Board</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <input
          className="border p-2 mr-2 rounded w-full mb-2"
          placeholder="Board Name"
          value={newBoard.name}
          onChange={(e) => setNewBoard((prev) => ({ ...prev, name: e.target.value }))}
        />
        <input
          className="border p-2 mr-2 rounded w-full mb-2"
          placeholder="Description (optional)"
          value={newBoard.description}
          onChange={(e) => setNewBoard((prev) => ({ ...prev, description: e.target.value }))}
        />
        <button
          onClick={handleAddBoard}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Board
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {boards.map((board) => (
          <div key={board._id} className="p-4 border rounded shadow-sm flex justify-between items-start">
            {editingId === board._id ? (
              <div className="flex flex-col w-full">
                <input
                  className="border p-2 rounded mb-2"
                  value={editData.name}
                  onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
                />
                <textarea
                  className="border p-2 rounded mb-2"
                  value={editData.description}
                  onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
                />
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(board._id)} className="bg-green-600 text-white px-3 py-1 rounded">
                    Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <h3
                  onClick={() => navigate(`/board/${board._id}`)}
                  className="text-lg font-semibold cursor-pointer hover:underline"
                >
                  {board.name}
                </h3>
                <p className="text-sm text-gray-600">{board.description}</p>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => handleEdit(board)} className="text-blue-600 hover:underline text-sm">
                    <EditIcon/>
                  </button>
                  <button onClick={() => handleDelete(board._id)} className="text-red-600 hover:underline text-sm">
                    <Trash2/>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
