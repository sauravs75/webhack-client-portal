import { motion } from "framer-motion";
import { LayoutDashboard } from "lucide-react";

export function AuthLayout({ children, title, description }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left: brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-primary p-10 text-primary-foreground">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <LayoutDashboard className="h-6 w-6" />
          WebHack Solutions
        </div>
        <div className="space-y-3 max-w-md">
          <h2 className="text-3xl font-semibold leading-tight">
            Everything about your project, in one place.
          </h2>
          <p className="text-primary-foreground/80">
            Track progress, review files, chat with your team, and manage billing —
            all from your personal client portal.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/60">
          © {new Date().getFullYear()} WebHack Solutions. All rights reserved.
        </p>
      </div>

      {/* Right: form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-sm space-y-6"
        >
          <div className="space-y-1.5 text-center lg:text-left">
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
