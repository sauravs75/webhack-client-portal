import React from "react";
import TaskCard from "./TaskCard";

export default function TaskColumn({ column, tasks = [], onDrop }) {
  const allowDrop = (e) => e.preventDefault();
  const handleDrop = (e) => { e.preventDefault(); onDrop(e, column.key); };

  return (
    <div className="min-h-[200px] rounded-lg border border-border/70 bg-card/80 p-3" onDragOver={allowDrop} onDrop={handleDrop}>
      <h4 className="mb-2 text-sm font-medium">{column.title} ({tasks.length})</h4>
      <div className="space-y-2">
        {tasks.map((t) => (
          <div key={t.id} draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", t.id)}>
            <TaskCard task={t} />
          </div>
        ))}
      </div>
    </div>
  );
}
