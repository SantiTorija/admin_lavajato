import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Container,
  Alert,
  Button,
  Form,
  InputGroup,
  Pagination,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useFetchClients from "../hooks/useFetchClients";
import useDeleteClient from "../hooks/useDeleteClient";
import { FaSyncAlt, FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import Loader from "../components/Loader";
import EditClientModal from "../components/EditClientModal";
import AddClientModal from "../components/AddClientModal";
import { useTheme } from "../context/ThemeContext";
import styles from "./clientes.module.css";

const LIMIT_OPTIONS = [10, 20, 50];

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { clients, total, totalPages, loading, error, refetch } =
    useFetchClients(debouncedSearchTerm, page, limit);
  const { deleteClient, loading: deleteLoading } = useDeleteClient();
  const { theme } = useTheme();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  // Debounce para optimizar las búsquedas
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset a página 1 cuando cambia la búsqueda
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

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

      {/* Barra de búsqueda */}
      <div className={`mb-4 ${styles.searchContainer}`}>
        <InputGroup>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre, apellido, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>
      <Card>
        <Card.Body>
          {loading && <Loader />}
          {error && <Alert variant="danger">Error al cargar clientes</Alert>}
          {!loading && !error && (
            <>
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
              <span className="text-muted small">
                Mostrando {startItem}-{endItem} de {total} clientes
              </span>
              <Form.Select
                size="sm"
                value={limit}
                onChange={handleLimitChange}
                style={{ width: "auto" }}
              >
                {LIMIT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt} por página
                  </option>
                ))}
              </Form.Select>
            </div>
            <Table hover responsive>
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
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <Pagination>
                  <Pagination.Prev
                    disabled={page <= 1}
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage((p) => p - 1);
                    }}
                  />
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      const delta = 2;
                      return p === 1 || p === totalPages || (p >= page - delta && p <= page + delta);
                    })
                    .map((p, idx, arr) => (
                      <React.Fragment key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <Pagination.Ellipsis disabled />
                        )}
                        <Pagination.Item
                          active={p === page}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(p);
                          }}
                        >
                          {p}
                        </Pagination.Item>
                      </React.Fragment>
                    ))}
                  <Pagination.Next
                    disabled={page >= totalPages}
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) setPage((p) => p + 1);
                    }}
                  />
                </Pagination>
              </div>
            )}
            </>
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
