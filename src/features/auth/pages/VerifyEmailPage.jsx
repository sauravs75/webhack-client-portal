import { useState } from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifyEmailPage() {
  const location = useLocation();
  const { resendVerificationEmail } = useAuth();
  const email = location.state?.email;
  const [status, setStatus] = useState(""); // "sent" | "error" | ""
  const [isResending, setIsResending] = useState(false);

  // If someone lands here directly without an email in state, send them to signup
  if (!email) {
    return <Navigate to="/auth/signup" replace />;
  }

  const handleResend = async () => {
    setIsResending(true);
    setStatus("");
    const { error } = await resendVerificationEmail(email);
    setStatus(error ? "error" : "sent");
    setIsResending(false);
  };

  return (
    <AuthLayout title="Verify your email" description="One last step before you can sign in">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="rounded-full bg-primary/10 p-4">
          <MailCheck className="h-8 w-8 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground">
          We've sent a confirmation link to <strong className="text-foreground">{email}</strong>.
          Click the link in that email to activate your account.
        </p>

        {status === "sent" && <Alert variant="success">Verification email resent!</Alert>}
        {status === "error" && (
          <Alert variant="destructive">Couldn't resend the email. Please try again shortly.</Alert>
        )}

        <Button variant="outline" className="w-full" onClick={handleResend} isLoading={isResending}>
          Resend verification email
        </Button>

        <Link to="/auth/login" className="text-sm text-primary hover:underline">
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
