import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "assignments"), where("enabled", "==", true));
    const unsub = onSnapshot(q, (snap) => {
      setAssignments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div>
      <h2 className="text-white text-xl font-semibold mb-6">Available Assignments</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {assignments.map((q) => (
          <div key={q.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-white font-medium">{q.title}</h3>
            <p className="text-slate-400 text-xs mt-1">{q.subject} • {q.totalMarks} marks</p>
            {q.dueDate && <p className="text-slate-500 text-xs mt-1">Due: {q.dueDate}</p>}
            <button className="mt-3 w-full px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition">
              View Assignment
            </button>
          </div>
        ))}
        {assignments.length === 0 && (
          <p className="text-slate-500 text-sm col-span-2 text-center py-6">
            No assignments available right now
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentAssignments;