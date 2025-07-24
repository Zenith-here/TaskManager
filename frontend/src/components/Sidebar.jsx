import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Sparkles, Lightbulb, Menu, X } from "lucide-react";
import TaskModal from "../components/AddTask";
import {
  menuItems,
  SIDEBAR_CLASSES,
  LINK_CLASSES,
  PRODUCTIVITY_CARD,
  TIP_CARD,
} from "../assets/dummy";

const Sidebar = ({ user, tasks }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.completed).length || 0;
  const productivity =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const username = user?.name || "User";
  const initial = username.charAt(0).toUpperCase();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  const renderMenuItems = (isMobile = false) => (
    <ul className="space-y-2">
      {menuItems.map(({ text, path, icon }) => (
        <li key={text}>
          <NavLink
            to={path}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium",
                isActive
                  ? "bg-zinc-800 text-white border border-zinc-700"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50 border border-transparent",
                isMobile ? "justify-start" : "lg:justify-start",
              ].join(" ")
            }
            onClick={() => setMobileOpen(false)}
          >
            <span className="flex-shrink-0">{icon}</span>
            <span
              className={`${isMobile ? "block" : "hidden lg:block"} truncate`}
            >
              {text}
            </span>
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-zinc-900 border-r border-zinc-800 shadow-sm z-30 hidden md:flex flex-col">
        <div className="p-5 border-b border-zinc-800 lg:block hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-white font-bold shadow-md border border-zinc-600">
              {initial}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Hey, {username}</h2>
              <p className="text-sm text-zinc-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Work. Win. Repeat.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-zinc-400 tracking-wider">
                PRODUCTIVITY
              </h3>
              <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded-full border border-zinc-600">
                {productivity}%
              </span>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${productivity}%` }}
              />
            </div>
          </div>

          {renderMenuItems()}
        </div>
      </div>

      {/* Mobile Toggle Button */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-20 left-4 z-40 p-2 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors md:hidden shadow-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          <div
            className="absolute left-0 top-0 h-full w-80 bg-zinc-900 border-r border-zinc-800 shadow-xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold text-white">Menu</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800 p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-white font-bold shadow-md border border-zinc-600">
                {initial}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Hey, {username}
                </h2>
                <p className="text-sm text-zinc-400 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Work. Win. Repeat.
                </p>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-zinc-400 tracking-wider">
                  PRODUCTIVITY
                </h3>
                <span className="text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded-full border border-zinc-600">
                  {productivity}%
                </span>
              </div>
              <div className="w-full bg-zinc-700 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${productivity}%` }}
                />
              </div>
            </div>

            {renderMenuItems(true)}
          </div>
        </div>
      )}

      <TaskModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default Sidebar;
