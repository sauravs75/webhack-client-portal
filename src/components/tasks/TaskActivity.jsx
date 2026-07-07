import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getActivityLogs } from "@/services/projects";

export default function TaskActivity({ taskId }) {
  const { data } = useQuery({ queryKey: ["activityLogs", taskId], queryFn: () => getActivityLogs(10) });
  const items = data ?? [];
  return (
    <div className="rounded-lg border border-border/70 bg-card/80 p-4">
      <h3 className="text-sm font-medium">Recent activity</h3>
      <div className="mt-2 space-y-2">
        {items.map((it) => (
          <div key={it.id} className="text-sm">{it.description}</div>
        ))}
      </div>
    </div>
  );
}
