import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";

const StudentMarks = () => {
  const { user } = useUser();
  const [marks, setMarks] = useState([]);
  const email = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    if (!email) return;
    const q = query(collection(db, "marks"), where("studentEmail", "==", email));
    const unsub = onSnapshot(q, (snap) => {
      setMarks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [email]);

  return (
    <div>
      <h2 className="text-white text-xl font-semibold mb-6">My Marks</h2>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 text-left border-b border-white/10">
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Exam</th>
              <th className="px-4 py-3">Marks</th>
              <th className="px-4 py-3">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {marks.map((m) => (
              <tr key={m.id} className="border-b border-white/5 text-slate-300">
                <td className="px-4 py-3">{m.subject}</td>
                <td className="px-4 py-3">{m.examType || "-"}</td>
                <td className="px-4 py-3">{m.obtained} / {m.total}</td>
                <td className="px-4 py-3">
                  {m.total ? ((m.obtained / m.total) * 100).toFixed(1) : 0}%
                </td>
              </tr>
            ))}
            {marks.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                  No marks recorded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentMarks;