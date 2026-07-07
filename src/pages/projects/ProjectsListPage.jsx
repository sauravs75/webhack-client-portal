import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useProjects } from "@/hooks/useProjects";
import { useDeleteProject } from "@/hooks/useProjects";
import ProjectHeader from "@/components/projects/ProjectHeader";
import ProjectSearch from "@/components/projects/ProjectSearch";
import ProjectFilters from "@/components/projects/ProjectFilters";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectTable from "@/components/projects/ProjectTable";
import ProjectEmptyState from "@/components/projects/ProjectEmptyState";
import ProjectSkeleton from "@/components/projects/ProjectSkeleton";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import CreateProjectDialog from "@/features/projects/components/CreateProjectDialog";
import EditProjectDialog from "@/features/projects/components/EditProjectDialog";
import DeleteProjectDialog from "@/features/projects/components/DeleteProjectDialog";

export default function ProjectsListPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("updated_desc");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [deleteProjectTarget, setDeleteProjectTarget] = useState(null);

  const { data: projects = [], isLoading, isError, error } = useProjects({ search, status, sortBy });
  const deleteProject = useDeleteProject();

  const visibleProjects = useMemo(() => projects, [projects]);

  const handleDelete = async () => {
    if (!deleteProjectTarget?.id) return;
    await deleteProject.mutateAsync(deleteProjectTarget.id);
    setDeleteProjectTarget(null);
  };

  return (
    <div className="space-y-6">
      <ProjectHeader
        title="Project portfolio"
        description="Track project health, deadlines, and delivery progress in real time."
        onCreate={() => setIsCreateOpen(true)}
      />

      <div className="rounded-3xl border border-border/70 bg-background/70 p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <ProjectSearch value={search} onChange={setSearch} />
          <ProjectFilters status={status} onStatusChange={setStatus} sortBy={sortBy} onSortChange={setSortBy} />
        </div>

        {isError ? (
          <Alert variant="destructive" className="mt-4">
            {error?.message || "Unable to load projects right now."}
          </Alert>
        ) : null}

        {isLoading ? (
          <ProjectSkeleton />
        ) : visibleProjects.length === 0 ? (
          <div className="mt-6">
            <ProjectEmptyState
              title="No projects found"
              description="Create your first project to start tracking the work ahead."
              actionLabel="Create project"
              onAction={() => setIsCreateOpen(true)}
            />
          </div>
        ) : (
          <>
            <div className="mt-6">
              <ProjectTable projects={visibleProjects} onEdit={setSelectedProject} onDelete={setDeleteProjectTarget} />
            </div>

            <div className="mt-6 flex items-center justify-end">
              <Button variant="outline" size="sm" onClick={() => setSearch("")}>
                Clear filters
              </Button>
            </div>
          </>
        )}
      </div>

      <CreateProjectDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <EditProjectDialog project={selectedProject} onOpenChange={() => setSelectedProject(null)} />
      <DeleteProjectDialog
        project={deleteProjectTarget}
        open={Boolean(deleteProjectTarget)}
        onOpenChange={() => setDeleteProjectTarget(null)}
        onConfirm={handleDelete}
        isDeleting={deleteProject.isPending}
      />
    </div>
  );
}
