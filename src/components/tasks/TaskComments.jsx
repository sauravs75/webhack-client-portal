import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTask, createTaskComment } from "@/services/tasks";
import { Button } from "@/components/ui/button";

export default function TaskComments({ taskId }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["task", taskId], queryFn: () => getTask(taskId), enabled: Boolean(taskId) });
  const [content, setContent] = useState("");
  const create = useMutation({ mutationFn: ({ taskId, content }) => createTaskComment(taskId, content), onSuccess: async () => { await qc.invalidateQueries({ queryKey: ["task", taskId] }); setContent(""); } });

  const comments = data?.task_comments ?? [];

  return (
    <div className="rounded-lg border border-border/70 bg-card/80 p-4">
      <h3 className="text-sm font-medium">Comments</h3>

      <div className="mt-2 space-y-2">
        {isLoading && <div className="text-sm text-muted-foreground">Loading comments…</div>}
        {!isLoading && comments.length === 0 && <div className="text-sm text-muted-foreground">No comments yet.</div>}
        {!isLoading && comments.map((c) => (
          <div key={c.id} className="rounded-md border border-border/60 bg-background/60 p-2">
            <div className="text-sm">{c.content}</div>
            <div className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write a comment" className="flex-1 rounded-md border px-2 py-1" />
        <Button onClick={() => create.mutate({ taskId, content })} disabled={!content || create.isLoading}>Post</Button>
      </div>
    </div>
  );
}
