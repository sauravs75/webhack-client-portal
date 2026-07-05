import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, CheckCircle2 } from "lucide-react";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { resetPasswordSchema } from "@/features/auth/schemas";
import { supabase } from "@/supabase/client";

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState(null); // null = checking

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  useEffect(() => {
    // Supabase exchanges the recovery token in the URL for a session
    // automatically via detectSessionInUrl. We just confirm one exists.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setValidSession(!!session);
    });
  }, []);

  const onSubmit = async (values) => {
    setServerError("");
    const { error } = await updatePassword(values.password);

    if (error) {
      setServerError(error.message);
      return;
    }
    setSuccess(true);
    setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
  };

  if (validSession === false) {
    return (
      <AuthLayout title="Link expired" description="This password reset link is invalid or has expired">
        <Alert variant="destructive">
          Please request a new password reset link and try again.
        </Alert>
        <Button className="w-full" onClick={() => navigate("/auth/forgot-password")}>
          Request new link
        </Button>
      </AuthLayout>
    );
  }

  if (success) {
    return (
      <AuthLayout title="Password updated" description="You're all set">
        <Alert variant="success">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Redirecting you to your dashboard...
          </span>
        </Alert>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set a new password" description="Choose a strong password for your account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError && <Alert variant="destructive">{serverError}</Alert>}

        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-9"
              {...register("password")}
            />
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="pl-9"
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Update password
        </Button>
      </form>
    </AuthLayout>
  );
}
