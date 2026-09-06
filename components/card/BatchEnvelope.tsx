import type { Guest, WeddingInfo } from "@/lib/data";
import Envelope from "./Envelope";

interface BatchEnvelopeProps {
  wedding: WeddingInfo;
  guests: Guest[];
}

/**
 * Renders every guest's personalized envelope inside a container that is
 * hidden on screen (`display: none`) and only shown when printing in
 * envelope batch mode. Each envelope gets a unique id prefix so print CSS
 * targets the right frames.
 */
export default function BatchEnvelope({
  wedding,
  guests,
}: BatchEnvelopeProps) {
  return (
    <div className="batch-envelope">
      {guests.map((guest) => (
        <Envelope
          key={guest.id}
          wedding={wedding}
          guest={guest}
          idPrefix={`g${guest.id}`}
        />
      ))}
    </div>
  );
}