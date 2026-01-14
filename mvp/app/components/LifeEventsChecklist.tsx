"use client";

import { useState, ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface LifeEventsChecklistProps {
  estatePlanId: Id<"estatePlans">;
}

type LifeEventType =
  | "marriage"
  | "divorce"
  | "birth"
  | "death"
  | "major_asset_change"
  | "relocation"
  | "retirement"
  | "business_change"
  | "health_change"
  | "other";

interface LifeEventOption {
  type: LifeEventType;
  title: string;
  description: string;
  documentsAffected: string[];
  icon: ReactNode;
  color: string;
}

const LIFE_EVENT_OPTIONS: LifeEventOption[] = [
  {
    type: "marriage",
    title: "Marriage",
    description: "Update beneficiaries, powers of attorney, and healthcare directives",
    documentsAffected: ["will", "trust", "poa_financial", "poa_healthcare", "healthcare_directive"],
    color: "from-pink-500 to-rose-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    type: "divorce",
    title: "Divorce",
    description: "Remove former spouse from all documents and beneficiary designations",
    documentsAffected: ["will", "trust", "poa_financial", "poa_healthcare", "healthcare_directive"],
    color: "from-gray-500 to-slate-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
  },
  {
    type: "birth",
    title: "Birth or Adoption of Child",
    description: "Add child to will, consider guardianship, update trust provisions",
    documentsAffected: ["will", "trust"],
    color: "from-blue-500 to-cyan-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    type: "death",
    title: "Death of Family Member",
    description: "Update beneficiaries, consider new heirs, review executor choices",
    documentsAffected: ["will", "trust", "poa_financial", "poa_healthcare"],
    color: "from-indigo-500 to-purple-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    type: "major_asset_change",
    title: "Major Asset Change",
    description: "Acquired or sold significant property, inheritance, or major purchase",
    documentsAffected: ["will", "trust"],
    color: "from-emerald-500 to-green-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    type: "relocation",
    title: "Moved to New State",
    description: "Review state-specific requirements and document validity",
    documentsAffected: ["will", "trust", "poa_financial", "poa_healthcare", "healthcare_directive"],
    color: "from-orange-500 to-amber-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    type: "retirement",
    title: "Retirement",
    description: "Update beneficiaries on retirement accounts, review income sources",
    documentsAffected: ["will", "trust"],
    color: "from-yellow-500 to-orange-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    type: "business_change",
    title: "Business Change",
    description: "Started, sold, or significant change in business ownership",
    documentsAffected: ["will", "trust"],
    color: "from-violet-500 to-purple-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    type: "health_change",
    title: "Significant Health Change",
    description: "Major diagnosis that may affect care preferences or capacity",
    documentsAffected: ["poa_healthcare", "healthcare_directive", "poa_financial"],
    color: "from-red-500 to-rose-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    type: "other",
    title: "Other Major Event",
    description: "Any other significant life change that may require plan updates",
    documentsAffected: [],
    color: "from-gray-500 to-slate-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export function LifeEventsChecklist({ estatePlanId }: LifeEventsChecklistProps) {
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<LifeEventOption | null>(null);
  const [eventDetails, setEventDetails] = useState({
    title: "",
    description: "",
    eventDate: new Date().toISOString().split("T")[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lifeEvents = useQuery(api.reminders.getLifeEvents, { estatePlanId });
  const logLifeEvent = useMutation(api.reminders.logLifeEvent);
  const markEventAddressed = useMutation(api.reminders.markEventAddressed);

  const handleSelectEvent = (event: LifeEventOption) => {
    setSelectedEvent(event);
    setEventDetails({
      ...eventDetails,
      title: `${event.title}`,
    });
    setShowEventForm(true);
  };

  const handleSubmitEvent = async () => {
    if (!selectedEvent || !eventDetails.title) return;

    setIsSubmitting(true);
    try {
      await logLifeEvent({
        estatePlanId,
        eventType: selectedEvent.type,
        title: eventDetails.title,
        description: eventDetails.description || undefined,
        eventDate: new Date(eventDetails.eventDate).getTime(),
        requiresDocumentUpdate: selectedEvent.documentsAffected.length > 0,
        documentsAffected: selectedEvent.documentsAffected,
      });

      setShowEventForm(false);
      setSelectedEvent(null);
      setEventDetails({
        title: "",
        description: "",
        eventDate: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Failed to log life event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAddressed = async (eventId: Id<"lifeEvents">) => {
    await markEventAddressed({ eventId });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Life Events Checklist
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Major life events often require updates to your estate plan. Log any changes to receive guidance on what documents to update.
        </p>
      </div>

      {/* Recent life events */}
      {lifeEvents && lifeEvents.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Recent Events
          </h4>
          {lifeEvents.slice(0, 5).map((event) => {
            const eventOption = LIFE_EVENT_OPTIONS.find(e => e.type === event.eventType);
            return (
              <div
                key={event._id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  event.planUpdated
                    ? "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                    : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                }`}
              >
                <div className={`p-2 rounded-lg bg-gradient-to-br ${eventOption?.color || "from-gray-500 to-slate-500"} text-white`}>
                  {eventOption?.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(event.eventDate).toLocaleDateString()}
                    {event.requiresDocumentUpdate && !event.planUpdated && (
                      <span className="ml-2 text-yellow-600 dark:text-yellow-400">
                        Needs update
                      </span>
                    )}
                  </p>
                </div>
                {event.requiresDocumentUpdate && !event.planUpdated && (
                  <button
                    onClick={() => handleMarkAddressed(event._id)}
                    className="px-3 py-1.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                  >
                    Mark Updated
                  </button>
                )}
                {event.planUpdated && (
                  <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Updated
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Event type selection */}
      {!showEventForm && (
        <>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Log a New Life Event
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {LIFE_EVENT_OPTIONS.map((event) => (
              <button
                key={event.type}
                onClick={() => handleSelectEvent(event)}
                className="group flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all"
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br ${event.color} text-white group-hover:scale-110 transition-transform`}>
                  {event.icon}
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
                  {event.title}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Event details form */}
      {showEventForm && selectedEvent && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 space-y-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedEvent.color} text-white`}>
              {selectedEvent.icon}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {selectedEvent.title}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedEvent.description}
              </p>
            </div>
          </div>

          {selectedEvent.documentsAffected.length > 0 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Documents to review:</strong>{" "}
                {selectedEvent.documentsAffected
                  .map((d) =>
                    d.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
                  )
                  .join(", ")}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Title
              </label>
              <input
                type="text"
                value={eventDetails.title}
                onChange={(e) => setEventDetails({ ...eventDetails, title: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Marriage to Jane"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Date
              </label>
              <input
                type="date"
                value={eventDetails.eventDate}
                onChange={(e) => setEventDetails({ ...eventDetails, eventDate: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={eventDetails.description}
                onChange={(e) => setEventDetails({ ...eventDetails, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Add any relevant details..."
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmitEvent}
              disabled={isSubmitting || !eventDetails.title}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? "Logging..." : "Log Event"}
            </button>
            <button
              onClick={() => {
                setShowEventForm(false);
                setSelectedEvent(null);
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LifeEventsChecklist;
