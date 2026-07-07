import React from "react";

const map = {
  low: { label: "Low", color: "bg-green-100 text-green-800" },
  medium: { label: "Medium", color: "bg-blue-100 text-blue-800" },
  high: { label: "High", color: "bg-yellow-100 text-yellow-800" },
  urgent: { label: "Urgent", color: "bg-red-100 text-red-800" },
};

export default function TaskPriorityBadge({ priority }) {
  const p = map[priority] || map.medium;
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.color}`}>{p.label}</span>;
}
