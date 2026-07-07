import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { updateTask } from "@/services/tasks";
import TaskColumn from "./TaskColumn";

const columns = [
  { key: "todo", title: "Todo" },
  { key: "in_progress", title: "In Progress" },
  { key: "in_review", title: "In Review" },
  { key: "done", title: "Done" },
];

export default function TaskKanbanBoard({ tasks = [] }) {
  const qc = useQueryClient();
  const grouped = columns.reduce((acc, col) => ({ ...acc, [col.key]: [] }), {});
  tasks.forEach((t) => grouped[t.status || "todo" ]?.push(t));

  const onDrop = async (e, status) => {
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    try {
      await updateTask(id, { status });
      await qc.invalidateQueries({ queryKey: ["tasks"] });
      await qc.invalidateQueries({ queryKey: ["task", id] });
    } catch (err) {
      console.error("Failed updating task status", err);
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {columns.map((col) => (
        <TaskColumn key={col.key} column={col} tasks={grouped[col.key] || []} onDrop={onDrop} />
      ))}
    </div>
  );
}
