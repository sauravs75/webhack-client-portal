import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import VerifyEmailPage from "@/features/auth/pages/VerifyEmailPage";
import { ProtectedRoute, PublicOnlyRoute } from "@/features/auth/ProtectedRoute";
import DashboardPlaceholderPage from "@/pages/DashboardPlaceholderPage";

// NOTE: Dashboard/Projects/Tasks/etc. routes will be nested under the
// ProtectedRoute below, module by module, replacing DashboardPlaceholderPage.
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
        <Route path="/dashboard" element={<DashboardPlaceholderPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
