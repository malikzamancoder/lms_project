import React from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";

const StudentDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const cards = [
    { label: "My Marks", icon: "📊", path: "/student/marks", desc: "View your exam results" },
    { label: "Quizzes", icon: "❓", path: "/student/quizzes", desc: "Attempt available quizzes" },
    { label: "Assignments", icon: "📝", path: "/student/assignments", desc: "Check pending assignments" },
  ];

  return (
    <div>
      <h2 className="text-white text-xl font-semibold mb-1">
        Welcome, {user?.firstName || "Student"} 👋
      </h2>
      <p className="text-slate-400 text-sm mb-6">Here's a quick overview of your portal</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <button
            key={c.path}
            onClick={() => navigate(c.path)}
            className="text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-5 transition"
          >
            <span className="text-2xl">{c.icon}</span>
            <h3 className="text-white font-medium mt-3">{c.label}</h3>
            <p className="text-slate-400 text-xs mt-1">{c.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;