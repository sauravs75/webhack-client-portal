import { DOCUMENT_CATEGORY_LABELS } from "@/features/documents/schemas";
import { useProjects } from "@/hooks/useProjects";

export default function DocumentFilters({ category = "all", projectId = "all", sortBy = "uploaded_desc", onChange }) {
  const { data: projects = [] } = useProjects();

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <select
        value={category}
        onChange={(event) => onChange?.({ category: event.target.value, page: 1 })}
        className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="all">All categories</option>
        {Object.entries(DOCUMENT_CATEGORY_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={projectId}
        onChange={(event) => onChange?.({ projectId: event.target.value, page: 1 })}
        className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="all">All projects</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(event) => onChange?.({ sortBy: event.target.value, page: 1 })}
        className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="uploaded_desc">Newest first</option>
        <option value="uploaded_asc">Oldest first</option>
      </select>
    </div>
  );
}
