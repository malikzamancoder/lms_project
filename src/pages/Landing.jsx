import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useUserRole } from "../context/UserRoleContext";

const PORTALS = [
  {
    role: "student",
    title: "Student Portal",
    icon: "🎓",
    desc: "View your marks, attempt quizzes, and submit assignments",
  },
  {
    role: "teacher",
    title: "Teacher Portal",
    icon: "👨‍🏫",
    desc: "Manage students, enter marks, create quizzes & assignments",
  },
  {
    role: "admin",
    title: "Admin Portal",
    icon: "🛡️",
    desc: "Oversee teachers, students, and manage user roles",
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useUser();
  const { role, loadingRole } = useUserRole();

  useEffect(() => {
    if (!isLoaded || loadingRole) return;
    if (isSignedIn) {
      if (role) navigate(`/${role}`);
      else navigate("/onboarding");
    }
  }, [isLoaded, isSignedIn, role, loadingRole, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center px-6 py-16">
      <div className="text-center mb-12">
        <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-lg">IM</span>
        </div>
        <h1 className="text-white text-3xl sm:text-4xl font-bold mb-2">
          Institute Management System
        </h1>
        <p className="text-slate-400 text-sm">Select your portal to continue</p>
      </div>

      {/* Portal Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-3xl mb-10">
        {PORTALS.map((p) => (
          <div
            key={p.role}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-white/10 transition"
          >
            <span className="text-4xl mb-3">{p.icon}</span>
            <h2 className="text-white font-semibold text-lg mb-1">{p.title}</h2>
            <p className="text-slate-400 text-xs mb-5">{p.desc}</p>
            <button
              onClick={() => navigate("/sign-in")}
              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition"
            >
              Login
            </button>
          </div>
        ))}
      </div>

      <p className="text-slate-500 text-sm">
        New here?{" "}
        <button
          onClick={() => navigate("/sign-up")}
          className="text-indigo-400 hover:text-indigo-300 font-medium"
        >
          Create an account
        </button>
      </p>
    </div>
  );
};

export default Landing;