import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProjectSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <Card key={item} className="animate-pulse border-border/70 bg-card/80">
          <CardHeader className="space-y-3">
            <div className="h-4 w-24 rounded-full bg-muted" />
            <div className="h-6 w-40 rounded bg-muted" />
            <div className="h-4 w-3/4 rounded bg-muted" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-2 rounded-full bg-muted" />
            <div className="h-2 w-2/3 rounded-full bg-muted" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
