export default function MeetingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-32 animate-pulse rounded-3xl bg-muted" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-40 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}

