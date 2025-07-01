import { useEffect, useState } from "react";
import { Container, Card, Button, Modal } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import esLocale from "@fullcalendar/core/locales/es";
import axios from "axios";
import { FaEye } from "react-icons/fa";

const Agenda = () => {
  const [events, setEvents] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const eventContent = (arg) => {
    if (arg.view.type !== "timeGridDay") return arg.event.title;
    const slot = arg.event.extendedProps?.slot || arg.event.title;

    return (
      <div
        className="d-flex justify-content-between align-items-center h-100 w-100"
        style={{
          height: "100%",
          borderRadius: "10px",
          background: "rgba(0,0,0,0.15)",
          padding: "0.25rem 0.5rem",
        }}
      >
        <span style={{ color: "#fff", fontSize: "1rem", fontWeight: 600 }}>
          {slot}
        </span>
        <Button
          variant="light"
          size="sm"
          className="d-flex align-items-center gap-2"
          style={{
            color: "#fff",
            borderColor: "#fff",
            background: "rgba(0,0,0,0.4)",
            fontWeight: 600,
            fontSize: "0.95rem",
            borderRadius: "10px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedEvent(arg.event);
          }}
        >
          <FaEye className="me-1" />
          Ver más
        </Button>
      </div>
    );
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const headerToolbar = isMobile
    ? {
        left: "prev,next today",
        center: "title",
        right: "timeGridWeek,timeGridDay",
      }
    : {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
      };

  const getEventDetails = (event) => {
    if (!event) return {};
    const start = event.start;
    const end = event.end;
    const detalle = event.extendedProps?.detalle || "";
    return {
      title: event.title,
      date: start ? start.toLocaleDateString() : "",
      time:
        start && end
          ? `${start.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })} - ${end.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`
          : "",
      detalle,
    };
  };

  const eventDetails = getEventDetails(selectedEvent);

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
            headerToolbar={headerToolbar}
            initialView={isMobile ? "timeGridDay" : "dayGridMonth"}
            events={events}
            locale={esLocale}
            themeSystem="bootstrap5"
            height="auto"
            allDaySlot={false}
            buttonText={{
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
              list: "Lista",
              prev: "<",
              next: ">",
            }}
            slotMinTime="08:00:00"
            slotMaxTime="18:00:00"
            eventContent={eventContent}
            eventClick={handleEventClick}
          />
        </Card.Body>
      </Card>

      <Modal show={!!selectedEvent} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{eventDetails.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Fecha:</strong> {eventDetails.date}
          </p>
          <p>
            <strong>Hora:</strong> {eventDetails.time}
          </p>
          <p>
            <strong>Detalle:</strong> {eventDetails.detalle}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Agenda;
