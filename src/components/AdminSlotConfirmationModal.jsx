import React from "react";
import { Modal, Button } from "react-bootstrap";
import styles from "./AdminSlotConfirmationModal.module.css";

/**
 * Modal de confirmación para marcar un slot reservado por admin como disponible
 * @param {boolean} show - Controla la visibilidad del modal
 * @param {function} onHide - Función para cerrar el modal
 * @param {object} selectedSlot - Slot seleccionado para marcar como disponible
 * @param {function} onConfirm - Función que se ejecuta al confirmar
 * @param {function} formatTime - Función para formatear el tiempo
 */
const AdminSlotConfirmationModal = ({
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

      console.log("🔍 AdminSlotConfirmationModal - Slot extraído:", {
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
          <h5>¿Quieres volver a marcar esta hora como disponible?</h5>
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
              variant="success"
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

export default AdminSlotConfirmationModal;
