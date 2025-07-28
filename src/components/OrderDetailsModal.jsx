import React from "react";
import { Modal, Button } from "react-bootstrap";

/**
 * Modal para mostrar los detalles de una orden de cliente
 * @param {boolean} show - Controla la visibilidad del modal
 * @param {function} onHide - Función para cerrar el modal
 * @param {object} eventDetails - Detalles del evento/orden
 */
const OrderDetailsModal = ({ show, onHide, eventDetails }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-12">
            <h6 className="text-primary mb-3">Información del Cliente</h6>
            <p>
              <strong>Nombre:</strong> {eventDetails?.cliente?.nombre || ""}{" "}
              {eventDetails?.cliente?.apellido || ""}
            </p>
            <p>
              <strong>Teléfono:</strong> {eventDetails?.cliente?.phone || ""}
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <h6 className="text-primary mb-3">Información del Vehículo</h6>
            <p>
              <strong>Marca:</strong> {eventDetails?.vehiculo?.marca || ""}
            </p>
            <p>
              <strong>Modelo:</strong> {eventDetails?.vehiculo?.modelo || ""}
            </p>
            <p>
              <strong>Tipo de Auto:</strong> {eventDetails?.tipoAuto || ""}
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <h6 className="text-primary mb-3">Información del Servicio</h6>
            <p>
              <strong>Servicio:</strong> {eventDetails?.servicio || ""}
            </p>
            {eventDetails?.total && (
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
              <strong>Fecha:</strong> {eventDetails?.date || ""}
            </p>
            <p>
              <strong>Hora:</strong> {eventDetails?.time || ""}
            </p>
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
