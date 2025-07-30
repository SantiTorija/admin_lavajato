import React, { useState, useEffect } from "react";
import { Modal, Button, InputGroup, Form } from "react-bootstrap";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import useFetchClients from "../hooks/useFetchClients";
import useFetchServicesData from "../hooks/useFetchServicesData";
import useCreateOrder from "../hooks/useCreateOrder";
import { useFormatDate } from "../hooks/useFormatDate";
import styles from "./NewOrderModal.module.css";

/**
 * Modal para crear una nueva orden/agendar cliente
 * @param {boolean} show - Controla la visibilidad del modal
 * @param {function} onHide - Función para cerrar el modal
 * @param {object} selectedSlot - Slot seleccionado para agendar
 * @param {function} formatTime - Función para formatear el tiempo
 * @param {function} onOrderCreated - Callback cuando se crea la orden exitosamente
 */
const NewOrderModal = ({
  show,
  onHide,
  selectedSlot,
  formatTime,
  onOrderCreated,
}) => {
  const { theme } = useTheme();
  const { clients } = useFetchClients();
  const { services, carTypes, servicePrices } = useFetchServicesData();
  const { formatDate } = useFormatDate();
  const {
    createOrder,
    loading: orderLoading,
    error: orderError,
  } = useCreateOrder();

  // Debug: verificar tema activo
  useEffect(() => {
    console.log("🔍 DEBUG - Tema actual:", theme);
    console.log("🔍 DEBUG - Clases del body:", document.body.className);
  }, [theme]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCarType, setSelectedCarType] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [total, setTotal] = useState("");

  const handleSave = async () => {
    if (!selectedClient || !selectedCarType || !selectedService || !total) {
      alert("Por favor complete todos los campos");
      return;
    }

    try {
      // Formatear fecha y slot del selectedSlot
      const date = new Date(selectedSlot.start).toISOString().split("T")[0];
      const slot = new Date(selectedSlot.start).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      // Obtener nombres para el cart
      const selectedServiceData = services.find(
        (s) => s.id === selectedService
      );

      // Crear estructura de datos para la orden
      const orderData = {
        email: selectedClient.email,
        firstname: selectedClient.firstname,
        lastname: selectedClient.lastname,
        cart: {
          date: date,
          slot: slot,
          total: total.replace("$", ""), // Remover el símbolo $
          service: selectedServiceData.name,
          serviceId: selectedService,
        },
        ClientId: selectedClient.id,
        ServiceId: selectedService,
        CarTypeId: selectedCarType,
      };

      console.log("Creando orden con datos:", orderData);

      await createOrder(orderData);

      // Cerrar modal y limpiar estado
      onHide();
      setSelectedClient(null);
      setSearchTerm("");
      setSelectedCarType("");
      setSelectedService("");
      setTotal("");

      onOrderCreated(); // Llamar el callback para refrescar el calendario
    } catch (error) {
      console.error("Error al crear orden:", error);
      alert("Error al crear la orden: " + error.message);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.length > 0);
  };

  const handleFocus = () => {
    if (searchTerm.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleSearchClick = () => {
    // Al hacer click en la lupa, mostrar todos los clientes
    setShowDropdown(true);
  };

  const selectClient = (client) => {
    setSelectedClient(client);
    setSearchTerm(client.firstname + " " + client.lastname);
    setShowDropdown(false);

    // Autocompletar carType basado en el cliente seleccionado
    if (client.car && client.car.carTypeId) {
      setSelectedCarType(client.car.carTypeId.toString());
    } else {
      setSelectedCarType("");
    }

    // Resetear servicio y total cuando cambia el cliente
    setSelectedService("");
    setTotal("");
  };

  const handleAddNewClient = () => {
    // TODO: Abrir modal para agregar cliente nuevo
    console.log("Abrir modal para agregar cliente nuevo");
  };

  const handleCarTypeChange = (e) => {
    setSelectedCarType(e.target.value);
  };

  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
  };

  // Calcular total cuando cambien los selects
  useEffect(() => {
    if (selectedCarType && selectedService && servicePrices.length > 0) {
      const price = servicePrices.find(
        (sp) =>
          sp.CarTypeId === selectedCarType && sp.ServiceId === selectedService
      );

      if (price) {
        setTotal(`$${price.price}`);
      } else {
        setTotal("Precio no disponible");
      }
    } else {
      setTotal("");
    }
  }, [selectedCarType, selectedService, servicePrices]);

  // Filtrar clientes basado en searchTerm
  const filteredClients = clients.filter((client) => {
    const fullName = `${client.firstname} ${client.lastname}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles.clientSearchContainer}`)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Agendar Cliente</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="text-center row justify-content-center gap-3">
          <div className="col-12 col-md-5 d-flex flex-column align-items-start border border-primary rounded-3 p-3">
            <h6>Horario seleccionado</h6>
            <p
              style={{
                color: theme === "dark" ? "#f8f9fa" : "inherit",
              }}
            >
              {selectedSlot &&
                `${formatDate(selectedSlot.start)} - ${formatTime(
                  selectedSlot.start,
                  selectedSlot.end
                )}`}
            </p>
          </div>

          <div className="col-12 col-md-5 d-flex flex-column align-items-start border border-primary rounded-3 p-3 position-relative">
            {/* Botón + verde arriba a la derecha */}
            <Button
              className="position-absolute top-0 end-0 m-2"
              variant="success"
              size="sm"
              onClick={handleAddNewClient}
            >
              <FaPlus />
            </Button>

            <h6>Cliente</h6>

            {/* Campo de búsqueda autocomplete */}
            <div className={styles.clientSearchContainer}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Buscar cliente..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={handleFocus}
                  className={styles.searchInput}
                />
                <InputGroup.Text
                  onClick={handleSearchClick}
                  style={{ cursor: "pointer" }}
                >
                  <FaSearch />
                </InputGroup.Text>
              </InputGroup>

              {/* Dropdown de opciones */}
              {showDropdown && filteredClients.length > 0 && (
                <div
                  className={styles.dropdownOptions}
                  style={{
                    background: theme === "dark" ? "#212529" : "white",
                    borderColor: theme === "dark" ? "#495057" : "#dee2e6",
                    color: theme === "dark" ? "#f8f9fa" : "inherit",
                  }}
                >
                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className={styles.dropdownOption}
                      onClick={() => selectClient(client)}
                      style={{
                        color: theme === "dark" ? "#f8f9fa" : "inherit",
                        backgroundColor:
                          theme === "dark" ? "#212529" : "transparent",
                        borderBottomColor:
                          theme === "dark" ? "#495057" : "#f8f9fa",
                      }}
                      onMouseEnter={(e) => {
                        if (theme === "dark") {
                          e.target.style.backgroundColor = "#343a40";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (theme === "dark") {
                          e.target.style.backgroundColor = "#212529";
                        }
                      }}
                    >
                      {client.firstname} {client.lastname}
                    </div>
                  ))}
                </div>
              )}

              {showDropdown &&
                filteredClients.length === 0 &&
                searchTerm.length > 0 && (
                  <div
                    className={styles.noResults}
                    style={{
                      background: theme === "dark" ? "#212529" : "white",
                      borderColor: theme === "dark" ? "#495057" : "#dee2e6",
                      color: theme === "dark" ? "#adb5bd" : "#6c757d",
                    }}
                  >
                    No se encontraron clientes
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Formulario de servicios */}
        <div className="p-4 border rounded bg-light mt-3">
          <div className="row">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Tipo de auto</Form.Label>
                <Form.Select
                  disabled={!selectedClient}
                  value={selectedCarType}
                  onChange={handleCarTypeChange}
                >
                  <option value="">
                    {!selectedClient
                      ? "Cree o seleccione un cliente"
                      : "Seleccione tipo de auto"}
                  </option>
                  {carTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Servicio</Form.Label>
                <Form.Select
                  disabled={!selectedClient}
                  value={selectedService}
                  onChange={handleServiceChange}
                >
                  <option value="">
                    {!selectedClient
                      ? "Cree o seleccione un cliente"
                      : "Seleccione servicio"}
                  </option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Total</Form.Label>
                <Form.Control
                  type="text"
                  value={total}
                  readOnly
                  placeholder="Se calculará automáticamente"
                />
              </Form.Group>
            </div>
          </div>
        </div>

        {/* Mostrar error si existe */}
        {orderError && (
          <div className="alert alert-danger mt-3">{orderError}</div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={
            orderLoading ||
            !selectedClient ||
            !selectedCarType ||
            !selectedService ||
            !total
          }
        >
          {orderLoading ? "Guardando..." : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewOrderModal;
