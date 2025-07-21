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
import useMarkSlotUnavailable from "../hooks/useMarkSlotUnavailable";
import useMarkSlotAvailable from "../hooks/useMarkSlotAvailable";

// Definir los slots disponibles
const availableSlots = [
  { start: "08:30", end: "10:30" },
  { start: "10:30", end: "12:30" },
  { start: "14:00", end: "16:00" },
  { start: "16:00", end: "18:00" },
];

const Agenda = () => {
  const [events, setEvents] = useState([]);
  const [daysAvailability, setDaysAvailability] = useState([]); // Nuevo estado
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFreeSlotModal, setShowFreeSlotModal] = useState(false);
  const [selectedFreeSlot, setSelectedFreeSlot] = useState(null);
  const [showAdminSlotModal, setShowAdminSlotModal] = useState(false);
  const [selectedAdminSlot, setSelectedAdminSlot] = useState(null);
  const { markSlot } = useMarkSlotUnavailable();
  const { markSlotAvailable } = useMarkSlotAvailable();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Obtener disponibilidad del mes
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    axios
      .get(`${import.meta.env.VITE_API_URL}/day/availability/${year}/${month}`)
      .then((res) => {
        setDaysAvailability(res.data);
        console.log("DAYS AVAILABILITY:", res.data);
      })
      .catch((err) => console.error(err));
  }, [refreshKey]);

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

  const formatTime = (start, end) => {
    if (!start || !end) return "";
    const startTime = new Date(start).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTime = new Date(end).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${startTime} - ${endTime}`;
  };

  const eventContent = (arg) => {
    const timeDisplay = formatTime(arg.event.start, arg.event.end);

    // Determinar el tipo de evento y sus colores
    let backgroundColor = "#0097a7"; // Azul por defecto (eventos de clientes)
    let borderColor = "#007c91";

    if (arg.event.extendedProps?.admin_created) {
      // Rojo para eventos reservados por admin
      backgroundColor = "#dc3545";
      borderColor = "#c82333";
    } else if (arg.event.extendedProps?.freeSlot) {
      // Verde para slots libres
      backgroundColor = "#28a745";
      borderColor = "#1e7e34";
    }

    // Vista mensual personalizada
    if (arg.view.type === "dayGridMonth") {
      return (
        <button
          type="button"
          style={{
            width: "100%",
            height: "100%",
            background: backgroundColor,
            color: "#fff",
            borderRadius: "6px",
            border: `1px solid ${borderColor}`,
            padding: "4px 0",
            fontWeight: 600,
            fontSize: "0.95rem",
            marginBottom: "2px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            cursor: "pointer",
            transition: "background 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
          // onClick eliminado, ahora se maneja en eventClick
        >
          {arg.event.title}
          <br />
          <small style={{ fontSize: "0.8rem", opacity: 0.9 }}>
            {timeDisplay}
          </small>
        </button>
      );
    }

    // Vista semanal personalizada
    if (arg.view.type === "timeGridWeek") {
      return (
        <button
          type="button"
          style={{
            width: "100%",
            height: "100%",
            background: backgroundColor,
            color: "#fff",
            borderRadius: "6px",
            border: `1px solid ${borderColor}`,
            padding: "4px 0",
            fontWeight: 600,
            fontSize: "0.95rem",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            cursor: "pointer",
            transition: "background 0.2s",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {/* Solo mostrar el horario en móvil para vista semanal */}
          {isMobile ? (
            <small style={{ fontSize: "0.8rem", opacity: 0.9 }}>
              {timeDisplay}
            </small>
          ) : (
            <>
              <span>{arg.event.title}</span>
              <small style={{ fontSize: "0.8rem", opacity: 0.9 }}>
                {timeDisplay}
              </small>
            </>
          )}
        </button>
      );
    }

    // Vista diaria personalizada
    if (arg.view.type === "timeGridDay") {
      return (
        <button
          type="button"
          style={{
            width: "100%",
            height: "100%",
            background: backgroundColor,
            color: "#fff",
            borderRadius: "6px",
            border: `1px solid ${borderColor}`,
            padding: "4px 0",
            fontWeight: 600,
            fontSize: "0.95rem",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            cursor: "pointer",
            transition: "background 0.2s",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <span>{arg.event.title}</span>
          <small style={{ fontSize: "0.8rem", opacity: 0.9 }}>
            {timeDisplay}
          </small>
        </button>
      );
    }

    // Para cualquier otra vista, mostrar como botón
    return (
      <button
        type="button"
        style={{
          width: "100%",
          background: backgroundColor,
          color: "#fff",
          borderRadius: "6px",
          border: `1px solid ${borderColor}`,
          padding: "4px 0",
          fontWeight: 600,
          fontSize: "0.95rem",
          marginBottom: "2px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
        onClick={() => setSelectedEvent(arg.event)}
        onMouseOver={(e) => (e.currentTarget.style.background = borderColor)}
        onMouseOut={(e) => (e.currentTarget.style.background = backgroundColor)}
      >
        {arg.event.title}
        <br />
        <small style={{ fontSize: "0.8rem", opacity: 0.9 }}>
          {timeDisplay}
        </small>
      </button>
    );
  };

  // Nuevo handler para clicks en eventos
  const handleCalendarEventClick = (info) => {
    const event = info.event;
    if (event.extendedProps?.freeSlot) {
      setSelectedFreeSlot(event);
      setShowFreeSlotModal(true);
    } else if (event.extendedProps?.admin_created) {
      setSelectedAdminSlot(event);
      setShowAdminSlotModal(true);
    } else {
      setSelectedEvent(event);
    }
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
    const extendedProps = event.extendedProps || {};

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
      cliente: extendedProps.cliente || {},
      vehiculo: extendedProps.vehiculo || {},
      servicio: extendedProps.servicio || "",
      tipoAuto: extendedProps.tipoAuto || "",
      total: extendedProps.total || null,
      orderId: extendedProps.orderId || null,
    };
  };

  const eventDetails = getEventDetails(selectedEvent);

  // Debug: imprimir extendedProps cuando cambie
  useEffect(() => {
    if (selectedEvent) {
      console.log("EVENT DETAILS:", eventDetails);
      console.log("EXTENDED PROPS:", selectedEvent.extendedProps);
      console.log("EVENT OBJECT:", selectedEvent);
    }
  }, [selectedEvent, eventDetails]);

  // Debug: imprimir todos los eventos cuando se carguen
  useEffect(() => {
    console.log("TODOS LOS EVENTOS:", events);
    events.forEach((event, index) => {
      console.log(`Evento ${index}:`, event);
      if (event.admin_created) {
        console.log(`🎯 EVENTO ADMIN ENCONTRADO:`, event);
      }
      // Debug específico para el evento problemático
      if (
        event.title === "Santiago Torija" &&
        event.start &&
        event.start.includes("15:30")
      ) {
        console.log("🔍 EVENTO PROBLEMÁTICO DETECTADO:", {
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          startParsed: new Date(event.start),
          endParsed: new Date(event.end),
          startLocal: new Date(event.start).toLocaleString(),
          endLocal: new Date(event.start).toLocaleString(),
        });
      }
    });
  }, [events]);

  // Obtener todos los días del mes actual
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const allDatesInMonth = Array.from({ length: daysInMonth }, (_, i) => {
    const day = (i + 1).toString().padStart(2, "0");
    return `${year}-${month.toString().padStart(2, "0")}-${day}`;
  });

  // Generar eventos libres y ocupados a partir de daysAvailability y events
  const allEvents = [];
  allDatesInMonth.forEach((date) => {
    const day = daysAvailability.find((d) => d.date.split("T")[0] === date);
    let slotsOcupados = [];
    if (day) {
      slotsOcupados = day.slots_available;
    }
    // Si el día no existe, todos los slots son libres
    availableSlots.forEach((slot, idx) => {
      const slotTime = slot.start;
      const isOccupied = slotsOcupados.includes(slotTime);
      const realEvent = events.find((event) => {
        const eventDate = event.start.split("T")[0];
        const eventStart = new Date(event.start).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        return eventDate === date && eventStart === slotTime;
      });
      if (realEvent) {
        allEvents.push(realEvent);
      } else if (!isOccupied) {
        allEvents.push({
          id: `free-slot-${date}-${idx}`,
          title: "Disponible",
          start: `${date}T${slotTime}:00`,
          end: `${date}T${slot.end}:00`,
          freeSlot: true,
          backgroundColor: "#28a745",
          borderColor: "#1e7e34",
        });
      }
    });
  });

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Agenda</h1>
        <Button
          className="fc-button-primary"
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
            events={allEvents}
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
            slotMaxTime="19:00:00"
            slotDuration="00:30:00"
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            hiddenDays={[0, 6]} // Ocultar domingo (0) y sábado (6)
            slotEventOverlap={false}
            eventOverlap={false}
            eventContent={eventContent}
            eventClick={handleCalendarEventClick}
          />
        </Card.Body>
      </Card>

      <Modal show={!!selectedEvent} onHide={handleCloseModal} centered>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-12">
              <h6 className="text-primary mb-3">Información del Cliente</h6>
              <p>
                <strong>Nombre:</strong> {eventDetails.cliente?.nombre || ""}{" "}
                {eventDetails.cliente?.apellido || ""}
              </p>
              <p>
                <strong>Teléfono:</strong> {eventDetails.cliente?.phone || ""}
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <h6 className="text-primary mb-3">Información del Vehículo</h6>
              <p>
                <strong>Marca:</strong> {eventDetails.vehiculo?.marca || ""}
              </p>
              <p>
                <strong>Modelo:</strong> {eventDetails.vehiculo?.modelo || ""}
              </p>
              <p>
                <strong>Tipo de Auto:</strong> {eventDetails.tipoAuto || ""}
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <h6 className="text-primary mb-3">Información del Servicio</h6>
              <p>
                <strong>Servicio:</strong> {eventDetails.servicio || ""}
              </p>
              {eventDetails.total && (
                <p>
                  <strong>Total:</strong> ${eventDetails.total}
                </p>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <h6 className="text-primary mb-3">Información de la Reserva</h6>
              <p>
                <strong>Fecha:</strong> {eventDetails.date || ""}
              </p>
              <p>
                <strong>Hora:</strong> {eventDetails.time || ""}
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación para slots libres */}
      <Modal
        show={showFreeSlotModal}
        onHide={() => setShowFreeSlotModal(false)}
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <h5>¿Quieres marcar este horario como no disponible?</h5>
            <p>
              {selectedFreeSlot &&
                `${new Date(
                  selectedFreeSlot.start
                ).toLocaleDateString()} - ${formatTime(
                  selectedFreeSlot.start,
                  selectedFreeSlot.end
                )}`}
            </p>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <Button
                variant="danger"
                onClick={async () => {
                  if (selectedFreeSlot) {
                    const date = new Date(selectedFreeSlot.start)
                      .toISOString()
                      .split("T")[0];
                    const slot = selectedFreeSlot.start
                      ? new Date(selectedFreeSlot.start).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit", hour12: false }
                        )
                      : "";
                    await markSlot({ date, slot });
                    setShowFreeSlotModal(false);
                    setSelectedFreeSlot(null);
                    setRefreshKey((k) => k + 1); // Refrescar datos
                  }
                }}
              >
                Sí
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowFreeSlotModal(false)}
              >
                No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación para slots reservados por admin */}
      <Modal
        show={showAdminSlotModal}
        onHide={() => setShowAdminSlotModal(false)}
        centered
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <h5>¿Quieres volver a marcar esta hora como disponible?</h5>
            <p>
              {selectedAdminSlot &&
                `${new Date(
                  selectedAdminSlot.start
                ).toLocaleDateString()} - ${formatTime(
                  selectedAdminSlot.start,
                  selectedAdminSlot.end
                )}`}
            </p>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <Button
                variant="success"
                onClick={async () => {
                  if (selectedAdminSlot) {
                    const date = new Date(selectedAdminSlot.start)
                      .toISOString()
                      .split("T")[0];
                    const slot = selectedAdminSlot.start
                      ? new Date(selectedAdminSlot.start).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit", hour12: false }
                        )
                      : "";
                    await markSlotAvailable({ date, slot });
                    setShowAdminSlotModal(false);
                    setSelectedAdminSlot(null);
                    setRefreshKey((k) => k + 1); // Refrescar datos
                  }
                }}
              >
                Sí
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowAdminSlotModal(false)}
              >
                No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Agenda;
