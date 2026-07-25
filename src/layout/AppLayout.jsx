import React from "react";
import { useNavigate, useLocation } from "react-router";
import { useUser, useClerk } from "@clerk/clerk-react";

const MENUS = {
  student: [
    { label: "Dashboard", icon: "🏠", path: "/student" },
    { label: "Marks", icon: "📊", path: "/student/marks" },
    { label: "Quizzes", icon: "❓", path: "/student/quizzes" },
    { label: "Assignments", icon: "📝", path: "/student/assignments" },
  ],
  teacher: [
    { label: "Dashboard", icon: "🏠", path: "/teacher" },
    { label: "Students", icon: "🎓", path: "/teacher/students" },
    { label: "Marks", icon: "📊", path: "/teacher/marks" },
    { label: "Quizzes", icon: "❓", path: "/teacher/quizzes" },
    { label: "Assignments", icon: "📝", path: "/teacher/assignments" },
  ],
  admin: [
    { label: "Dashboard", icon: "🏠", path: "/admin" },
    { label: "Teachers", icon: "👨‍🏫", path: "/admin/teachers" },
  ],
};

const AppLayout = ({ children, role = "student" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const menu = MENUS[role] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="h-16 bg-white/5 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">IM</span>
          </div>
          <h1 className="text-white font-semibold text-lg">Institute Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">
            Welcome, {user?.firstName || "User"}{" "}
            <span className="text-indigo-400 capitalize">({role})</span>
          </span>
        </div>
      </div>

      {/* Body — Sidebar + Main */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white/5 border-r border-white/10 p-4 flex flex-col gap-2 sticky top-16 h-[calc(100vh-4rem)]">
          <p className="text-slate-500 text-xs uppercase font-semibold mb-2 px-3">Menu</p>

          {menu.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm font-medium text-left ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.icon} {item.label}
              </button>
            );
          })}

          {/* Sign Out at bottom */}
          <div className="mt-auto">
            <button
              onClick={() => signOut(() => navigate("/"))}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition text-sm font-medium"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6">{children}</div>

          {/* Footer */}
          <div className="border-t border-white/10 bg-white/5 px-6 py-4 flex justify-between items-center">
            <p className="text-slate-500 text-xs">© 2024 Institute Management System</p>
            <p className="text-slate-500 text-xs">Built with React + Firebase + Clerk</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;