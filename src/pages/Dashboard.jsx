import { Card, Container } from "react-bootstrap";

const Dashboard = () => {
  return (
    <Container fluid className="py-4">
      <h1 className="h3 mb-4">Dashboard</h1>
      <Card>
        <Card.Body>
          <p className="text-muted">Bienvenido al panel de administración</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;
