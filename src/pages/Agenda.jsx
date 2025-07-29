import { useEffect, useState } from "react";
import { Container, Card, Button, Modal } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import esLocale from "@fullcalendar/core/locales/es";
import { FaEye } from "react-icons/fa";
import useMarkSlotUnavailable from "../hooks/useMarkSlotUnavailable";
import useMarkSlotAvailable from "../hooks/useMarkSlotAvailable";
import useFetchProcessedEventsByRange from "../hooks/useFetchProcessedEventsByRange";
import Loader from "../components/Loader";
import OrderDetailsModal from "../components/OrderDetailsModal";
import FreeSlotConfirmationModal from "../components/FreeSlotConfirmationModal";
import AdminSlotConfirmationModal from "../components/AdminSlotConfirmationModal";
import { useTheme } from "../context/ThemeContext";

// Los slots disponibles ahora se manejan en el backend

const Agenda = () => {
  const { theme } = useTheme();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Función para obtener el rango real que se ve en el calendario
  const getCurrentMonthRange = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // Obtener el primer día del mes
    const firstDayOfMonth = new Date(year, month, 1);

    // Obtener el día de la semana del primer día (0 = domingo, 1 = lunes, etc.)
    const firstDayWeekday = firstDayOfMonth.getDay();

    // Calcular cuántos días del mes anterior necesitamos mostrar
    // Si el primer día es domingo (0), no necesitamos días anteriores
    // Si es lunes (1), necesitamos 1 día anterior, etc.
    const daysFromPreviousMonth =
      firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

    // Obtener el último día del mes
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Calcular cuántos días del siguiente mes necesitamos mostrar
    // Para completar la semana hasta el sábado
    const lastDayWeekday = lastDayOfMonth.getDay();
    const daysFromNextMonth = lastDayWeekday === 0 ? 0 : 7 - lastDayWeekday;

    // Calcular las fechas reales
    const start = new Date(year, month, 1 - daysFromPreviousMonth);
    const end = new Date(year, month + 1, daysFromNextMonth);

    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    };
  };

  // Estados para las fechas visibles del calendario
  // Inicializar con el rango del mes actual para evitar fetchs innecesarios
  const initialMonthRange = getCurrentMonthRange();
  const [calendarStartDate, setCalendarStartDate] = useState(
    initialMonthRange.start
  );
  const [calendarEndDate, setCalendarEndDate] = useState(initialMonthRange.end);

  // Estados para cada modal y su evento asociado
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrderEvent, setSelectedOrderEvent] = useState(null);

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

  /**
   * Handler para cuando cambian las fechas visibles del calendario
   * Se ejecuta cuando el usuario navega entre meses/semanas/días
   *
   * Este handler es crucial porque:
   * - En vista mensual: puede incluir días de meses anteriores/posteriores
   * - En vista semanal: puede cruzar dos meses diferentes
   * - En vista diaria: start y end son el mismo día
   *
   * @param {object} info - Información del evento datesSet de FullCalendar
   */
  const handleDatesSet = (info) => {
    const start = info.start;
    const end = info.end;

    // Convertir fechas a formato YYYY-MM-DD para la API
    const startDate = start.toISOString().split("T")[0];
    const endDate = end.toISOString().split("T")[0];

    // Solo actualizar si las fechas realmente cambiaron
    setCalendarStartDate((prevStart) => {
      if (prevStart !== startDate) {
        return startDate;
      }
      return prevStart;
    });

    setCalendarEndDate((prevEnd) => {
      if (prevEnd !== endDate) {
        return endDate;
      }
      return prevEnd;
    });
  };

  // Hook optimizado para obtener eventos procesados desde el backend
  const { events, loading } = useFetchProcessedEventsByRange(
    calendarStartDate,
    calendarEndDate,
    refreshKey
  );

  const formatTime = (start, end) => {
    if (!start || !end) return "";
    const startTime = new Date(start).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const endTime = new Date(end).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
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
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
          // onClick eliminado, ahora se maneja en eventClick
        >
          <span>{arg.event.title}</span>
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
        onClick={() => setSelectedOrderEvent(arg.event)}
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

  // Handlers para abrir/cerrar cada modal
  const handleOrderEventClick = (event) => {
    setSelectedOrderEvent(event);
    setShowOrderModal(true);
  };

  const handleFreeSlotClick = (event) => {
    setSelectedFreeSlot(event);
    setShowFreeSlotModal(true);
  };

  const handleAdminSlotClick = (event) => {
    setSelectedAdminSlot(event);
    setShowAdminSlotModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrderEvent(null);
    document.body.style.overflow = "auto";
  };

  const closeFreeSlotModal = () => {
    setShowFreeSlotModal(false);
    setSelectedFreeSlot(null);
    document.body.style.overflow = "auto";
  };

  const closeAdminSlotModal = () => {
    setShowAdminSlotModal(false);
    setSelectedAdminSlot(null);
    document.body.style.overflow = "auto";
  };

  // Nuevo handler para clicks en eventos
  const handleCalendarEventClick = (info) => {
    const event = info.event;
    if (event.extendedProps?.freeSlot) {
      handleFreeSlotClick(event);
    } else if (event.extendedProps?.admin_created) {
      handleAdminSlotClick(event);
    } else if (
      event.extendedProps?.cliente ||
      event.extendedProps?.vehiculo ||
      event.extendedProps?.servicio
    ) {
      handleOrderEventClick(event);
    }
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
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      };

  const getEventDetails = (event) => {
    if (!event) return {};
    const start = event.start;
    const end = event.end;
    const extendedProps = event.extendedProps || {};

    // Debug: Verificar qué datos llegan al modal
    console.log("🔍 DEBUG - getEventDetails - extendedProps:", extendedProps);
    console.log(
      "🔍 DEBUG - getEventDetails - Todas las claves disponibles:",
      Object.keys(extendedProps)
    );
    console.log(
      "🔍 DEBUG - getEventDetails - serviceId:",
      extendedProps.serviceId
    );
    console.log(
      "🔍 DEBUG - getEventDetails - carTypeId:",
      extendedProps.carTypeId
    );
    console.log(
      "🔍 DEBUG - getEventDetails - servicio?.id:",
      extendedProps.servicio?.id
    );
    console.log(
      "🔍 DEBUG - getEventDetails - vehiculo?.carTypeId:",
      extendedProps.vehiculo?.carTypeId
    );
    console.log(
      "🔍 DEBUG - getEventDetails - tipoAuto?.id:",
      extendedProps.tipoAuto?.id
    );

    return {
      title: event.title,
      date: start ? start.toLocaleDateString() : "",
      time:
        start && end
          ? `${start.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })} - ${end.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}`
          : "",
      cliente: extendedProps.cliente || {},
      vehiculo: extendedProps.vehiculo || {},
      servicio: extendedProps.servicio || "",
      tipoAuto: extendedProps.tipoAuto || "",
      total: extendedProps.total || null,
      orderId: extendedProps.orderId || null,
      serviceId: extendedProps.serviceId || extendedProps.servicio?.id || null,
      carTypeId:
        extendedProps.carTypeId ||
        extendedProps.vehiculo?.carTypeId ||
        extendedProps.tipoAuto?.id ||
        null,
    };
  };

  const eventDetails = getEventDetails(selectedOrderEvent);

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
          {loading && <Loader />}
          <div
            style={{
              // CSS personalizado para números de días en negro
              "--fc-daygrid-day-number-color": "#000000",
              "--fc-daygrid-day-number-hover-color": "#000000",
            }}
          >
            <style>
              {`
                .fc-daygrid-day-number,
                .fc-daygrid-day-number:link,
                .fc-daygrid-day-number:visited,
                .fc-daygrid-day-number:active,
                .fc-daygrid-day-number:hover {
                  color: ${
                    theme === "light" ? "#000000" : "#ffffff"
                  } !important;
                }
                
                .fc-daygrid-day .fc-daygrid-day-number,
                .fc-daygrid-day.fc-day-today .fc-daygrid-day-number,
                .fc-daygrid-day.fc-day-other .fc-daygrid-day-number,
                .fc-daygrid-day.fc-day-past .fc-daygrid-day-number,
                .fc-daygrid-day.fc-day-future .fc-daygrid-day-number {
                  color: ${
                    theme === "light" ? "#000000" : "#ffffff"
                  } !important;
                }
                
                /* Forzar color según tema en todos los casos */
                [class*="fc-daygrid-day"] [class*="fc-daygrid-day-number"] {
                  color: ${
                    theme === "light" ? "#000000" : "#ffffff"
                  } !important;
                }
              `}
            </style>
            <FullCalendar
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,

                bootstrap5Plugin,
              ]}
              headerToolbar={headerToolbar}
              initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
              events={events}
              locale={esLocale}
              themeSystem="bootstrap5"
              height="auto"
              allDaySlot={false}
              buttonText={{
                today: "Volver a hoy",
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
              datesSet={handleDatesSet}
            />
          </div>
        </Card.Body>
      </Card>

      {/* Modal para mostrar detalles de orden */}
      <OrderDetailsModal
        show={showOrderModal}
        onHide={closeOrderModal}
        eventDetails={eventDetails}
        onOrderDeleted={() => setRefreshKey((k) => k + 1)}
      />

      {/* Modal de confirmación para slots libres */}
      <FreeSlotConfirmationModal
        show={showFreeSlotModal}
        onHide={closeFreeSlotModal}
        selectedSlot={selectedFreeSlot}
        onConfirm={async ({ date, slot }) => {
          await markSlot({ date, slot });
          setRefreshKey((k) => k + 1); // Refrescar datos
        }}
        formatTime={formatTime}
      />

      {/* Modal de confirmación para slots reservados por admin */}
      <AdminSlotConfirmationModal
        show={showAdminSlotModal}
        onHide={closeAdminSlotModal}
        selectedSlot={selectedAdminSlot}
        onConfirm={async ({ date, slot }) => {
          await markSlotAvailable({ date, slot });
          setRefreshKey((k) => k + 1); // Refrescar datos
        }}
        formatTime={formatTime}
      />
    </Container>
  );
};

export default Agenda;
