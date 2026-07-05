import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

// NOTE: This is a temporary placeholder so protected routes have somewhere
// to land. It will be replaced by the full Dashboard Layout + Home in Module 4.
export default function DashboardPlaceholderPage() {
  const { user, profile, signOut } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-2xl font-semibold text-foreground">
          Welcome, {profile?.full_name || user?.email}
        </h1>
        <p className="text-muted-foreground">
          Authentication is working. The full dashboard with projects, tasks, and
          more will be built in the next module.
        </p>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}
