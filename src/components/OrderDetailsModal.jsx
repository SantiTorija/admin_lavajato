import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useFormatDate } from "../hooks/useFormatDate";
import { useServicePrice } from "../hooks/useServicePrice";
import { useDeleteOrderWithConfirmation } from "../hooks/useDeleteOrderWithConfirmation";
import {
  FaPhone,
  FaUser,
  FaCar,
  FaTrash,
  FaEdit,
  FaCheck,
} from "react-icons/fa";
import useFetchServicesData from "../hooks/useFetchServicesData";
import { useUpdateOrder } from "../hooks/useUpdateOrder";
import styles from "./orderDitailsModal.module.css";

/**
 * Modal para mostrar los detalles de una orden de cliente
 * @param {boolean} show - Controla la visibilidad del modal
 * @param {function} onHide - Función para cerrar el modal
 * @param {object} eventDetails - Detalles del evento/orden
 * @param {function} onOrderDeleted - Callback cuando se elimina una orden
 * @param {function} onOrderUpdated - Callback cuando se actualiza una orden
 */
const OrderDetailsModal = ({
  show,
  onHide,
  eventDetails,
  onOrderDeleted,
  onOrderUpdated,
}) => {
  const { formatDate } = useFormatDate();
  // Hook para obtener el precio del servicio
  // Estado local para manejar el CarType actual (refresca precio al cambiar)
  const [currentCarTypeId, setCurrentCarTypeId] = useState(
    eventDetails?.carTypeId ?? null
  );
  const [currentServiceId, setCurrentServiceId] = useState(
    eventDetails?.serviceId ?? null
  );
  // Estados de edición (car type y service) deben declararse antes de usar
  const [isEditingCarType, setIsEditingCarType] = useState(false);
  const [selectedCarTypeId, setSelectedCarTypeId] = useState(
    eventDetails?.carTypeId ? String(eventDetails.carTypeId) : ""
  );
  const [isEditingService, setIsEditingService] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(
    eventDetails?.serviceId ? String(eventDetails.serviceId) : ""
  );

  const effectiveServiceId =
    isEditingService && selectedServiceId
      ? Number(selectedServiceId)
      : currentServiceId != null
      ? Number(currentServiceId)
      : null;

  // Estado para forzar re-fetch del hook useServicePrice
  const [priceRefreshKey, setPriceRefreshKey] = useState(0);

  const {
    servicePrice,
    loading: loadingPrice,
    error,
  } = useServicePrice(
    currentCarTypeId,
    effectiveServiceId,
    show, // Solo hacer fetch cuando el modal está abierto
    priceRefreshKey // Key para forzar re-fetch
  );

  // Cargar tipos de auto y servicios
  const { carTypes, services } = useFetchServicesData();

  useEffect(() => {
    if (show) {
      console.log("📂 Modal abierto - eventDetails recibidos:", eventDetails);
      console.log(
        "📂 carTypeId:",
        eventDetails?.carTypeId,
        "serviceId:",
        eventDetails?.serviceId
      );
      setIsEditingCarType(false);
      setSelectedCarTypeId(
        eventDetails?.carTypeId ? String(eventDetails.carTypeId) : ""
      );
      setCurrentCarTypeId(eventDetails?.carTypeId ?? null);

      setIsEditingService(false);
      setSelectedServiceId(
        eventDetails?.serviceId ? String(eventDetails.serviceId) : ""
      );
      setCurrentServiceId(eventDetails?.serviceId ?? null);
      setHasChanges(false);
    }
  }, [show, eventDetails?.carTypeId, eventDetails?.serviceId, eventDetails]);

  const { updateOrder, loading: updateLoading } = useUpdateOrder();

  // Marca de cambios para refrescar agenda al cerrar
  const [hasChanges, setHasChanges] = useState(false);

  // Estado para forzar re-render del modal
  const [modalKey, setModalKey] = useState(0);

  // Función para refrescar el contenido del modal
  const refreshModalContent = () => {
    console.log("🔄 refreshModalContent ejecutándose");
    setModalKey((prev) => prev + 1);
    setPriceRefreshKey((prev) => prev + 1); // Forzar re-fetch del precio
    setHasChanges(true);

    // Si hay callback de actualización, ejecutarlo inmediatamente
    if (onOrderUpdated) {
      console.log("📞 Llamando onOrderUpdated");
      onOrderUpdated();
    } else {
      console.log("❌ onOrderUpdated no está disponible");
    }
  };

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
    <>
      <Modal
        key={modalKey}
        show={show}
        onHide={onHide}
        onExited={() => {
          if (hasChanges && onOrderUpdated) {
            onOrderUpdated();
          }
        }}
        centered
      >
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
          <div className={styles.responsiveModal}>
            <div className="row">
              <div className="col-6 border border-primary rounded-3 p-3">
                <h6 className="mb-3">Cliente</h6>
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
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className=" mb-0">Vehículo</h6>
                  {eventDetails?.orderId && (
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      title={
                        isEditingCarType ? "Confirmar" : "Editar tipo de auto"
                      }
                      onClick={async () => {
                        if (!isEditingCarType) {
                          setIsEditingCarType(true);
                          return;
                        }
                        if (!selectedCarTypeId) return;
                        const parsedId = parseInt(selectedCarTypeId, 10);
                        const result = await updateOrder(
                          eventDetails.orderId,
                          {},
                          undefined,
                          undefined,
                          parsedId
                        );
                        if (result?.success) {
                          console.log(
                            "✅ Tipo de auto actualizado exitosamente - parsedId:",
                            parsedId
                          );
                          console.log(
                            "📊 eventDetails antes del refresh:",
                            eventDetails
                          );
                          setIsEditingCarType(false);
                          setCurrentCarTypeId(parsedId);
                          setSelectedCarTypeId(String(parsedId)); // Sincronizar el select
                          toast.success("Tipo de auto actualizado");
                          // Refrescar el contenido del modal
                          refreshModalContent();
                        }
                      }}
                      disabled={updateLoading}
                    >
                      {isEditingCarType ? (
                        <FaCheck size={20} className="text-success" />
                      ) : (
                        <FaEdit size={20} className="text-primary" />
                      )}
                    </button>
                  )}
                </div>
                <p>
                  <strong>
                    <FaCar className="me-2" />
                    {eventDetails?.vehiculo?.marca || ""}{" "}
                    {eventDetails?.vehiculo?.modelo || ""}
                  </strong>
                </p>
                {isEditingCarType ? (
                  <div>
                    <select
                      className="form-select"
                      value={selectedCarTypeId}
                      onChange={(e) => setSelectedCarTypeId(e.target.value)}
                      disabled={updateLoading}
                    >
                      <option value="" disabled>
                        Seleccione tipo de auto
                      </option>
                      {carTypes?.map((ct) => (
                        <option key={ct.id} value={String(ct.id)}>
                          {ct.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p>
                    {(() => {
                      const nameFromList = carTypes?.find(
                        (ct) => ct.id === Number(currentCarTypeId)
                      )?.name;
                      return nameFromList || eventDetails?.tipoAuto || "";
                    })()}
                  </p>
                )}
              </div>
            </div>

            <div className="row"></div>

            <div className="row">
              <div className="col-12 border border-primary rounded-3 p-3 mt-1">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6>Servicio</h6>
                  {eventDetails?.orderId && (
                    <button
                      type="button"
                      className="btn btn-link p-0 mb-2"
                      title={
                        isEditingService
                          ? "Confirmar"
                          : "Editar tipo de servicio"
                      }
                      onClick={async () => {
                        if (!isEditingService) {
                          setIsEditingService(true);
                          return;
                        }
                        if (!selectedServiceId) return;
                        const parsedServiceId = parseInt(selectedServiceId, 10);

                        try {
                          const payload = {
                            ServiceId: parsedServiceId,
                          };

                          const result = await updateOrder(
                            eventDetails.orderId,
                            payload
                          );
                          if (result?.success) {
                            console.log(
                              "✅ Servicio actualizado exitosamente - parsedServiceId:",
                              parsedServiceId
                            );
                            console.log(
                              "📊 eventDetails antes del refresh:",
                              eventDetails
                            );
                            setIsEditingService(false);
                            setCurrentServiceId(parsedServiceId);
                            setSelectedServiceId(String(parsedServiceId)); // Sincronizar el select
                            toast.success("Servicio actualizado");
                            // Refrescar el contenido del modal
                            refreshModalContent();
                          }
                        } catch (e) {
                          console.error("Error actualizando servicio:", e);
                        }
                      }}
                      disabled={updateLoading}
                    >
                      {isEditingService ? (
                        <FaCheck size={20} className="text-success" />
                      ) : (
                        <FaEdit size={20} className="text-primary" />
                      )}
                    </button>
                  )}
                </div>
                <p className="gap-3">
                  <span>
                    <strong>{eventDetails?.time || ""}</strong>
                  </span>
                </p>
                {isEditingService ? (
                  <div>
                    <select
                      className="form-select"
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      disabled={updateLoading}
                    >
                      <option value="" disabled>
                        Seleccione servicio
                      </option>
                      {services?.map((s) => (
                        <option key={s.id} value={String(s.id)}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p>
                    <strong>
                      {(() => {
                        const nameFromList = services?.find(
                          (s) => s.id === Number(currentServiceId)
                        )?.name;
                        return nameFromList || eventDetails?.servicio || "";
                      })()}
                    </strong>
                  </p>
                )}

                {loadingPrice && (
                  <p>
                    <small className="text-muted">Cargando precio...</small>
                  </p>
                )}
                {error && (
                  <p>
                    <small className="text-danger">
                      Error al cargar precio
                    </small>
                  </p>
                )}
                {servicePrice && (
                  <strong className="fs-6">${servicePrice.price}</strong>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Toastify global en App.jsx */}
    </>
  );
};

export default OrderDetailsModal;
