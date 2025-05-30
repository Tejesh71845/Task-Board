import { useBoardStore } from "../store/boardStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

export const Dashboard = () => {
  const { boardId } = useParams();
  const { board, fetchBoard } = useBoardStore();

  useEffect(() => {
    if (boardId) fetchBoard(boardId);
  }, [boardId]);

  if (!board) return <p className="p-4">No board data available</p>;

  const totalTasks = board.tasks.length;

  const tasksPerStatus = ["To Do", "In Progress", "Completed", "Won't do"].map((status) => ({
    status,
    count: board.tasks.filter((t) => t.status === status).length,
  }));

  const completionRate =
    (board.tasks.filter((t) => t.status === "Completed").length / totalTasks) * 100 || 0;

  const overdueTasks = board.tasks.filter((task) => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date();
  }).length;

  const tasksLast7Days = board.tasks.filter((task) => {
    const created = new Date(task._id.toString().substring(0, 8) * 1000);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return created > sevenDaysAgo;
  }).length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📊 Board Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold text-lg mb-2">Task Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={tasksPerStatus}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {tasksPerStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold text-lg mb-2">Tasks by Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={tasksPerStatus}>
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-center">
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-sm text-blue-800">Total Tasks</p>
          <h2 className="text-2xl font-bold text-blue-900">{totalTasks}</h2>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="text-sm text-green-800">Completion Rate</p>
          <h2 className="text-2xl font-bold text-green-900">{completionRate.toFixed(1)}%</h2>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <p className="text-sm text-red-800">Overdue Tasks</p>
          <h2 className="text-2xl font-bold text-red-900">{overdueTasks}</h2>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        Tasks added in last 7 days: <span className="font-semibold">{tasksLast7Days}</span>
      </div>
    </div>
  );
};
