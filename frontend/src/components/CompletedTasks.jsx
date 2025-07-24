import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { CheckCircle2, Filter } from "lucide-react";
import TaskItem from "../components/TaskItem";
import { SORT_OPTIONS, CT_CLASSES } from "../assets/dummy";

const CompletedTasks = () => {
  const { tasks, refreshTasks } = useOutletContext();
  const [sortBy, setSortBy] = useState("newest");

  const sortedCompletedTasks = useMemo(() => {
    return tasks
      .filter((task) =>
        [true, 1, "yes"].includes(
          typeof task.completed === "string"
            ? task.completed.toLowerCase()
            : task.completed
        )
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt);
          case "priority": {
            const order = { high: 3, medium: 2, low: 1 };
            return (
              order[b.priority?.toLowerCase()] -
              order[a.priority?.toLowerCase()]
            );
          }
          default:
            return 0;
        }
      });
  }, [tasks, sortBy]);

  return (
    <div className="flex-1 bg-black text-white p-4 md:p-6 overflow-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="flex items-center gap-3 text-xl md:text-2xl font-semibold text-white">
            <CheckCircle2 className="text-green-500 w-5 h-5 md:w-6 md:h-6" />
            <span className="truncate">Completed Tasks</span>
          </h1>
          <p className="text-sm md:text-base text-zinc-400 font-normal">
            {sortedCompletedTasks.length} task
            {sortedCompletedTasks.length !== 1 && "s"} marked as complete
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
              {SORT_OPTIONS.map((opt) => (
                <option
                  key={opt.id}
                  value={opt.id}
                  className="bg-zinc-800 text-white"
                >
                  {opt.label} {opt.id === "newest" ? "First" : ""}
                </option>
              ))}
            </select>

            {/* Desktop Buttons */}
            <div className="hidden sm:flex gap-1">
              {SORT_OPTIONS.map((opt) => (
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

      {/* Task List */}
      <div className="space-y-3">
        {sortedCompletedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
            <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-zinc-900 rounded-full mb-4 border border-zinc-800">
              <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-green-500" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
              No completed tasks yet!
            </h3>
            <p className="text-sm md:text-base text-zinc-400 max-w-sm">
              Complete some tasks and they'll appear here
            </p>
          </div>
        ) : (
          sortedCompletedTasks.map((task) => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              onRefresh={refreshTasks}
              showCompleteCheckbox={false}
              className="opacity-90 hover:opacity-100 transition-opacity text-sm md:text-base"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CompletedTasks;
