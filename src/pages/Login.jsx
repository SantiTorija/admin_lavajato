import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <Container
      fluid
      className="min-vh-100 d-flex align-items-center justify-content-center bg-light"
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={5} xl={4} xxl={3}>
          <Card
            className="shadow-lg border-0"
            style={{ maxWidth: 400, margin: "0 auto" }}
          >
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-1" style={{ letterSpacing: 1 }}>
                  Admin Lavajato
                </h2>
                <span className="text-muted" style={{ fontSize: 14 }}>
                  Panel de administración
                </span>
              </div>
              <Form onSubmit={handleSubmit} autoComplete="off">
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Ingresa tu email"
                    required
                    size="lg"
                    autoFocus
                  />
                </Form.Group>
                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Contraseña"
                    required
                    size="lg"
                  />
                </Form.Group>
                <div className="d-grid">
                  <Button variant="primary" type="submit" size="lg">
                    Iniciar sesión
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
