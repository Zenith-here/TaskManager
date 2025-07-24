import React, { useState, useMemo, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Filter,
  SortDesc,
  SortAsc,
  Award,
  Plus,
  ListChecks,
  Clock,
} from "lucide-react";
import TaskItem from "../components/TaskItem";
import TaskModal from "../components/AddTask";

const API_BASE = "http://localhost:4000/api/tasks";
const sortOptions = [
  { id: "newest", label: "Newest", icon: <SortDesc className="w-3 h-3" /> },
  { id: "oldest", label: "Oldest", icon: <SortAsc className="w-3 h-3" /> },
  { id: "priority", label: "Priority", icon: <Award className="w-3 h-3" /> },
];

const PendingTasks = () => {
  const { tasks = [], refreshTasks } = useOutletContext();
  const [sortBy, setSortBy] = useState("newest");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const handleDelete = useCallback(
    async (id) => {
      await fetch(`${API_BASE}/${id}/gp`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      refreshTasks();
    },
    [refreshTasks]
  );

  const handleToggleComplete = useCallback(
    async (id, completed) => {
      await fetch(`${API_BASE}/${id}/gp`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ completed: completed ? "Yes" : "No" }),
      });
      refreshTasks();
    },
    [refreshTasks]
  );

  const sortedPendingTasks = useMemo(() => {
    const filtered = tasks.filter(
      (t) =>
        !t.completed ||
        (typeof t.completed === "string" && t.completed.toLowerCase() === "no")
    );
    return filtered.sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      const order = { high: 3, medium: 2, low: 1 };
      return (
        order[b.priority?.toLowerCase() || "low"] -
        order[a.priority?.toLowerCase() || "low"]
      );
    });
  }, [tasks, sortBy]);

  return (
    <div className="flex-1 bg-black text-white p-4 md:p-6 overflow-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl md:text-2xl font-semibold text-white flex items-center gap-3">
            <ListChecks className="text-zinc-400 w-5 h-5 md:w-6 md:h-6" />
            <span className="truncate">Pending Tasks</span>
          </h1>
          <p className="text-sm md:text-base text-zinc-400 font-normal">
            {sortedPendingTasks.length} task
            {sortedPendingTasks.length !== 1 && "s"} needing your attention
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-zinc-300">
              <Filter className="w-4 h-4 text-zinc-400" />
              <span className="text-xs md:text-sm">Sort by:</span>
            </div>

            {/* Mobile Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sm:hidden w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 transition-all duration-200"
            >
              <option value="newest" className="bg-zinc-800 text-white">
                Newest First
              </option>
              <option value="oldest" className="bg-zinc-800 text-white">
                Oldest First
              </option>
              <option value="priority" className="bg-zinc-800 text-white">
                By Priority
              </option>
            </select>

            {/* Desktop Buttons */}
            <div className="hidden sm:flex gap-1">
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={[
                    "flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200",
                    sortBy === opt.id
                      ? "bg-zinc-700 text-white border border-zinc-600"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent",
                  ].join(" ")}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Button */}
      <div
        className="mb-6 p-4 border-2 border-dashed border-zinc-700 rounded-lg hover:border-zinc-600 hover:bg-zinc-900/50 transition-all duration-200 cursor-pointer group"
        onClick={() => setShowModal(true)}
      >
        <div className="flex items-center justify-center gap-3 text-zinc-400 group-hover:text-white transition-colors">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shadow-sm group-hover:bg-zinc-700 transition-all duration-200">
            <Plus size={18} className="text-zinc-400 group-hover:text-white" />
          </div>
          <span className="font-medium">Add New Task</span>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {sortedPendingTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
            <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-zinc-900 rounded-full mb-4 border border-zinc-800">
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
              All caught up!
            </h3>
            <p className="text-sm md:text-base text-zinc-400 max-w-sm mb-4">
              No pending tasks - great work!
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-zinc-100 transition-colors duration-200"
            >
              Create New Task
            </button>
          </div>
        ) : (
          sortedPendingTasks.map((task) => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              showCompleteCheckbox
              onDelete={() => handleDelete(task._id || task.id)}
              onToggleComplete={() =>
                handleToggleComplete(task._id || task.id, !task.completed)
              }
              onEdit={() => {
                setSelectedTask(task);
                setShowModal(true);
              }}
              onRefresh={refreshTasks}
            />
          ))
        )}
      </div>

      <TaskModal
        isOpen={!!selectedTask || showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedTask(null);
          refreshTasks();
        }}
        taskToEdit={selectedTask}
        onSave={refreshTasks}
      />
    </div>
  );
};

export default PendingTasks;
