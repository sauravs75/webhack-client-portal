export default function DocumentSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-32 animate-pulse rounded-3xl bg-muted" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}
