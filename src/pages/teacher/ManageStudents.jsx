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

const ManageStudents = () => {
  const { user } = useUser();
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", className: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "students"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setStudents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "students"), {
        ...form,
        addedBy: user.id,
        createdAt: new Date().toISOString(),
      });
      setForm({ name: "", email: "", className: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "students", id));
  };

  return (
    <div>
      <h2 className="text-white text-xl font-semibold mb-6">Manage Students</h2>

      <form
        onSubmit={handleAdd}
        className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6 flex flex-col sm:flex-row gap-3"
      >
        <input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500"
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500"
        />
        <input
          placeholder="Class / Section"
          value={form.className}
          onChange={(e) => setForm({ ...form, className: e.target.value })}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500"
        />
        <button
          disabled={saving}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          Add Student
        </button>
      </form>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 text-left border-b border-white/10">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b border-white/5 text-slate-300">
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3">{s.email}</td>
                <td className="px-4 py-3">{s.className || "-"}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-red-400 hover:text-red-300 text-xs"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                  No students added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStudents;