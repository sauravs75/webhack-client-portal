import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import VerifyEmailPage from "@/features/auth/pages/VerifyEmailPage";
import { ProtectedRoute, PublicOnlyRoute } from "@/features/auth/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardPage from "@/pages/DashboardPage";
import DocumentsPage from "@/pages/documents/DocumentsPage";
import DocumentDetailsPage from "@/pages/documents/DocumentDetailsPage";
import MeetingsPage from "@/pages/meetings/MeetingsPage";
import MeetingDetailsPage from "@/pages/meetings/MeetingDetailsPage";
import TasksListPage from "@/pages/tasks/TasksListPage";
import TaskDetailsPage from "@/pages/tasks/TaskDetailsPage";
import ProjectsListPage from "@/pages/projects/ProjectsListPage";
import ProjectDetailsPage from "@/pages/projects/ProjectDetailsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public-only auth routes — redirect to /dashboard if already logged in */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* These two must be reachable even while "authenticated" via a
          temporary recovery/verification session, so they sit outside
          PublicOnlyRoute */}
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/verify-email" element={<VerifyEmailPage />} />

      {/* Protected app routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/projects" element={<ProjectsListPage />} />
          <Route path="/dashboard/projects/:id" element={<ProjectDetailsPage />} />
          <Route path="/dashboard/tasks" element={<TasksListPage />} />
          <Route path="/dashboard/tasks/:id" element={<TaskDetailsPage />} />
          <Route path="/dashboard/documents" element={<DocumentsPage />} />
          <Route path="/dashboard/documents/:id" element={<DocumentDetailsPage />} />
          <Route path="/dashboard/meetings" element={<MeetingsPage />} />
          <Route path="/dashboard/meetings/:id" element={<MeetingDetailsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
