import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "@/supabase/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error) setProfile(data);
  }, []);

  useEffect(() => {
    // Load the initial session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // ---- Email / Password Signup ----
  const signUp = async ({ email, password, fullName }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/verify-email`,
      },
    });
    return { data, error };
  };

  // ---- Email / Password Login ----
  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  // ---- Logout ----
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  // ---- Forgot Password: sends reset email ----
  const sendPasswordReset = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { data, error };
  };

  // ---- Reset Password: sets new password after clicking email link ----
  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    return { data, error };
  };

  // ---- Resend verification email ----
  const resendVerificationEmail = async (email) => {
    const { data, error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/verify-email` },
    });
    return { data, error };
  };

  const refreshProfile = () => fetchProfile(user?.id);

  const value = {
    session,
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isEmailVerified: !!user?.email_confirmed_at,
    signUp,
    signIn,
    signOut,
    sendPasswordReset,
    updatePassword,
    resendVerificationEmail,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
