import React from "react";

export default function TaskTimeline({ events = [] }) {
  return (
    <div className="space-y-2">
      {events.map((ev) => (
        <div key={ev.id} className="rounded-md border border-border/60 bg-background/60 p-2 text-sm">
          <div className="font-medium">{ev.action}</div>
          <div className="text-xs text-muted-foreground">{ev.description}</div>
          <div className="text-xs text-muted-foreground">{new Date(ev.created_at).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
