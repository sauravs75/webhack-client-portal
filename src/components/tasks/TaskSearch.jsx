import React, { useState } from "react";

export default function TaskSearch({ onSearch }) {
  const [q, setQ] = useState("");
  return (
    <div className="flex items-center gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search tasks..."
        className="rounded-md border px-2 py-1"
      />
      <button className="rounded-md bg-primary px-3 py-1 text-white" onClick={() => onSearch?.(q)}>
        Search
      </button>
    </div>
  );
}
