import { Link } from "react-router-dom";
import type { DdayEvent } from "@/services/ddayService";
import { useDayCount } from "@/hooks/useDayCount";
import { DEFAULT_COLOR } from "@/constants/colors";
import { TEXT } from "@/constants/text";

interface Props {
  event: DdayEvent;
}

export default function EventCard({ event }: Props) {
  const { days, label } = useDayCount(event.target_date);
  const color = event.color ?? DEFAULT_COLOR;

  const sublabel =
    days === 0
      ? TEXT.EVENT_TODAY
      : days > 0
      ? `${days} ${TEXT.EVENT_DAYS_LEFT}`
      : `${Math.abs(days)} ${TEXT.EVENT_DAYS_AGO}`;

  return (
    <Link
      to={`/event/${event.id}`}
      className="block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
    >
      <div className="h-1.5 w-full" style={{ backgroundColor: color }} />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-[#000000] truncate">
              {event.title}
            </h3>
            <p className="text-sm text-[#555555] mt-1">
              {new Date(event.target_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              })}
            </p>
            {event.note && (
              <p className="text-sm text-[#555555] mt-2 line-clamp-2">
                {event.note}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 text-right">
            <p
              className="text-4xl font-bold font-mono tracking-tight"
              style={{ color }}
            >
              {label}
            </p>
            <p className="text-xs text-[#555555] mt-1">{sublabel}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
