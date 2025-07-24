import { useState, useEffect } from "react";
import axios from "axios";
import { format, isToday } from "date-fns";
import TaskModal from "./AddTask";
import {
  getPriorityColor,
  getPriorityBadgeColor,
  TI_CLASSES,
  MENU_OPTIONS,
} from "../assets/dummy";
import { CheckCircle2, MoreVertical, Clock, Calendar } from "lucide-react";

const API_BASE = "http://localhost:4000/api/tasks";

const TaskItem = ({
  task,
  onRefresh,
  onLogout,
  showCompleteCheckbox = true,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isCompleted, setIsCompleted] = useState(
    [true, 1, "yes"].includes(
      typeof task.completed === "string"
        ? task.completed.toLowerCase()
        : task.completed
    )
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [subtasks, setSubtasks] = useState(task.subtasks || []);

  useEffect(() => {
    setIsCompleted(
      [true, 1, "yes"].includes(
        typeof task.completed === "string"
          ? task.completed.toLowerCase()
          : task.completed
      )
    );
  }, [task.completed]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");
    return { Authorization: `Bearer ${token}` };
  };

  const borderColor = isCompleted
    ? "border-green-500/50"
    : task.priority === "High"
    ? "border-red-500/50"
    : task.priority === "Medium"
    ? "border-yellow-500/50"
    : "border-zinc-700";

  const handleComplete = async () => {
    const newStatus = isCompleted ? "No" : "Yes";
    try {
      await axios.put(
        `${API_BASE}/${task._id}/gp`,
        { completed: newStatus },
        { headers: getAuthHeaders() }
      );
      setIsCompleted(!isCompleted);
      onRefresh?.();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) onLogout?.();
    }
  };

  const handleAction = (action) => {
    setShowMenu(false);
    if (action === "edit") setShowEditModal(true);
    if (action === "delete") handleDelete();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/${task._id}/gp`, {
        headers: getAuthHeaders(),
      });
      onRefresh?.();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) onLogout?.();
    }
  };

  const handleSave = async (updatedTask) => {
    try {
      const payload = (({
        title,
        description,
        priority,
        dueDate,
        completed,
      }) => ({ title, description, priority, dueDate, completed }))(
        updatedTask
      );
      await axios.put(`${API_BASE}/${task._id}/gp`, payload, {
        headers: getAuthHeaders(),
      });
      setShowEditModal(false);
      onRefresh?.();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) onLogout?.();
    }
  };

  const progress = subtasks.length
    ? (subtasks.filter((st) => st.completed).length / subtasks.length) * 100
    : 0;

  const getPriorityBadgeStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-900/30 text-red-400 border border-red-800/50";
      case "medium":
        return "bg-yellow-900/30 text-yellow-400 border border-yellow-800/50";
      case "low":
        return "bg-zinc-800 text-zinc-400 border border-zinc-700";
      default:
        return "bg-zinc-800 text-zinc-400 border border-zinc-700";
    }
  };

  return (
    <>
      <div
        className={`bg-zinc-900 border ${borderColor} rounded-lg p-4 hover:bg-zinc-900/93 transition-all duration-200 flex items-start gap-3 relative group shadow-sm`}
      >
        <div className="flex-1 min-w-0 flex items-start gap-3">
          {showCompleteCheckbox && (
            <button
              onClick={handleComplete}
              className={`mt-0.5 p-1 rounded-full hover:bg-zinc-800 transform transition-all duration-200 hover:scale-125 ${
                isCompleted
                  ? "text-green-500"
                  : "text-zinc-400 hover:text-zinc-300"
              }`}
            >
              <CheckCircle2
                size={18}
                className={`transition-all duration-200 ${
                  isCompleted
                    ? "fill-green-500 text-green-500"
                    : "text-zinc-400"
                }`}
              />
            </button>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <h3
                className={`font-medium text-sm sm:text-base truncate ${
                  isCompleted ? "text-zinc-300 line-through" : "text-white"
                }`}
              >
                {task.title}
              </h3>
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityBadgeStyle(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
            </div>
            {task.description && (
              <p
                className={`text-sm mb-2 ${
                  isCompleted ? "text-zinc-400" : "text-zinc-400"
                }`}
              >
                {task.description}
              </p>
            )}
            {subtasks.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                  <span>Subtasks Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5">
                  <div
                    className="bg-zinc-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="space-y-1 sm:space-y-2 pt-1">
                  {subtasks.map((st, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 group/subtask"
                    >
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() =>
                          setSubtasks((prev) =>
                            prev.map((s, idx) =>
                              idx === i ? { ...s, completed: !s.completed } : s
                            )
                          )
                        }
                        className="w-4 h-4 text-zinc-500 bg-zinc-800 border-zinc-600 rounded focus:ring-zinc-500 focus:ring-2"
                      />
                      <span
                        className={`text-sm truncate transition-colors duration-200 ${
                          st.completed
                            ? "text-zinc-500 line-through"
                            : "text-zinc-300 group-hover/subtask:text-white"
                        }`}
                      >
                        {st.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical size={16} className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 w-32 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl py-1 z-10">
                {MENU_OPTIONS.map((opt) => (
                  <button
                    key={opt.action}
                    onClick={() => handleAction(opt.action)}
                    className="w-full px-3 py-2 text-left text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center gap-2 transition-colors duration-200"
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="text-right">
            <div
              className={`flex items-center gap-1 text-xs mb-1 ${
                task.dueDate && isToday(new Date(task.dueDate))
                  ? "text-red-400"
                  : "text-zinc-400"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {task.dueDate
                  ? isToday(new Date(task.dueDate))
                    ? "Today"
                    : format(new Date(task.dueDate), "MMM dd")
                  : "—"}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <Clock className="w-3 h-3" />
              <span>
                {task.createdAt
                  ? `Created ${format(new Date(task.createdAt), "MMM dd")}`
                  : "No date"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        taskToEdit={task}
        onSave={handleSave}
      />
    </>
  );
};

export default TaskItem;
