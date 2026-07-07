import React from "react";

export default function TaskSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-6 w-1/3 rounded bg-border/30" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded bg-border/20" />
        ))}
      </div>
    </div>
  );
}
