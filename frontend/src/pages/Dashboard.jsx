import { useState, useMemo, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Plus,
  Filter,
  Home as HomeIcon,
  Calendar as CalendarIcon,
  Flame,
  Circle,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";
import TaskModal from "../components/AddTask";
import TaskItem from "../components/TaskItem";
import axios from "axios";

// API Base
const API_BASE = "https://taskmanager-backend-781c.onrender.com/api/tasks";

const Dashboard = () => {
  const { tasks, refreshTasks } = useOutletContext();
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Calculate stats
  const stats = useMemo(
    () => ({
      total: tasks.length,
      lowPriority: tasks.filter((t) => t.priority?.toLowerCase() === "low")
        .length,
      mediumPriority: tasks.filter(
        (t) => t.priority?.toLowerCase() === "medium"
      ).length,
      highPriority: tasks.filter((t) => t.priority?.toLowerCase() === "high")
        .length,
      completed: tasks.filter(
        (t) =>
          t.completed === true ||
          t.completed === 1 ||
          (typeof t.completed === "string" &&
            t.completed.toLowerCase() === "yes")
      ).length,
    }),
    [tasks]
  );

  // Filter tasks
  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        switch (filter) {
          case "today":
            return dueDate.toDateString() === today.toDateString();
          case "week":
            return dueDate >= today && dueDate <= nextWeek;
          case "high":
          case "medium":
          case "low":
            return task.priority?.toLowerCase() === filter;
          default:
            return true;
        }
      }),
    [tasks, filter]
  );

  // Save tasks
  const handleTaskSave = useCallback(
    async (taskData) => {
      try {
        if (taskData.id)
          await axios.put(`${API_BASE}/${taskData.id}/gp`, taskData);
        refreshTasks();
        setShowModal(false);
        setSelectedTask(null);
      } catch (error) {
        console.error("Error saving task:", error);
      }
    },
    [refreshTasks]
  );

  // Filter options
  const filterOptions = ["all", "today", "week", "high", "medium", "low"];
  const filterLabels = {
    all: "All Tasks",
    today: "Due Today",
    week: "This Week",
    high: "High Priority",
    medium: "Medium Priority",
    low: "Low Priority",
  };

  // Stats configuration
  const statsConfig = [
    {
      key: "total",
      label: "Total Tasks",
      icon: Circle,
      iconColor: "text-zinc-400",
      value: stats.total,
    },
    {
      key: "completed",
      label: "Completed",
      icon: CheckCircle2,
      iconColor: "text-green-500",
      value: stats.completed,
    },
    {
      key: "high",
      label: "High Priority",
      icon: Flame,
      iconColor: "text-red-400",
      value: stats.highPriority,
    },
    {
      key: "pending",
      label: "Pending",
      icon: Clock,
      iconColor: "text-yellow-400",
      value: stats.total - stats.completed,
    },
  ];

  return (
    <div className="flex-1 bg-black text-white p-4 md:p-6 overflow-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-xl md:text-3xl font-bold text-white flex items-center gap-2">
            <HomeIcon className="text-zinc-400 w-5 h-5 md:w-6 md:h-6 shrink-0" />
            <span className="truncate">Task Overview</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1 ml-7 truncate">
            Streamline your workflow efficiently
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 w-full md:w-auto justify-center text-sm md:text-base"
        >
          <Plus size={18} />
          Add New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {statsConfig.map(({ key, label, icon: Icon, iconColor, value }) => (
          <div
            key={key}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-4 hover:bg-zinc-800/50 transition-all duration-200 hover:border-zinc-700"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 rounded-lg bg-zinc-800">
                <Icon className={`w-4 h-4 md:w-5 md:h-5 ${iconColor}`} />
              </div>
              <div className="min-w-0">
                <p className="text-lg md:text-xl font-bold text-white">
                  {value}
                </p>
                <p className="text-xs text-zinc-400 font-medium">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Filter className="w-5 h-5 text-zinc-400 shrink-0" />
            <h2 className="text-base md:text-lg font-semibold text-white truncate">
              {filterLabels[filter]}
            </h2>
          </div>

          {/* Mobile Dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="sm:hidden w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 transition-all duration-200"
          >
            {filterOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-zinc-800 text-white">
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>

          {/* Desktop Tabs */}
          <div className="hidden sm:flex gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={[
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                  filter === opt
                    ? "bg-zinc-700 text-white border border-zinc-600"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent",
                ].join(" ")}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
              <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-zinc-900 rounded-full mb-4 border border-zinc-800">
                <CalendarIcon className="w-6 h-6 md:w-8 md:h-8 text-zinc-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                No tasks found
              </h3>
              <p className="text-sm md:text-base text-zinc-400 mb-4 max-w-sm">
                {filter === "all"
                  ? "Create your first task to get started"
                  : "No tasks match this filter"}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-zinc-100 transition-colors duration-200"
              >
                Add New Task
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task._id || task.id}
                task={task}
                onRefresh={refreshTasks}
                showCompleteCheckbox
                onEdit={() => {
                  setSelectedTask(task);
                  setShowModal(true);
                }}
              />
            ))
          )}
        </div>

        {/* Add Task (Desktop) */}
        <div
          onClick={() => setShowModal(true)}
          className="hidden md:flex items-center justify-center p-4 border-2 border-dashed border-zinc-700 rounded-xl hover:border-zinc-600 hover:bg-zinc-900/50 cursor-pointer transition-all duration-200"
        >
          <Plus className="w-5 h-5 text-zinc-400 mr-2" />
          <span className="text-zinc-400 font-medium">Add New Task</span>
        </div>
      </div>

      {/* Modal */}
      <TaskModal
        isOpen={showModal || !!selectedTask}
        onClose={() => {
          setShowModal(false);
          setSelectedTask(null);
        }}
        taskToEdit={selectedTask}
        onSave={handleTaskSave}
      />
    </div>
  );
};

export default Dashboard;
