import React from "react";
import { Modal, Button } from "react-bootstrap";
import styles from "./FreeSlotConfirmationModal.module.css";

/**
 * Modal de confirmación para marcar un slot libre como no disponible
 * @param {boolean} show - Controla la visibilidad del modal
 * @param {function} onHide - Función para cerrar el modal
 * @param {object} selectedSlot - Slot seleccionado para marcar como no disponible
 * @param {function} onConfirm - Función que se ejecuta al confirmar
 * @param {function} formatTime - Función para formatear el tiempo
 */
const FreeSlotConfirmationModal = ({
  show,
  onHide,
  selectedSlot,
  onConfirm,
  formatTime,
}) => {
  const handleConfirm = async () => {
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

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="text-center">
          <h5>¿Quieres marcar este horario como no disponible?</h5>
          <p>
            {selectedSlot &&
              `${new Date(
                selectedSlot.start
              ).toLocaleDateString()} - ${formatTime(
                selectedSlot.start,
                selectedSlot.end
              )}`}
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button
              variant="danger"
              onClick={handleConfirm}
              className={styles.confirmButton}
            >
              Sí
            </Button>
            <Button
              variant="secondary"
              onClick={onHide}
              className={styles.cancelButton}
            >
              No
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default FreeSlotConfirmationModal;
