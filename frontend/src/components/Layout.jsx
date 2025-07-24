import { useState, useEffect, useCallback, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { Circle, TrendingUp, Zap, Clock } from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";

const Layout = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const { data } = await axios.get("http://localhost:4000/api/tasks/gp", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.tasks)
        ? data.tasks
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setTasks(arr);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not load tasks.");
      if (err.response?.status === 401) onLogout();
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(
      (t) =>
        t.completed === true ||
        t.completed === 1 ||
        (typeof t.completed === "string" && t.completed.toLowerCase() === "yes")
    ).length;

    const totalCount = tasks.length;
    const pendingCount = totalCount - completedTasks;
    const completionPercentage = totalCount
      ? Math.round((completedTasks / totalCount) * 100)
      : 0;

    return {
      totalCount,
      completedTasks,
      pendingCount,
      completionPercentage,
    };
  }, [tasks]);

  const StatCard = ({ title, value, icon }) => (
    <div className="p-2 sm:p-3 rounded-xl bg-zinc-900 shadow-sm border border-zinc-800 hover:bg-zinc-800/50 transition-all duration-300 hover:border-zinc-700 group">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 transition-colors">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-lg sm:text-xl font-bold text-white">{value}</p>
          <p className="text-xs text-zinc-400 font-medium">{title}</p>
        </div>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-400"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-black p-6 flex items-center justify-center">
        <div className="bg-red-900/20 text-red-400 p-4 rounded-xl border border-red-800/50 max-w-md">
          <p className="font-medium mb-2">Error loading tasks</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchTasks}
            className="mt-4 px-4 py-2 bg-red-900/30 text-red-400 rounded-lg text-sm font-medium hover:bg-red-900/40 transition-colors border border-red-800/50"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-black">
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar user={user} tasks={tasks} />

      <div className="ml-0 xl:ml-64 lg:ml-64 md:ml-16 pt-16 p-3 sm:p-4 md:p-4 transition-all duration-300">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2 space-y-3 sm:space-y-4">
            <Outlet context={{ tasks, refreshTasks: fetchTasks }} />
          </div>

          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-zinc-900 rounded-xl p-4 sm:p-5 shadow-sm border border-zinc-800">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400" />
                Task Statistics
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <StatCard
                  title="Total Tasks"
                  value={stats.totalCount}
                  icon={
                    <Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400" />
                  }
                />
                <StatCard
                  title="Completed"
                  value={stats.completedTasks}
                  icon={
                    <Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                  }
                />
                <StatCard
                  title="Pending"
                  value={stats.pendingCount}
                  icon={
                    <Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                  }
                />
                <StatCard
                  title="Completion Rate"
                  value={`${stats.completionPercentage}%`}
                  icon={
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400" />
                  }
                />
              </div>

              <hr className="my-3 sm:my-4 border-zinc-800" />

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                    <Circle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-400 fill-zinc-400" />
                    Task Progress
                  </span>
                  <span className="text-xs bg-zinc-800 text-zinc-300 px-1.5 py-0.5 sm:px-2 rounded-full border border-zinc-700">
                    {stats.completedTasks}/{stats.totalCount}
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="flex gap-1.5 items-center">
                    <div className="flex-1 h-2 sm:h-3 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-500"
                        style={{ width: `${stats.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-4 sm:p-5 shadow-sm border border-zinc-800">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-white flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400" />
                Recent Activity
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {tasks.slice(0, 3).map((task) => (
                  <div
                    key={task._id || task.id}
                    className="flex items-center justify-between p-2 sm:p-3 hover:bg-zinc-800/50 rounded-lg transition-colors duration-200 border border-transparent hover:border-zinc-700"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white break-words whitespace-normal">
                        {task.title}
                      </p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {task.createdAt
                          ? new Date(task.createdAt).toLocaleDateString()
                          : "No date"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full shrink-0 ml-2 ${
                        task.completed
                          ? "bg-green-900/30 text-green-400 border border-green-800/50"
                          : "bg-red-900/30 text-red-400 border border-red-800/50"
                      }`}
                    >
                      {task.completed ? "Done" : "Pending"}
                    </span>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-4 sm:py-6 px-2">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                      <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-400" />
                    </div>
                    <p className="text-sm text-zinc-400">No recent activity</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Tasks will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
