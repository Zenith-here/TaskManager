import { useState, useRef, useEffect } from "react";
import { Settings, ChevronDown, LogOut, ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user = {}, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);
  const handleLogout = () => {
    setMenuOpen(false);
    onLogout();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md shadow-sm border-b border-zinc-800/80 font-sans">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 w-full">
        {/* Left - Logo + Brand */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          {/* Linear-style Logo */}
          <div className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-zinc-800 shadow-sm group-hover:bg-zinc-700 group-hover:scale-105 transition-all duration-200">
            <ClipboardCheck className="w-6 h-6 text-white" />
          </div>

          {/* Linear-style Brand Name */}
          <span className="text-2xl font-semibold text-white tracking-tight">
            TaskManager
          </span>
        </div>

        {/* Right - User Controls */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all duration-200"
            onClick={() => navigate("/profile")}
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* User Dropdown */}
          <div ref={menuRef} className="relative">
            <button
              onClick={handleMenuToggle}
              className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-zinc-800 transition-all duration-200 border border-transparent hover:border-zinc-700"
            >
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full bg-zinc-700 shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-700 text-white font-medium shadow-sm">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
              </div>

              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-white">
                  {user.name || "Guest User"}
                </p>
                <p className="text-xs text-zinc-400 font-normal">
                  {user.email || "user@taskmanager.com"}
                </p>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <ul className="absolute top-14 right-0 w-56 bg-zinc-900 rounded-lg shadow-xl border border-zinc-800 z-50 overflow-hidden animate-fadeIn">
                <li className="p-1">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-zinc-800 text-sm text-zinc-300 hover:text-white transition-all duration-200 flex items-center gap-2 rounded-md"
                    role="menuitem"
                  >
                    <Settings className="w-4 h-4 text-zinc-400" />
                    Profile Settings
                  </button>
                </li>
                <li className="p-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-red-900/30 text-red-400 hover:text-red-300 transition-all duration-200"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
