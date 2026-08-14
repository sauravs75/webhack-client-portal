import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { LayoutGrid, FolderKanban, CheckSquare, FileText, CalendarDays, Moon, Sun, LogOut, Menu, Sparkles, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutGrid },
  { to: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { to: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/dashboard/documents", label: "Documents", icon: FileText },
  { to: "/dashboard/meetings", label: "Meetings", icon: CalendarDays },
];

export default function DashboardLayout() {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "there";

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 text-foreground transition-colors dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 border-r border-border/80 bg-background/95 backdrop-blur-xl transition-transform duration-200 ease-out lg:static lg:translate-x-0",
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col p-6">
            <div className="flex items-center justify-between">
              <Link to="/dashboard" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">WebHack Portal</p>
                  <p className="text-xs text-muted-foreground">Client workspace</p>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <nav className="mt-8 space-y-2">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/dashboard"}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
              <p className="text-sm font-semibold">Welcome back</p>
              <p className="mt-1 text-sm text-muted-foreground">{displayName}</p>
              <Button variant="outline" className="mt-4 w-full justify-start" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </aside>

        {mobileSidebarOpen && <div className="fixed inset-0 z-30 bg-background/70 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />}

        <div className="flex-1">
          <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setMobileSidebarOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <div>
                  <p className="text-sm text-muted-foreground">Good day</p>
                  <h1 className="text-lg font-semibold">{displayName}</h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={toggleTheme}>
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
