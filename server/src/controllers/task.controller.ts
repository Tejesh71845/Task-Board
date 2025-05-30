import { Request, Response } from "express";
import { ITask, Task } from "../models/task.model";
import { statusIcons } from "../utils/statusIcons";

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { boardId, name, description, icon, dueDate, subtasks = [] } = req.body;

    const total = subtasks.length;
    const done = subtasks.filter((s: any) => s.done).length;
    const completion = total === 0 ? 0 : Math.round((done / total) * 100);

    let status: ITask["status"] = "To Do";
    if (completion === 100) status = "Completed";
    else if (completion > 0) status = "In Progress";

    const task = await Task.create({
      boardId,
      name,
      description,
      icon,
      dueDate,
      subtasks,
      completion,
      status,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to create task", error });
  }
};



// Get a task by ID
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to get task", error });
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dueDate, subtasks = [], ...rest } = req.body;

    const total = subtasks.length;
    const done = subtasks.filter((s: any) => s.done).length;
    const completion = total === 0 ? 0 : Math.round((done / total) * 100);

    let status: ITask["status"] = "To Do";
    if (completion === 100) status = "Completed";
    else if (completion > 0) status = "In Progress";

    // If previous status was "Won't do", keep it and skip updates
    const existingTask = await Task.findById(req.params.taskId);
    if (!existingTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    if (existingTask.status === "Won't do") {
      // We allow updating subtasks but keep status and hide progress bar in UI
      const updated = await Task.findByIdAndUpdate(
        req.params.taskId,
        { ...rest, subtasks, dueDate },
        { new: true }
      );
      res.json(updated);
      return;
    }

    const icon = statusIcons[status] || "📝";

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      {
        ...rest,
        dueDate,
        subtasks,
        completion,
        status,
        icon,
      },
      { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error });
  }
};


export const toggleSubtaskStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { taskId, subtaskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) {
      res.status(404).json({ message: "Subtask not found" });
      return;
    }

    // Toggle subtask status
    subtask.done = !subtask.done;

    // Recalculate completion
    const total = task.subtasks.length;
    const completed = task.subtasks.filter((st: { done: any; }) => st.done).length;
    const completion = Math.round((completed / total) * 100);

    // Update task metadata
    task.completion = completion;

    if (task.status !== "Won't do") {
      if (completion === 100) task.status = "Completed";
      else if (completion === 0) task.status = "To Do";
      else task.status = "In Progress";

      task.icon = statusIcons[task.status] || "📝";
    }

    await task.save();

    const normalizedTask = {
      ...task.toObject(),
      completion: task.completion, // ✅ ADD THIS
      status: task.status,
      icon: task.icon,
      subtasks: task.subtasks.map((st: { _id: any; title: any; done: any; }) => ({
        _id: st._id,
        title: st.title,
        isCompleted: st.done,
      })),
    };

    res.json(normalizedTask);

  } catch (error) {
    res.status(500).json({ message: "Failed to toggle subtask", error });
  }
};



// Delete a task
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error });
  }
};
