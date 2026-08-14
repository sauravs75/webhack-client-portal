import { Link } from "react-router-dom";
import { addDays, endOfMonth, format, isSameDay, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { CalendarDays } from "lucide-react";
import { MEETING_STATUS_LABELS } from "@/features/meetings/schemas";
import { cn } from "@/lib/utils";

function getDays(view) {   
  
  const today = startOfDay(new Date());
  if (view === "day") return [today];
  const start = view === "week" ? startOfWeek(today) : startOfWeek(startOfMonth(today));
  const count = view === "week" ? 7 : 42;
  return Array.from({ length: count }, (_, index) => addDays(start, index));
}

export default function MeetingCalendar({ meetings = [], view = "month" }) {
  const days = getDays(view);
  const monthEnd = endOfMonth(new Date());

  return (
    <div className="rounded-2xl border border-border/70 bg-card/80 p-3 shadow-sm sm:p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="min-w-0">
          <h3 className="font-semibold">Calendar</h3>
          <p className="text-sm text-muted-foreground">{format(new Date(), "MMMM yyyy")}</p>
        </div>
        <CalendarDays className="h-5 w-5 text-primary" />
      </div>

      <div className="overflow-x-auto pb-1">
        <div className={cn("grid min-w-[720px] gap-2", view === "day" ? "min-w-0 grid-cols-1" : "grid-cols-7")}>
          {view !== "day"
            ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="px-2 text-xs font-medium text-muted-foreground">{day}</div>
              ))
            : null}

          {days.map((day) => {
            const dayMeetings = meetings.filter((meeting) => isSameDay(new Date(meeting.scheduled_at), day));
            const muted = view === "month" && day > monthEnd;

            return (
              <div key={day.toISOString()} className={cn("min-h-28 rounded-xl border border-border/70 bg-background/60 p-2", muted && "opacity-50", view === "day" && "min-h-80")}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-medium">{format(day, view === "day" ? "EEEE, MMM d" : "d")}</span>
                  {isSameDay(day, new Date()) ? <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">Today</span> : null}
                </div>
                <div className="space-y-1">
                  {dayMeetings.map((meeting) => (
                    <Link key={meeting.id} to={`/dashboard/meetings/${meeting.id}`} className="block rounded-lg bg-primary/10 px-2 py-1 text-xs text-primary transition-colors hover:bg-primary/20">
                      <span className="block truncate font-medium">{format(new Date(meeting.scheduled_at), "p")} {meeting.title}</span>
                      <span className="block truncate text-[10px] text-primary/80">{MEETING_STATUS_LABELS[meeting.status] || "Upcoming"}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
