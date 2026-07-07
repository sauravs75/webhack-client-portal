import React, { useState } from "react";

export default function TaskComments({ taskId }) {
  const [list] = useState([]);
  return (
    <div className="rounded-lg border border-border/70 bg-card/80 p-4">
      <h3 className="text-sm font-medium">Comments</h3>
      <div className="mt-2 space-y-2">
        {list.length === 0 && <div className="text-sm text-muted-foreground">No comments yet.</div>}
      </div>
    </div>
  );
}
