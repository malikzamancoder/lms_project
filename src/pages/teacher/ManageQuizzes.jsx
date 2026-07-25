import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase/config";

const ManageQuizzes = () => {
  const { user } = useUser();
  const [quizzes, setQuizzes] = useState([]);
  const [form, setForm] = useState({ title: "", subject: "", totalMarks: "", dueDate: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "quizzes"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setQuizzes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title || !form.subject) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "quizzes"), {
        ...form,
        totalMarks: Number(form.totalMarks) || 0,
        enabled: false,
        teacherId: user.id,
        createdAt: new Date().toISOString(),
      });
      setForm({ title: "", subject: "", totalMarks: "", dueDate: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const toggleEnabled = async (quizId, current) => {
    await updateDoc(doc(db, "quizzes", quizId), { enabled: !current });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "quizzes", id));
  };

  return (
    <div>
      <h2 className="text-white text-xl font-semibold mb-6">Manage Quizzes</h2>

      <form
        onSubmit={handleAdd}
        className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6 flex flex-wrap gap-3"
      >
        <input
          placeholder="Quiz Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="flex-1 min-w-[160px] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500"
        />
        <input
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="flex-1 min-w-[120px] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500"
        />
        <input
          placeholder="Total Marks"
          type="number"
          value={form.totalMarks}
          onChange={(e) => setForm({ ...form, totalMarks: e.target.value })}
          className="w-32 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500"
        />
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
        />
        <button
          disabled={saving}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          Create Quiz
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quizzes.map((q) => (
          <div key={q.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-white font-medium">{q.title}</h3>
                <p className="text-slate-400 text-xs">{q.subject} • {q.totalMarks} marks</p>
                {q.dueDate && <p className="text-slate-500 text-xs">Due: {q.dueDate}</p>}
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  q.enabled ? "bg-green-500/20 text-green-400" : "bg-slate-500/20 text-slate-400"
                }`}
              >
                {q.enabled ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => toggleEnabled(q.id, q.enabled)}
                className="flex-1 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-lg text-xs font-medium transition"
              >
                {q.enabled ? "Disable" : "Enable"}
              </button>
              <button
                onClick={() => handleDelete(q.id)}
                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {quizzes.length === 0 && (
          <p className="text-slate-500 text-sm col-span-2 text-center py-6">No quizzes created yet</p>
        )}
      </div>
    </div>
  );
};

export default ManageQuizzes;