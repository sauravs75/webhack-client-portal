import React from "react";

export default function TaskFilters({ onChange }) {
  return (
    <div className="flex items-center gap-2">
      <select onChange={(e) => onChange?.({ status: e.target.value })} className="rounded-md border px-2 py-1">
        <option value="all">All statuses</option>
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="in_review">In Review</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
}
