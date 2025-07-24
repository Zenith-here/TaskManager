import { useState, useEffect } from "react";
import axios from "axios";
import {
  Lock,
  ChevronLeft,
  Shield,
  LogOut,
  Save,
  UserCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  INPUT_WRAPPER,
  FULL_BUTTON,
  SECTION_WRAPPER,
  BACK_BUTTON,
  DANGER_BTN,
  personalFields,
  securityFields,
} from "../assets/dummy";

const API_URL = "http://localhost:4000";

export default function Profile({ setCurrentUser, onLogout }) {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get(`${API_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        if (data.success)
          setProfile({ name: data.user.name, email: data.user.email });
        else toast.error(data.message);
      })
      .catch(() => toast.error("Unable to load profile."));
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_URL}/api/user/profile`,
        { name: profile.name, email: profile.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setCurrentUser((prev) => ({
          ...prev,
          name: profile.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile.name
          )}&background=random`,
        }));
        toast.success("Profile updated");
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return toast.error("Passwords do not match");
    }
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_URL}/api/user/password`,
        { currentPassword: passwords.current, newPassword: passwords.new },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Password changed");
        setPasswords({ current: "", new: "", confirm: "" });
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme="dark"
        toastStyle={{
          backgroundColor: "#18181b",
          color: "#ffffff",
          border: "1px solid #3f3f46",
        }}
      />
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors duration-200 border border-zinc-700 hover:border-zinc-600"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-zinc-700 flex items-center justify-center text-white text-2xl font-bold shadow-md border border-zinc-600">
            {profile.name ? profile.name[0].toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Account Settings</h1>
            <p className="text-zinc-400 text-sm">
              Manage your profile and security settings
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <UserCircle className="text-zinc-400 w-5 h-5" />
              <h2 className="text-xl font-semibold text-white">
                Personal Information
              </h2>
            </div>
            <form onSubmit={saveProfile} className="space-y-4">
              {personalFields.map(({ name, type, placeholder, icon: Icon }) => (
                <div
                  key={name}
                  className="flex items-center border border-zinc-700 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-zinc-600 focus-within:border-zinc-600 transition-all duration-200 bg-zinc-800"
                >
                  <Icon className="text-zinc-400 w-5 h-5 mr-2" />
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={profile[name]}
                    onChange={(e) =>
                      setProfile({ ...profile, [name]: e.target.value })
                    }
                    className="w-full text-sm focus:outline-none bg-transparent text-white placeholder-zinc-500"
                    required
                  />
                </div>
              ))}
              <button className="w-full bg-white text-black font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-100 transition-colors duration-200">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </form>
          </section>

          <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="text-zinc-400 w-5 h-5" />
              <h2 className="text-xl font-semibold text-white">Security</h2>
            </div>
            <form onSubmit={changePassword} className="space-y-4">
              {securityFields.map(({ name, placeholder }) => (
                <div
                  key={name}
                  className="flex items-center border border-zinc-700 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-zinc-600 focus-within:border-zinc-600 transition-all duration-200 bg-zinc-800"
                >
                  <Lock className="text-zinc-400 w-5 h-5 mr-2" />
                  <input
                    type="password"
                    placeholder={placeholder}
                    value={passwords[name]}
                    onChange={(e) =>
                      setPasswords({ ...passwords, [name]: e.target.value })
                    }
                    className="w-full text-sm focus:outline-none bg-transparent text-white placeholder-zinc-500"
                    required
                  />
                </div>
              ))}
              <button className="w-full bg-white text-black font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-100 transition-colors duration-200">
                <Shield className="w-4 h-4" /> Change Password
              </button>

              <div className="mt-8 pt-6 border-t border-zinc-800">
                <h3 className="text-red-400 font-semibold mb-4 flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Danger Zone
                </h3>
                <button
                  onClick={onLogout}
                  className="w-full bg-red-900/30 text-red-400 font-medium py-2.5 px-4 rounded-lg hover:bg-red-900/40 transition-colors duration-200 border border-red-800/50 hover:border-red-700/50"
                >
                  Logout
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
