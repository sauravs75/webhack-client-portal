import React from "react";

export default function TaskEmptyState() {
  return (
    <div className="rounded-lg border border-border/70 bg-card/80 p-6 text-center">
      <h3 className="text-lg font-semibold">No tasks yet</h3>
      <p className="text-sm text-muted-foreground">Create your first task to get started.</p>
    </div>
  );
}
