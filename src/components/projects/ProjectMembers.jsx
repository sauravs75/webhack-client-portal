import { Users } from "lucide-react";

export default function ProjectMembers({ members = [] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Users className="h-4 w-4 text-primary" />
        Assigned team
      </div>
      <div className="flex flex-wrap gap-2">
        {members.length ? (
          members.map((member, index) => (
            <div key={`${member.name}-${index}`} className="rounded-full border border-border/70 bg-background/70 px-3 py-2 text-sm">
              <span className="font-medium">{member.name}</span>
              {member.role ? <span className="ml-2 text-muted-foreground">• {member.role}</span> : null}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No team members assigned yet.</p>
        )}
      </div>
    </div>
  );
}
