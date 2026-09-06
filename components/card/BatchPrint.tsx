import type { Guest, ScheduleItem, WeddingInfo } from "@/lib/data";
import InvitationCard from "./InvitationCard";

interface BatchPrintProps {
  wedding: WeddingInfo;
  guests: Guest[];
  schedule: ScheduleItem[];
}

/**
 * Renders every guest's personalized card inside a container that is hidden
 * on screen (`display: none`) and only shown when printing in batch mode.
 * Each card gets a unique id prefix so print CSS targets the right frames.
 */
export default function BatchPrint({
  wedding,
  guests,
  schedule,
}: BatchPrintProps) {
  return (
    <div className="batch-print">
      {guests.map((guest) => (
        <InvitationCard
          key={guest.id}
          wedding={wedding}
          schedule={schedule}
          guest={guest}
          idPrefix={`g${guest.id}`}
        />
      ))}
    </div>
  );
}