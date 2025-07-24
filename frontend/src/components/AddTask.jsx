import React, { useState, useEffect, useCallback } from "react";
import {
  PlusCircle,
  X,
  Save,
  Calendar,
  AlignLeft,
  Flag,
  CheckCircle,
} from "lucide-react";
import {
  baseControlClasses,
  priorityStyles,
  DEFAULT_TASK,
} from "../assets/dummy";

const API_BASE = "https://taskmanager-backend-781c.onrender.com/api/tasks";

const TaskModal = ({ isOpen, onClose, taskToEdit, onSave, onLogout }) => {
  const [taskData, setTaskData] = useState(DEFAULT_TASK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!isOpen) return;
    if (taskToEdit) {
      const normalized =
        taskToEdit.completed === "Yes" || taskToEdit.completed === true
          ? "Yes"
          : "No";
      setTaskData({
        ...DEFAULT_TASK,
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        priority: taskToEdit.priority || "Low",
        dueDate: taskToEdit.dueDate?.split("T")[0] || "",
        completed: normalized,
        id: taskToEdit._id,
      });
    } else {
      setTaskData(DEFAULT_TASK);
    }
    setError(null);
  }, [isOpen, taskToEdit]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (taskData.dueDate < today) {
        setError("Due date cannot be in the past.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const isEdit = Boolean(taskData.id);
        const url = isEdit ? `${API_BASE}/${taskData.id}/gp` : `${API_BASE}/gp`;
        const resp = await fetch(url, {
          method: isEdit ? "PUT" : "POST",
          headers: getHeaders(),
          body: JSON.stringify(taskData),
        });
        if (!resp.ok) {
          if (resp.status === 401) return onLogout?.();
          const err = await resp.json();
          throw new Error(err.message || "Failed to save task");
        }
        const saved = await resp.json();
        onSave?.(saved);
        onClose();
      } catch (err) {
        console.error(err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    },
    [taskData, today, getHeaders, onLogout, onSave, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full shadow-xl p-6 relative animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            {taskData.id ? (
              <Save className="text-zinc-400 w-5 h-5" />
            ) : (
              <PlusCircle className="text-zinc-400 w-5 h-5" />
            )}
            {taskData.id ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-800/50">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Task Title
            </label>
            <div className="flex items-center border border-zinc-700 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-zinc-600 focus-within:border-zinc-600 transition-all duration-200 bg-zinc-800">
              <input
                type="text"
                name="title"
                required
                value={taskData.title}
                onChange={handleChange}
                className="w-full focus:outline-none text-sm bg-transparent text-white placeholder-zinc-500"
                placeholder="Enter task title"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-300 mb-1 flex items-center gap-1">
              <AlignLeft className="w-4 h-4 text-zinc-400" /> Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={taskData.description}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 transition-all duration-200 bg-zinc-800 text-white placeholder-zinc-500 text-sm"
              placeholder="Add details about your task"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-1 flex items-center gap-1">
                <Flag className="w-4 h-4 text-zinc-400" /> Priority
              </label>
              <select
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 transition-all duration-200 bg-zinc-800 text-white text-sm"
              >
                <option className="bg-zinc-800 text-white">Low</option>
                <option className="bg-zinc-800 text-white">Medium</option>
                <option className="bg-zinc-800 text-white">High</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-zinc-400" /> Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                required
                min={today}
                value={taskData.dueDate}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-zinc-600 focus:border-zinc-600 transition-all duration-200 bg-zinc-800 text-white text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-zinc-400" /> Status
            </label>
            <div className="flex gap-4">
              {[
                { val: "Yes", label: "Completed" },
                { val: "No", label: "In Progress" },
              ].map(({ val, label }) => (
                <label key={val} className="flex items-center">
                  <input
                    type="radio"
                    name="completed"
                    value={val}
                    checked={taskData.completed === val}
                    onChange={handleChange}
                    className="h-4 w-4 text-zinc-400 focus:ring-zinc-500 border-zinc-600 bg-zinc-800 rounded"
                  />
                  <span className="ml-2 text-sm text-zinc-300">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-zinc-100 transition-all duration-200"
          >
            {loading ? (
              "Saving..."
            ) : taskData.id ? (
              <>
                <Save className="w-4 h-4" /> Update Task
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" /> Create Task
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
