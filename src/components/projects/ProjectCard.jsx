import { motion } from "framer-motion";
import { CalendarDays, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProjectProgressBar from "@/components/projects/ProjectProgressBar";
import ProjectStatusBadge from "@/components/projects/ProjectStatusBadge";
import { formatDate } from "@/lib/utils";

export default function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Card className="border-border/70 bg-card/80 transition-transform hover:-translate-y-0.5">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <CardDescription>{project.description || "No description provided yet."}</CardDescription>
            </div>
            <ProjectStatusBadge status={project.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProjectProgressBar progress={project.progress} />

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {project.deadline ? formatDate(project.deadline) : "No deadline"}
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {project.assigned_team?.length || 0} members
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to={`/dashboard/projects/${project.id}`}>View details</Link>
            </Button>
            <Button size="sm" variant="outline" onClick={() => onEdit(project)}>
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(project)}>
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
