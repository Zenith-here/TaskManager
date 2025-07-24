import { useState, useEffect } from "react";
import axios from "axios";
import { UserPlus } from "lucide-react";

import {
  Inputwrapper,
  FIELDS,
  BUTTONCLASSES,
  MESSAGE_SUCCESS,
  MESSAGE_ERROR,
} from "../assets/dummy";

const API_URL = "http://localhost:4000";
const INITIAL_FORM = { name: "", email: "", password: "" };

const SignUp = ({ onSwitchMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    console.log("SignUp form data changed:", formData);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const { data } = await axios.post(
        `${API_URL}/api/user/register`,
        formData
      );
      console.log("SignUp successful:", data);
      setMessage({
        text: "Registration successful! You can now log in.",
        type: "success",
      });
      setFormData(INITIAL_FORM);
    } catch (err) {
      console.error("SignUp error:", err);
      setMessage({
        text:
          err.response?.data?.message || "An error occurred. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-zinc-900 shadow-xl border border-zinc-800 rounded-xl p-8">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-zinc-800 rounded-full mx-auto flex items-center justify-center mb-4 border border-zinc-700">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Create Account</h2>
        <p className="text-zinc-400 text-sm mt-1">
          Join TaskManager to manage your tasks
        </p>
      </div>

      {message.text && (
        <div
          className={
            message.type === "success"
              ? "bg-green-900/20 text-green-400 p-3 rounded-lg border border-green-800/50 mb-4 text-sm"
              : "bg-red-900/20 text-red-400 p-3 rounded-lg border border-red-800/50 mb-4 text-sm"
          }
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
          <div
            key={name}
            className="flex items-center border border-zinc-700 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-zinc-600 focus-within:border-zinc-600 transition-all duration-200 bg-zinc-800"
          >
            <Icon className="text-zinc-400 w-5 h-5 mr-2" />
            <input
              type={type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) =>
                setFormData({ ...formData, [name]: e.target.value })
              }
              className="w-full focus:outline-none text-sm bg-transparent text-white placeholder-zinc-500"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-white text-black font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-zinc-100 transition-all duration-200"
          disabled={loading}
        >
          {loading ? (
            "Signing Up..."
          ) : (
            <>
              <UserPlus className="w-4 h-4" /> Sign Up
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-400 mt-6">
        Already have an account?{" "}
        <button
          onClick={onSwitchMode}
          className="text-white hover:text-zinc-300 hover:underline font-medium transition-colors"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default SignUp;
