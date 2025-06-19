import {
  Table,
  Card,
  Container,
  Badge,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import useFetchClients from "../hooks/useFetchClients";
import { FaSyncAlt, FaEdit, FaTrash } from "react-icons/fa";

const Clientes = () => {
  const { clients, loading, error, refetch } = useFetchClients();

  return (
    <Container fluid className="py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 ">Clientes</h1>
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
      <Card>
        <Card.Body>
          {loading && (
            <div className="text-center my-4">
              <Spinner animation="border" variant="primary" /> Cargando...
            </div>
          )}
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
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            title="Eliminar"
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
    </Container>
  );
};

export default Clientes;
