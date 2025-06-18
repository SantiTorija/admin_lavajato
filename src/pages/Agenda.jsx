import { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import esLocale from "@fullcalendar/core/locales/es";
import axios from "axios";

const Agenda = () => {
  const [events, setEvents] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchEvents = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/day/calendar-events`)
      .then((res) => {
        console.log("EVENTOS RECIBIDOS", res.data);
        setEvents(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchEvents();
  }, [refreshKey]);

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Agenda</h1>
        <Button
          variant="outline-primary"
          onClick={() => setRefreshKey((k) => k + 1)}
        >
          Refrescar
        </Button>
      </div>
      <Card>
        <Card.Body>
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,

              bootstrap5Plugin,
            ]}
            headerToolbar={{
              left: window.innerWidth < 768 ? "prev,next" : "prev,next today",
              center: "title",
              right:
                window.innerWidth < 768
                  ? "listWeek"
                  : "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            events={events}
            locale={esLocale}
            themeSystem="bootstrap5"
            height="auto"
            buttonText={{
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
              list: "Lista",
            }}
            slotMinTime="08:00:00"
            slotMaxTime="18:00:00"
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Agenda;
