import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MeetingEmptyState({ onAction }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/60 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <CalendarPlus className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No meetings found</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">Scheduled project calls and check-ins will appear here.</p>
      <Button className="mt-5" onClick={onAction}>
        <CalendarPlus className="h-4 w-4" />
        Create meeting
      </Button>
    </div>
  );
}

