import { MEETING_STATUS_LABELS } from "@/features/meetings/schemas";
import { useProjects } from "@/hooks/useProjects";

export default function MeetingFilters({ status = "all", projectId = "all", sortBy = "date_asc", view = "month", onChange }) {
  const { data: projects = [] } = useProjects();

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <select value={status} onChange={(event) => onChange?.({ status: event.target.value, page: 1 })} className="flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm">
        <option value="all">All statuses</option>
        {Object.entries(MEETING_STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <select value={projectId} onChange={(event) => onChange?.({ projectId: event.target.value, page: 1 })} className="flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm">
        <option value="all">All projects</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>{project.name}</option>
        ))}
      </select>

      <select value={sortBy} onChange={(event) => onChange?.({ sortBy: event.target.value, page: 1 })} className="flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm">
        <option value="date_asc">Soonest first</option>
        <option value="date_desc">Latest first</option>
      </select>

      <select value={view} onChange={(event) => onChange?.({ view: event.target.value })} className="flex h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm">
        <option value="month">Month view</option>
        <option value="week">Week view</option>
        <option value="day">Day view</option>
      </select>
    </div>
  );
}
