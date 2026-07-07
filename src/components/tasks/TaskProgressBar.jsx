import React from "react";

export default function TaskProgressBar({ value = 0 }) {
  return (
    <div className="w-full rounded-full bg-border/30 h-2">
      <div style={{ width: `${Math.max(0, Math.min(100, value))}%` }} className="h-2 rounded-full bg-primary" />
    </div>
  );
}
