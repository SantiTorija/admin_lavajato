import { Card, Container, Row, Col } from "react-bootstrap";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useFetchDashboard from "../hooks/useFetchDashboard";
import Loader from "../components/Loader";
import { useTheme } from "../context/ThemeContext";

const COLORS = ["#0d6efd", "#198754", "#dc3545", "#ffc107", "#6f42c1"];

const tooltipStyle = (isDark) => ({
  backgroundColor: isDark ? "#23272b" : "#fff",
  border: `1px solid ${isDark ? "#343a40" : "#dee2e6"}`,
  color: isDark ? "#f8f9fa" : "#181a1b",
  padding: "8px 12px",
  borderRadius: "6px",
  boxShadow: isDark ? "0 2px 12px rgba(0,0,0,0.4)" : "0 2px 8px rgba(0,0,0,0.15)",
});

const Dashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { data, loading, error } = useFetchDashboard();

  if (loading) return <Loader />;
  if (error) {
    return (
      <Container fluid className="py-4">
        <div className="text-danger">Error al cargar el dashboard</div>
      </Container>
    );
  }

  const { kpis, revenueByMonth, ordersByStatus, topServices, popularSlots, clientsByMonth } = data;

  const clientsChartData = clientsByMonth
    ? Object.entries(clientsByMonth).map(([label, value]) => ({ label, value }))
    : [];

  return (
    <Container fluid className="py-4">
      <h1 className="h3 mb-4">Dashboard</h1>

      {/* KPI Cards */}
      <Row className="g-3 mb-4">
        <Col xs={6} md={4} lg={2}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="py-3">
              <small className="dashboard-kpi-label d-block">
                Reservas programadas para hoy
              </small>
              <h4 className="mb-0 mt-1">{kpis?.reservasHoy ?? "-"}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={4} lg={2}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="py-3">
              <small className="dashboard-kpi-label d-block">
                Reservas en los próximos 7 días
              </small>
              <h4 className="mb-0 mt-1">{kpis?.reservasSemana ?? "-"}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={4} lg={2}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="py-3">
              <small className="dashboard-kpi-label d-block">
                Ingresos de órdenes completadas este mes
              </small>
              <h4 className="mb-0 mt-1">${kpis?.ingresosMes ?? "0"}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={4} lg={2}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="py-3">
              <small className="dashboard-kpi-label d-block">
                Clientes registrados este mes
              </small>
              <h4 className="mb-0 mt-1">{kpis?.clientesNuevosMes ?? "-"}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={4} lg={2}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="py-3">
              <small className="dashboard-kpi-label d-block">
                % de reservas con faltó sin aviso
              </small>
              <h4 className="mb-0 mt-1">{kpis?.tasaNoShow ?? "0"}%</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={4} lg={2}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="py-3">
              <small className="dashboard-kpi-label d-block">
                Clientes con acceso bloqueado
              </small>
              <h4 className="mb-0 mt-1">{kpis?.clientesVetados ?? "-"}</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row className="g-3 mb-4">
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-transparent border-0 pt-3">
              <h6 className="mb-0">Ingresos por mes</h6>
            </Card.Header>
            <Card.Body>
              <div className="dashboard-chart" style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueByMonth || []}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0d6efd" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" />
                    <XAxis dataKey="label" stroke="var(--color-chart-axis)" fontSize={12} />
                    <YAxis stroke="var(--color-chart-axis)" fontSize={12} />
                    <Tooltip
                      contentStyle={tooltipStyle(isDark)}
                      formatter={(v) => [`$${v}`, "Ingresos"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#0d6efd"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-transparent border-0 pt-3">
              <h6 className="mb-0">Órdenes por estado</h6>
            </Card.Header>
            <Card.Body>
              <div className="dashboard-chart" style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ordersByStatus || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {(ordersByStatus || []).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle(isDark)}
                      formatter={(v) => [v, "Cantidad"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row className="g-3 mb-4">
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-transparent border-0 pt-3">
              <h6 className="mb-0">Crecimiento de clientes</h6>
            </Card.Header>
            <Card.Body>
              <div className="dashboard-chart" style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={clientsChartData}>
                    <defs>
                      <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#198754" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#198754" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" />
                    <XAxis dataKey="label" stroke="var(--color-chart-axis)" fontSize={12} />
                    <YAxis stroke="var(--color-chart-axis)" fontSize={12} />
                    <Tooltip contentStyle={tooltipStyle(isDark)} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#198754"
                      fillOpacity={1}
                      fill="url(#colorClients)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-transparent border-0 pt-3">
              <h6 className="mb-0">Servicios más vendidos</h6>
            </Card.Header>
            <Card.Body>
              <div className="dashboard-chart" style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topServices || []}
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" />
                    <XAxis type="number" stroke="var(--color-chart-axis)" fontSize={12} />
                    <YAxis type="category" dataKey="name" stroke="var(--color-chart-axis)" fontSize={12} width={55} />
                    <Tooltip contentStyle={tooltipStyle(isDark)} />
                    <Bar dataKey="value" fill="#0d6efd" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Horarios populares */}
      {popularSlots && popularSlots.length > 0 && (
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-transparent border-0 pt-3">
                <h6 className="mb-0">Horarios más populares</h6>
              </Card.Header>
              <Card.Body>
                <div className="dashboard-chart" style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={popularSlots} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" />
                      <XAxis dataKey="name" stroke="var(--color-chart-axis)" fontSize={12} />
                      <YAxis stroke="var(--color-chart-axis)" fontSize={12} />
                      <Tooltip contentStyle={tooltipStyle(isDark)} />
                      <Bar dataKey="value" fill="#6f42c1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Dashboard;
