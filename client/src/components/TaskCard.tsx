// import { Task } from "../store/boardStore";

import type { Task } from "../store/boardStore";

type Props = {
  task: Task;
};

const TaskCard = ({ task }: Props) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-all">
      <h3 className="font-bold">{task.name}</h3>
      {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
      {task.icon && <div className="mt-2 text-xl">{task.icon}</div>}
    </div>
  );
};

export default TaskCard;
