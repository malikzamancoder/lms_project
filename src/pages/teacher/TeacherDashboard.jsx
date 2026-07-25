import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  </div>
);

const TeacherDashboard = () => {
  const [counts, setCounts] = useState({ students: 0, quizzes: 0, assignments: 0, marks: 0 });

  useEffect(() => {
    const unsubs = [
      onSnapshot(collection(db, "students"), (s) =>
        setCounts((c) => ({ ...c, students: s.size }))
      ),
      onSnapshot(collection(db, "quizzes"), (s) =>
        setCounts((c) => ({ ...c, quizzes: s.size }))
      ),
      onSnapshot(collection(db, "assignments"), (s) =>
        setCounts((c) => ({ ...c, assignments: s.size }))
      ),
      onSnapshot(collection(db, "marks"), (s) => setCounts((c) => ({ ...c, marks: s.size }))),
    ];
    return () => unsubs.forEach((u) => u());
  }, []);

  return (
    <div>
      <h2 className="text-white text-xl font-semibold mb-6">Teacher Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={counts.students} icon="🎓" />
        <StatCard label="Quizzes Created" value={counts.quizzes} icon="❓" />
        <StatCard label="Assignments" value={counts.assignments} icon="📝" />
        <StatCard label="Marks Entries" value={counts.marks} icon="📊" />
      </div>
    </div>
  );
};

export default TeacherDashboard;