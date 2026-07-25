import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useUserRole } from "../context/UserRoleContext";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const { role, loadingRole, setRole, setProfile } = useUserRole();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (!loadingRole && role) {
      navigate(`/${role}`);
    }
  }, [loadingRole, role, navigate]);

  const chooseRole = async (chosenRole) => {
    if (!user) return;
    setSaving(true);
    try {
      const profileData = {
        role: chosenRole,
        name: user.fullName || user.username || "Unnamed",
        email: user.primaryEmailAddress?.emailAddress || "",
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "users", user.id), profileData);
      setRole(chosenRole);
      setProfile(profileData);
      navigate(`/${chosenRole}`);
    } catch (err) {
      console.error("Error saving role:", err);
      setSaving(false);
    }
  };

  if (!isLoaded || loadingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center px-6">
      <h1 className="text-white text-2xl font-bold mb-2">Welcome, {user?.firstName || "there"}!</h1>
      <p className="text-slate-400 text-sm mb-8">Select how you'll be using this platform</p>

      <div className="flex flex-col sm:flex-row gap-5">
        <button
          disabled={saving}
          onClick={() => chooseRole("student")}
          className="w-56 p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition disabled:opacity-50"
        >
          <span className="text-3xl">🎓</span>
          <h2 className="text-white font-semibold mt-3">I'm a Student</h2>
          <p className="text-slate-400 text-xs mt-1">View marks, take quizzes, submit assignments</p>
        </button>

        <button
          disabled={saving}
          onClick={() => chooseRole("teacher")}
          className="w-56 p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition disabled:opacity-50"
        >
          <span className="text-3xl">👨‍🏫</span>
          <h2 className="text-white font-semibold mt-3">I'm a Teacher</h2>
          <p className="text-slate-400 text-xs mt-1">Manage students, marks, quizzes, assignments</p>
        </button>
      </div>

      <p className="text-slate-600 text-xs mt-8">
        Admin accounts are assigned manually by the system administrator.
      </p>
    </div>
  );
};

export default Onboarding;