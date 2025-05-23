// import { Task } from "@/store/boardStore";
// import TaskCard from "./TaskCard";

import type { Task } from "../store/boardStore";
import TaskCard from "./TaskCard";

type Props = {
  status: string;
  tasks: Task[];
};

const TaskColumn = ({ status, tasks }: Props) => {
  return (
    <div className="bg-gray-100 rounded-xl p-4 shadow-md min-h-[300px]">
      <h2 className="text-xl font-semibold mb-4">{status}</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
