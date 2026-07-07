import React from "react";

const map = {
  todo: { label: "Todo", color: "bg-gray-200 text-gray-800" },
  in_progress: { label: "In Progress", color: "bg-yellow-100 text-yellow-800" },
  in_review: { label: "In Review", color: "bg-blue-100 text-blue-800" },
  done: { label: "Done", color: "bg-green-100 text-green-800" },
};

export default function TaskStatusBadge({ status }) {
  const s = map[status] || map.todo;
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.color}`}>{s.label}</span>;
}
