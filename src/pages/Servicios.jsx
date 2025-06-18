import { useState } from "react";
import {
  Table,
  Card,
  Container,
  Spinner,
  Alert,
  Button,
  Modal,
  Form,
  InputGroup,
} from "react-bootstrap";
import useFetchServicesData from "../hooks/useFetchServicesData";
import { FaSyncAlt, FaPlus, FaEdit, FaCheck } from "react-icons/fa";

const Servicios = () => {
  const { services, carTypes, servicePrices, loading, error, refetch } =
    useFetchServicesData();
  const [showModal, setShowModal] = useState(false);
  const [newService, setNewService] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);
  // Estado para los precios por carType
  const [carTypePrices, setCarTypePrices] = useState([]);
  // Estado para edición inline de precios
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [editingPriceValue, setEditingPriceValue] = useState("");

  const handleAddService = () => {
    // Inicializar precios en blanco para cada carType
    setCarTypePrices(carTypes.map((ct) => ({ carTypeId: ct.id, price: "" })));
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setNewService({ name: "", description: "" });
    setCarTypePrices([]);
  };

  const handleChange = (e) => {
    setNewService({ ...newService, [e.target.name]: e.target.value });
  };

  const handlePriceChange = (carTypeId, value) => {
    setCarTypePrices((prev) =>
      prev.map((item) =>
        item.carTypeId === carTypeId ? { ...item, price: value } : item
      )
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Preparar el objeto para el POST
    const precios = carTypePrices
      .filter((item) => item.price && !isNaN(Number(item.price)))
      .map((item) => ({
        carTypeId: item.carTypeId,
        price: Number(item.price),
      }));
    const payload = {
      name: newService.name,
      description: newService.description,
      prices: precios,
    };
    // Aquí deberías hacer la petición POST al backend para crear el servicio y sus precios
    // await axios.post(`${import.meta.env.VITE_API_URL}/service`, payload)
    setTimeout(() => {
      setSaving(false);
      handleCloseModal();
      refetch();
      // console.log(payload);
    }, 1000);
  };

  // Edición inline de precios existentes
  const handleEditClick = (priceId, currentValue) => {
    setEditingPriceId(priceId);
    setEditingPriceValue(currentValue);
  };
  const handleEditValueChange = (e) => {
    setEditingPriceValue(e.target.value);
  };
  const handleEditSave = (priceId) => {
    // Aquí deberías hacer el PATCH/PUT real al backend
    setTimeout(() => {
      setEditingPriceId(null);
      setEditingPriceValue("");
      refetch();
    }, 800);
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-white">Servicios</h1>
        <div className="d-flex gap-2" style={{ minWidth: 240 }}>
          <Button
            variant="success"
            onClick={handleAddService}
            title="Agregar nuevo servicio"
            style={{ minWidth: 120 }}
          >
            <FaPlus />
            <span className="ms-2 d-none d-md-inline">Nuevo</span>
          </Button>
          <Button
            variant="outline-primary"
            onClick={refetch}
            disabled={loading}
            title="Refrescar"
            style={{ minWidth: 120 }}
          >
            <FaSyncAlt className={loading ? "fa-spin" : ""} />
            <span className="ms-2 d-none d-md-inline">Refrescar</span>
          </Button>
        </div>
      </div>
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" /> Cargando...
        </div>
      )}
      {error && <Alert variant="danger">Error al cargar servicios</Alert>}
      {!loading && !error && (
        <div className="d-flex flex-column gap-3">
          {services.length === 0 ? (
            <Alert variant="info">No hay servicios registrados</Alert>
          ) : (
            services.map((service) => {
              // Filtrar precios de este servicio
              const precios = servicePrices.filter(
                (sp) => sp.ServiceId === service.id
              );
              return (
                <Card key={service.id} style={{ width: "100%" }}>
                  <Card.Body>
                    {/* Layout responsive: columna en mobile, fila en desktop */}
                    <div
                      className="d-flex flex-column flex-md-row"
                      style={{ minHeight: "100px" }}
                    >
                      {/* Izquierda: nombre y descripción */}
                      <div
                        style={{ width: "100%", padding: "1rem" }}
                        className="d-md-block d-flex flex-column align-items-start justify-content-center"
                      >
                        <span
                          className="fw-bold mb-2"
                          style={{ fontSize: "1.1rem" }}
                        >
                          {service.name}
                        </span>
                        <span className="text-muted d-none d-md-block">
                          {service.description || "-"}
                        </span>
                      </div>
                      {/* Derecha: tabla de precios */}
                      <div
                        style={{
                          width: "100%",
                          padding: "1rem",
                          paddingTop: 0,
                        }}
                        className="d-md-block"
                      >
                        <Table
                          size="sm"
                          bordered
                          hover
                          responsive
                          className="mb-0"
                        >
                          <thead>
                            <tr>
                              <th>Tipo de auto</th>
                              <th>Precio</th>
                            </tr>
                          </thead>
                          <tbody>
                            {precios.length === 0 ? (
                              <tr>
                                <td
                                  colSpan={2}
                                  className="text-center text-muted"
                                >
                                  Sin precios configurados
                                </td>
                              </tr>
                            ) : (
                              precios.map((precio) => {
                                const carType = carTypes.find(
                                  (ct) => ct.id === precio.CarTypeId
                                );
                                const isEditing = editingPriceId === precio.id;
                                return (
                                  <tr key={precio.id}>
                                    <td>
                                      {carType
                                        ? carType.name
                                        : "Tipo desconocido"}
                                    </td>
                                    <td>
                                      <InputGroup
                                        size="sm"
                                        style={{ maxWidth: "100%" }}
                                      >
                                        {isEditing ? (
                                          <>
                                            <Form.Control
                                              type="number"
                                              min="0"
                                              step="0.01"
                                              value={editingPriceValue}
                                              onChange={handleEditValueChange}
                                              autoFocus
                                            />
                                            <Button
                                              variant="success"
                                              size="sm"
                                              onClick={() =>
                                                handleEditSave(precio.id)
                                              }
                                              title="Guardar"
                                            >
                                              <FaCheck />
                                            </Button>
                                          </>
                                        ) : (
                                          <>
                                            <Form.Control
                                              type="text"
                                              readOnly
                                              value={
                                                precio.price
                                                  ? `$${precio.price}`
                                                  : "-"
                                              }
                                              style={{
                                                background: "transparent",
                                                border: "none",
                                                paddingLeft: 0,
                                                boxShadow: "none",
                                              }}
                                            />
                                            <Button
                                              variant="outline-primary"
                                              size="sm"
                                              onClick={() =>
                                                handleEditClick(
                                                  precio.id,
                                                  precio.price
                                                )
                                              }
                                              title="Editar"
                                            >
                                              <FaEdit />
                                            </Button>
                                          </>
                                        )}
                                      </InputGroup>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              );
            })
          )}
        </div>
      )}
      {/* Modal para agregar servicio */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title>Agregar nuevo servicio</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="serviceName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newService.name}
                onChange={handleChange}
                required
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="serviceDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newService.description}
                onChange={handleChange}
                rows={3}
              />
            </Form.Group>
            <div className="mb-3">
              <Form.Label>Precios por tipo de auto</Form.Label>
              <Table size="sm" bordered hover responsive className="mb-0">
                <thead>
                  <tr>
                    <th>Tipo de auto</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {carTypes.map((carType) => {
                    const priceObj = carTypePrices.find(
                      (p) => p.carTypeId === carType.id
                    ) || { price: "" };
                    return (
                      <tr key={carType.id}>
                        <td>{carType.name}</td>
                        <td style={{ width: 120 }}>
                          <Form.Control
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Precio"
                            value={priceObj.price}
                            onChange={(e) =>
                              handlePriceChange(carType.id, e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button variant="success" type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Servicios;
