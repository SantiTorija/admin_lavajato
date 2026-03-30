import { useState, useImperativeHandle, forwardRef, useCallback } from "react";
import axios from "axios";
import { Modal, Badge } from "react-bootstrap";

const formatCancelledAtUy = (iso) =>
  iso
    ? new Date(iso).toLocaleString("es-UY", {
        timeZone: "America/Montevideo",
        dateStyle: "short",
        timeStyle: "short",
      })
    : "—";

/** cart.date en YYYY-MM-DD + slot; mediodía local evita corrimiento de día al parsear */
const formatTurnoUy = (dateStr, slot) => {
  const datePart = dateStr
    ? new Date(`${dateStr}T12:00:00`).toLocaleDateString("es-UY", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
  const slotPart = slot ? ` · ${slot}` : "";
  return `${datePart}${slotPart}`;
};

const DashboardCancellationModal = forwardRef(
  function DashboardCancellationModal({ apiUrl, token }, ref) {
    const [show, setShow] = useState(false);
    const [cancelScope, setCancelScope] = useState("today");
    const [cancelRows, setCancelRows] = useState([]);
    const [cancelLoading, setCancelLoading] = useState(false);

    const open = useCallback(
      async (scope) => {
        setCancelScope(scope);
        setShow(true);
        setCancelLoading(true);
        setCancelRows([]);
        try {
          const res = await axios.get(
            `${apiUrl}/analytics/dashboard/cancellations`,
            {
              params: { scope: scope === "week" ? "week" : "today" },
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          setCancelRows(Array.isArray(res.data) ? res.data : []);
        } catch {
          setCancelRows([]);
        } finally {
          setCancelLoading(false);
        }
      },
      [apiUrl, token],
    );

    useImperativeHandle(ref, () => ({ open }), [open]);

    return (
      <Modal show={show} onHide={() => setShow(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Cancelaciones por clientes —{" "}
            {cancelScope === "week" ? "turno esta semana" : "turno hoy"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cancelLoading && <p className="text-muted mb-0">Cargando…</p>}
          {!cancelLoading && cancelRows.length === 0 && (
            <p className="text-muted mb-0">
              No hay cancelaciones en este período.
            </p>
          )}
          {!cancelLoading &&
            cancelRows.map((row, idx) => (
              <div
                key={`${row.firstname}-${row.lastname}-${row.cancelledAt}-${idx}`}
                className="border rounded-3 p-3 mb-2"
              >
                <dl className="row mb-0 small">
                  <dt className="col-sm-4 text-muted">Nombre</dt>
                  <dd className="col-sm-8 mb-2">
                    {row.firstname} {row.lastname}
                  </dd>

                  <dt className="col-sm-4 text-muted">Teléfono</dt>
                  <dd className="col-sm-8 mb-2">{row.phone ?? "—"}</dd>

                  <dt className="col-sm-4 text-muted">Turno</dt>
                  <dd className="col-sm-8 mb-2">
                    {formatTurnoUy(row.serviceDate, row.serviceSlot)}
                  </dd>

                  <dt className="col-sm-4 text-muted">Canceló</dt>
                  <dd className="col-sm-8 mb-2">
                    {formatCancelledAtUy(row.cancelledAt)}
                    {row.sameDayCancel && (
                      <Badge bg="info" className="ms-2">
                        Mismo día que el turno
                      </Badge>
                    )}
                  </dd>
                </dl>
              </div>
            ))}
        </Modal.Body>
      </Modal>
    );
  },
);

export default DashboardCancellationModal;
