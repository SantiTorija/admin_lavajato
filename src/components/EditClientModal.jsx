import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import useUpdateClient from "../hooks/useUpdateClient";
import useFetchServicesData from "../hooks/useFetchServicesData";

/**
 * Modal para editar un cliente existente
 * @param {boolean} show - Controla la visibilidad del modal
 * @param {function} onHide - Función para cerrar el modal
 * @param {object} client - Cliente a editar
 * @param {function} onClientUpdated - Callback cuando se actualiza el cliente exitosamente
 */
const EditClientModal = ({ show, onHide, client, onClientUpdated }) => {
  const { carTypes } = useFetchServicesData();
  const { updateClient, loading, error } = useUpdateClient();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    phoneCountryCode: "+598",
    marca: "",
    modelo: "",
    carTypeId: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [addEmailLater, setAddEmailLater] = useState(false);

  // Códigos de país más comunes
  const countryCodes = [
    { code: "+54", country: "Argentina" },
    { code: "+1", country: "Estados Unidos/Canadá" },
    { code: "+52", country: "México" },
    { code: "+57", country: "Colombia" },
    { code: "+58", country: "Venezuela" },
    { code: "+56", country: "Chile" },
    { code: "+51", country: "Perú" },
    { code: "+593", country: "Ecuador" },
    { code: "+595", country: "Paraguay" },
    { code: "+598", country: "Uruguay" },
    { code: "+591", country: "Bolivia" },
    { code: "+34", country: "España" },
    { code: "+33", country: "Francia" },
    { code: "+49", country: "Alemania" },
    { code: "+39", country: "Italia" },
    { code: "+44", country: "Reino Unido" },
    { code: "+55", country: "Brasil" },
  ];

  // Cargar datos del cliente cuando se abre el modal
  useEffect(() => {
    if (show && client) {
      // Extraer código de país y número del teléfono
      let phoneCountryCode = "+598"; // Por defecto Uruguay
      let phoneNumber = "";

      if (client.phone) {
        // Buscar el código de país en el teléfono
        const countryCode = countryCodes.find((country) =>
          client.phone.startsWith(country.code)
        );

        if (countryCode) {
          phoneCountryCode = countryCode.code;
          phoneNumber = client.phone.replace(countryCode.code, "");
        } else {
          phoneNumber = client.phone;
        }
      }

      setFormData({
        firstname: client.firstname || "",
        lastname: client.lastname || "",
        email: client.email || "",
        phone: phoneNumber,
        phoneCountryCode: phoneCountryCode,
        marca: client.car?.marca || "",
        modelo: client.car?.modelo || "",
        carTypeId: client.car?.carTypeId?.toString() || "",
      });
      setValidationErrors({});
      setAddEmailLater(false);
    }
  }, [show, client]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error de validación cuando el usuario empiece a escribir
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstname.trim()) {
      errors.firstname = "El nombre es requerido";
    }

    if (!formData.lastname.trim()) {
      errors.lastname = "El apellido es requerido";
    }

    // Solo validar email si no está marcado el checkbox
    if (!addEmailLater) {
      if (!formData.email.trim()) {
        errors.email = "El email es requerido";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = "El email no es válido";
      }
    }

    if (formData.carTypeId && !formData.marca.trim()) {
      errors.marca = "La marca es requerida si selecciona un tipo de auto";
    }

    if (formData.carTypeId && !formData.modelo.trim()) {
      errors.modelo = "El modelo es requerido si selecciona un tipo de auto";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Generar email falso si el checkbox está marcado
      let emailToSend = formData.email.trim();
      if (addEmailLater) {
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 8);
        emailToSend = `temp_${timestamp}_${randomId}@temporary.com`;
      }

      // Preparar datos del carro
      const carData = formData.carTypeId
        ? {
            marca: formData.marca,
            modelo: formData.modelo,
            carType:
              carTypes.find((ct) => ct.id.toString() === formData.carTypeId)
                ?.name || "",
            carTypeId: parseInt(formData.carTypeId),
          }
        : {};

      // Combinar código de país con número de teléfono
      const fullPhone = formData.phone.trim()
        ? `${formData.phoneCountryCode}${formData.phone.trim()}`
        : "";

      const clientData = {
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        email: emailToSend,
        phone: fullPhone,
        ...carData,
      };

      const updatedClient = await updateClient(client.id, clientData);

      // Mostrar toast de éxito
      toast.success("Cliente actualizado exitosamente");

      // Cerrar modal y llamar callback
      onHide();
      onClientUpdated(updatedClient);
    } catch (error) {
      console.error("Error al actualizar cliente:", error);

      // Mostrar toast de error
      toast.error(error.message || "Error al actualizar cliente");
    }
  };

  if (!client) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Cliente</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Mostrar error del servidor si existe */}
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <div className="row">
            {/* Información personal */}
            <div className="col-md-6">
              <h6 className="mb-3">Información Personal</h6>

              <Form.Group className="mb-3">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.firstname}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.firstname}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Apellido *</Form.Label>
                <Form.Control
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.lastname}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.lastname}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.email}
                  disabled={addEmailLater}
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="addEmailLater"
                  label="Agregar email más tarde"
                  checked={addEmailLater}
                  onChange={(e) => setAddEmailLater(e.target.checked)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <div className="d-flex">
                  <Form.Select
                    name="phoneCountryCode"
                    value={formData.phoneCountryCode}
                    onChange={handleInputChange}
                    style={{ width: "120px" }}
                    className="me-2"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Número de teléfono (opcional)"
                  />
                </div>
              </Form.Group>
            </div>

            {/* Información del vehículo */}
            <div className="col-md-6">
              <h6 className="mb-3">Información del Vehículo</h6>

              <Form.Group className="mb-3">
                <Form.Label>Tipo de Auto</Form.Label>
                <Form.Select
                  name="carTypeId"
                  value={formData.carTypeId}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccione tipo de auto</option>
                  {carTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Marca</Form.Label>
                <Form.Control
                  type="text"
                  name="marca"
                  value={formData.marca}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.marca}
                  disabled={!formData.carTypeId}
                  placeholder={
                    formData.carTypeId
                      ? "Ej: Toyota"
                      : "Seleccione tipo de auto primero"
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.marca}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Modelo</Form.Label>
                <Form.Control
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleInputChange}
                  isInvalid={!!validationErrors.modelo}
                  disabled={!formData.carTypeId}
                  placeholder={
                    formData.carTypeId
                      ? "Ej: Corolla"
                      : "Seleccione tipo de auto primero"
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.modelo}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar Cliente"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditClientModal;
