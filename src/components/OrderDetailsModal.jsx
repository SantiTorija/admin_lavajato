import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useFormatDate } from "../hooks/useFormatDate";
import { useServicePrice } from "../hooks/useServicePrice";
import { useDeleteOrderWithConfirmation } from "../hooks/useDeleteOrderWithConfirmation";
import { FaPhone, FaUser, FaCar, FaTrash } from "react-icons/fa";

/**
 * Modal para mostrar los detalles de una orden de cliente
 * @param {boolean} show - Controla la visibilidad del modal
 * @param {function} onHide - Función para cerrar el modal
 * @param {object} eventDetails - Detalles del evento/orden
 * @param {function} onOrderDeleted - Callback cuando se elimina una orden
 */
const OrderDetailsModal = ({ show, onHide, eventDetails, onOrderDeleted }) => {
  const { formatDate } = useFormatDate();
  // Hook para obtener el precio del servicio
  const {
    servicePrice,
    loading: loadingPrice,
    error,
  } = useServicePrice(
    eventDetails?.carTypeId,
    eventDetails?.serviceId,
    show // Solo hacer fetch cuando el modal está abierto
  );

  // Hook para eliminar orden con confirmación
  const { handleDeleteWithConfirmation, loading: deleteLoading } =
    useDeleteOrderWithConfirmation(() => {
      // Callback que se ejecuta cuando la eliminación es exitosa
      onHide();
      if (onOrderDeleted) {
        onOrderDeleted();
      }
    });

  // Función para manejar la eliminación
  const handleDeleteOrder = async () => {
    if (!eventDetails?.orderId) {
      console.error("❌ No hay orderId disponible");
      return;
    }

    const result = await handleDeleteWithConfirmation(
      eventDetails.orderId,
      eventDetails.date,
      eventDetails.time
    );

    // El hook ya maneja todo: validación, confirmación, eliminación y callbacks
    console.log("🗑️ Resultado de eliminación:", result);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <div className="d-flex justify-content-between align-items-center gap-3">
          <strong className="fs-5">
            {formatDate(eventDetails?.date) || "-"}
          </strong>
          <button
            type="button"
            className="btn btn-link text-danger p-0"
            onClick={handleDeleteOrder}
            disabled={deleteLoading}
            title="Eliminar orden"
          >
            <FaTrash size={22} />
          </button>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-6 border border-primary rounded-3 p-3">
            <h6 className="text-primary mb-3">Información del Cliente</h6>
            <p>
              <strong>
                <FaUser className="me-2" />
                {eventDetails?.cliente?.nombre || ""}{" "}
                {eventDetails?.cliente?.apellido || ""}
              </strong>
            </p>
            <p>
              <FaPhone className="me-2" />
              {eventDetails?.cliente?.phone || ""}
            </p>
          </div>
          <div className="col-6 border border-primary rounded-3 p-3">
            <h6 className="text-primary mb-3">Información del Vehículo</h6>
            <p>
              <strong>
                <FaCar className="me-2" />
                {eventDetails?.vehiculo?.marca || ""}{" "}
                {eventDetails?.vehiculo?.modelo || ""}
              </strong>
            </p>

            <p>{eventDetails?.tipoAuto || ""}</p>
          </div>
        </div>

        <div className="row"></div>

        <div className="row">
          <div className="col-12 border border-primary rounded-3 p-3 mt-1">
            <h6 className="text-primary mb-3">Información del Servicio</h6>
            <p className="gap-3">
              <span>
                <strong>{eventDetails?.time || ""}</strong>
              </span>
            </p>
            <p>
              <strong> {eventDetails?.servicio || ""}</strong>
            </p>

            {loadingPrice && (
              <p>
                <small className="text-muted">Cargando precio...</small>
              </p>
            )}
            {error && (
              <p>
                <small className="text-danger">Error al cargar precio</small>
              </p>
            )}
            {servicePrice && (
              <strong className="fs-6">${servicePrice.price}</strong>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailsModal;
