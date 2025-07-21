import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

const EMAILS_KEY = "admin_lavajato_emails";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(EMAILS_KEY)) || [];
    } catch {
      return [];
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Guardar email si no existe
    if (email && !emails.includes(email)) {
      const newEmails = [email, ...emails].slice(0, 10); // máximo 10 sugerencias
      setEmails(newEmails);
      localStorage.setItem(EMAILS_KEY, JSON.stringify(newEmails));
    }
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
                    placeholder="ingrese su email"
                    required
                    size="lg"
                    autoFocus
                    list={emails.length > 0 ? "email-suggestions" : undefined}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {emails.length > 0 && (
                    <datalist id="email-suggestions">
                      {emails.map((em, i) => (
                        <option value={em} key={i} />
                      ))}
                    </datalist>
                  )}
                </Form.Group>
                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="ingrese contraseña"
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
