import React, { useState } from "react";
import { Table, Card, Container, Badge, Alert, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useFetchClients from "../hooks/useFetchClients";
import useDeleteClient from "../hooks/useDeleteClient";
import { FaSyncAlt, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Loader from "../components/Loader";
import EditClientModal from "../components/EditClientModal";
import AddClientModal from "../components/AddClientModal";
import { useTheme } from "../context/ThemeContext";

const Clientes = () => {
  const { clients, loading, error, refetch } = useFetchClients();
  const { deleteClient, loading: deleteLoading } = useDeleteClient();
  const { theme } = useTheme();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedClient(null);
  };

  const handleClientUpdated = () => {
    // Refrescar la lista de clientes después de actualizar
    refetch();
  };

  const handleNewClient = () => {
    setShowAddClientModal(true);
  };

  const handleCloseAddClientModal = () => {
    setShowAddClientModal(false);
  };

  const handleClientCreated = () => {
    // Refrescar la lista de clientes después de crear uno nuevo
    refetch();
    setShowAddClientModal(false);
  };

  const handleDeleteClient = async (client) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Quieres eliminar a ${client.firstname} ${client.lastname}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      width: "400px",
      background: theme === "dark" ? "#2d3748" : "#ffffff",
      color: theme === "dark" ? "#ffffff" : "#000000",
      customClass: {
        popup: theme === "dark" ? "swal-dark" : "swal-light",
        title: theme === "dark" ? "text-white" : "text-dark",
        content: theme === "dark" ? "text-white" : "text-dark",
        confirmButton: "swal-confirm-button",
        cancelButton: "swal-cancel-button",
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteClient(client.id);
        toast.success("Cliente eliminado exitosamente");
        refetch(); // Refrescar la lista
      } catch (error) {
        toast.error(error.message || "Error al eliminar cliente");
      }
    }
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 ">Clientes</h1>
        <div className="d-flex gap-2">
          <Button
            variant="outline-success"
            onClick={handleNewClient}
            title="Nuevo Cliente"
          >
            <FaPlus />
            <span className="ms-2 d-none d-md-inline">Nuevo</span>
          </Button>
          <Button
            variant="outline-primary"
            onClick={refetch}
            disabled={loading}
            title="Refrescar"
          >
            <FaSyncAlt className={loading ? "fa-spin" : ""} />
            <span className="ms-2 d-none d-md-inline">Refrescar</span>
          </Button>
        </div>
      </div>
      <Card>
        <Card.Body>
          {loading && <Loader />}
          {error && <Alert variant="danger">Error al cargar clientes</Alert>}
          {!loading && !error && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No hay clientes registrados
                    </td>
                  </tr>
                ) : (
                  clients.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>{cliente.firstname || "-"}</td>
                      <td>{cliente.lastname || "-"}</td>
                      <td>{cliente.telefono || cliente.phone || "-"}</td>
                      <td>
                        <div
                          className="d-flex justify-content-around align-items-center"
                          style={{ minWidth: 90 }}
                        >
                          <Button
                            variant="outline-primary"
                            size="sm"
                            title="Editar"
                            onClick={() => handleEditClient(cliente)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            title="Eliminar"
                            onClick={() => handleDeleteClient(cliente)}
                            disabled={deleteLoading}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Modal para editar cliente */}
      <EditClientModal
        show={showEditModal}
        onHide={handleCloseEditModal}
        client={selectedClient}
        onClientUpdated={handleClientUpdated}
      />

      {/* Modal para agregar cliente */}
      <AddClientModal
        show={showAddClientModal}
        onHide={handleCloseAddClientModal}
        onClientCreated={handleClientCreated}
      />
    </Container>
  );
};

export default Clientes;
