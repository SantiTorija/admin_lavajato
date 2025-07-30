import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaPlus, FaLock } from "react-icons/fa";
import { useFormatDate } from "../hooks/useFormatDate";
import styles from "./FreeSlotConfirmationModal.module.css";
import NewOrderModal from "./NewOrderModal";

/**
 * Modal de confirmación para marcar un slot libre como no disponible
 * @param {boolean} show - Controla la visibilidad del modal
 * @param {function} onHide - Función para cerrar el modal
 * @param {object} selectedSlot - Slot seleccionado para marcar como no disponible
 * @param {function} onConfirm - Función que se ejecuta al confirmar
 * @param {function} formatTime - Función para formatear el tiempo
 * @param {function} onOrderCreated - Callback cuando se crea una orden exitosamente
 */
const FreeSlotConfirmationModal = ({
  show,
  onHide,
  selectedSlot,
  onConfirm,
  formatTime,
  onOrderCreated,
}) => {
  const { formatDate } = useFormatDate();
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  const handleMakeNotAvailable = async () => {
    if (selectedSlot) {
      const date = new Date(selectedSlot.start).toISOString().split("T")[0];
      const slot = selectedSlot.start
        ? new Date(selectedSlot.start).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : "";

      console.log("🔍 FreeSlotConfirmationModal - Slot extraído:", {
        originalStart: selectedSlot.start,
        extractedSlot: slot,
        date: date,
      });

      await onConfirm({ date, slot });
      onHide();
    }
  };

  const handleAgendarCliente = () => {
    setShowNewOrderModal(true);
  };

  const handleCloseNewOrderModal = () => {
    setShowNewOrderModal(false);
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <p>
            {selectedSlot &&
              `${formatDate(selectedSlot.start)} - ${formatTime(
                selectedSlot.start,
                selectedSlot.end
              )}`}
          </p>
        </Modal.Header>

        <Modal.Body>
          <div className="text-center">
            <h5>¿Qué quieres hacer con este horario?</h5>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <Button
                variant="outline-success"
                onClick={handleAgendarCliente}
                className="d-flex flex-column align-items-center gap-2 flex-fill"
                style={{
                  borderColor: "#28a745",
                  color: "#28a745",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#28a745";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#28a745";
                }}
              >
                <span className="d-none d-md-block">Agendar Cliente</span>
                <FaPlus size={20} />
              </Button>
              <Button
                variant="outline-danger"
                onClick={handleMakeNotAvailable}
                className="d-flex flex-column align-items-center gap-2 flex-fill"
                style={{
                  borderColor: "#dc3545",
                  color: "#dc3545",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#dc3545";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#dc3545";
                }}
              >
                <span className="d-none d-md-block">Bloquear horario</span>
                <FaLock size={20} />
              </Button>
            </div>

            <div className="mt-4">
              <Button
                variant="secondary"
                onClick={onHide}
                className={styles.cancelButton}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal para agendar cliente */}
      <NewOrderModal
        show={showNewOrderModal}
        onHide={handleCloseNewOrderModal}
        selectedSlot={selectedSlot}
        formatTime={formatTime}
        onOrderCreated={onOrderCreated}
      />
    </>
  );
};

export default FreeSlotConfirmationModal;
