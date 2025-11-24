import type { EventInput } from "@fullcalendar/core/index.js";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./Calendar.css";

export default function Calendar({ events }: { events: EventInput[] }) {
  const startDateDisplay = new Date();
  startDateDisplay.setDate(1);
  const endDateDisplay = new Date();
  endDateDisplay.setMonth((endDateDisplay.getMonth() + 2) % 12, 1);

  return (
    <FullCalendar
      plugins={[timeGridPlugin, dayGridPlugin]}
      initialView="timeGridWeek"
      locale="fr"
      height="auto"
      firstDay={1}
      expandRows={true}
      allDaySlot={false}
      slotMinTime="08:00:00"
      slotMaxTime="20:00:00"
      nowIndicator={true}
      validRange={{
        start: startDateDisplay.toISOString().split("T")[0],
        end: endDateDisplay.toISOString().split("T")[0],
      }}
      eventDisplay="block"
      displayEventEnd={true}
      eventTimeFormat={{
        hour: "numeric",
        minute: "2-digit",
      }}
      initialEvents={events}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek",
      }}
      buttonText={{
        today: "Aujourd'hui",
        month: "Mois",
        week: "Semaine",
        day: "Jour",
        list: "Liste",
      }}
      views={{
        dayGridMonth: {
          dayHeaderFormat: {
            weekday: "long",
          },
        },
        timeGridWeek: {
          titleFormat: { year: "numeric", month: "long", day: "numeric" },
          dayHeaderFormat: {
            weekday: "long",
            day: "numeric",
            month: "numeric",
            omitCommas: true,
          },
        },
      }}
    />
  );
}
