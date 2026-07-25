import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase/config";

const ManageMarks = () => {
  const { user } = useUser();
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [form, setForm] = useState({
    studentEmail: "",
    subject: "",
    examType: "",
    obtained: "",
    total: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "students"), (snap) => {
      setStudents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    const q = query(collection(db, "marks"), orderBy("createdAt", "desc"));
    const unsub2 = onSnapshot(q, (snap) => {
      setMarks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.studentEmail || !form.subject || !form.obtained || !form.total) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "marks"), {
        ...form,
        obtained: Number(form.obtained),
        total: Number(form.total),
        teacherId: user.id,
        createdAt: new Date().toISOString(),
      });
      setForm({ studentEmail: "", subject: "", examType: "", obtained: "", total: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "marks", id));
  };

  return (
    <div>
      <h2 className="text-white text-xl font-semibold mb-6">Manage Marks</h2>

      <form
        onSubmit={handleAdd}
        className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6 flex flex-wrap gap-3"
      >
        <select
          value={form.studentEmail}
          onChange={(e) => setForm({ ...form, studentEmail: e.target.value })}
          className="flex-1 min-w-[180px] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
        >
          <option value="" className="bg-slate-900">Select Student</option>
          {students.map((s) => (
            <option key={s.id} value={s.email} className="bg-slate-900">
              {s.name} ({s.email})
            </option>
          ))}
        </select>
        <input
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="flex-1 min-w-[120px] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500"
        />
        <input
          placeholder="Exam Type (e.g. Midterm)"
          value={form.examType}
          onChange={(e) => setForm({ ...form, examType: e.target.value })}
          className="flex-1 min-w-[140px] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500"
        />
        <input
          placeholder="Obtained"
          type="number"
          value={form.obtained}
          onChange={(e) => setForm({ ...form, obtained: e.target.value })}
          className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500"
        />
        <input
          placeholder="Total"
          type="number"
          value={form.total}
          onChange={(e) => setForm({ ...form, total: e.target.value })}
          className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500"
        />
        <button
          disabled={saving}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          Add Marks
        </button>
      </form>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 text-left border-b border-white/10">
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Exam</th>
              <th className="px-4 py-3">Marks</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {marks.map((m) => (
              <tr key={m.id} className="border-b border-white/5 text-slate-300">
                <td className="px-4 py-3">{m.studentEmail}</td>
                <td className="px-4 py-3">{m.subject}</td>
                <td className="px-4 py-3">{m.examType || "-"}</td>
                <td className="px-4 py-3">{m.obtained} / {m.total}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {marks.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  No marks added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageMarks;