import { Routes, Route } from "react-router";

import Landing from "./pages/Landing.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import Onboarding from "./pages/Onboarding.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AppLayout from "./layout/AppLayout.jsx";

import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import StudentMarks from "./pages/student/StudentMarks.jsx";
import StudentQuizzes from "./pages/student/StudentQuizzes.jsx";
import StudentAssignments from "./pages/student/StudentAssignments.jsx";

import TeacherDashboard from "./pages/teacher/TeacherDashboard.jsx";
import ManageStudents from "./pages/teacher/ManageStudents.jsx";
import ManageMarks from "./pages/teacher/ManageMarks.jsx";
import ManageQuizzes from "./pages/teacher/ManageQuizzes.jsx";
import ManageAssignments from "./pages/teacher/ManageAssignments.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageTeachers from "./pages/admin/ManageTeachers.jsx";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* Student routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <AppLayout role="student">
              <StudentDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/marks"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <AppLayout role="student">
              <StudentMarks />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/quizzes"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <AppLayout role="student">
              <StudentQuizzes />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/assignments"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <AppLayout role="student">
              <StudentAssignments />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Teacher routes */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <AppLayout role="teacher">
              <TeacherDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/students"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <AppLayout role="teacher">
              <ManageStudents />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/marks"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <AppLayout role="teacher">
              <ManageMarks />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/quizzes"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <AppLayout role="teacher">
              <ManageQuizzes />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/assignments"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <AppLayout role="teacher">
              <ManageAssignments />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AppLayout role="admin">
              <AdminDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/teachers"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AppLayout role="admin">
              <ManageTeachers />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;