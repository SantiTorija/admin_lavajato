import { useRef } from "react";
import { useSelector } from "react-redux";
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
import DashboardCancellationModal from "../components/DashboardCancellationModal";
import { useTheme } from "../context/ThemeContext";

const COLORS = ["#0d6efd", "#198754", "#dc3545", "#ffc107", "#6f42c1"];

const tooltipStyle = (isDark) => ({
  backgroundColor: isDark ? "#23272b" : "#fff",
  border: `1px solid ${isDark ? "#343a40" : "#dee2e6"}`,
  color: isDark ? "#f8f9fa" : "#181a1b",
  padding: "8px 12px",
  borderRadius: "6px",
  boxShadow: isDark
    ? "0 2px 12px rgba(0,0,0,0.4)"
    : "0 2px 8px rgba(0,0,0,0.15)",
});

/** Recharts: percent 0–1. Evita "0%" cuando el % real es mayor que 0 pero redondea a 0 entero */
const formatPiePercent = (percent) => {
  if (percent == null || Number.isNaN(percent)) return "0%";
  const pct = percent * 100;
  if (pct > 0 && Math.round(pct) === 0) return "menos de 1%";
  return `${Math.round(pct)}%`;
};

/** Texto sobre SVG (Recharts) no siempre resuelve bien variables CSS; alineado a index.css body.theme-* */
const pieChartLabelColor = (isDark) => (isDark ? "#f8f9fa" : "#181a1b");

const Dashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const token = useSelector((state) => state.auth.token);
  const api = import.meta.env.VITE_API_URL;
  const { data, loading, error } = useFetchDashboard();
  const cancellationModalRef = useRef(null);

  if (loading) return <Loader />;
  if (error) {
    return (
      <Container fluid className="py-4">
        <div className="text-danger">Error al cargar el dashboard</div>
      </Container>
    );
  }

  const {
    kpis,
    revenueByMonth,
    ordersByStatus,
    topServices,
    popularSlots,
    clientsByMonth,
  } = data;

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

      <Row className="g-3 mb-4">
        <Col xs={12} md={6}>
          <Card
            className="h-100 border-0 shadow-sm"
            role="button"
            tabIndex={0}
            onClick={() => cancellationModalRef.current?.open("today")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                cancellationModalRef.current?.open("today");
            }}
            style={{ cursor: "pointer" }}
          >
            <Card.Body className="py-3">
              <small className="dashboard-kpi-label d-block">
                Canceladas por clientes (turno hoy)
              </small>
              <h4 className="mb-0 mt-1">{kpis?.canceladasHoyCliente ?? "-"}</h4>
              <small className="text-muted">Ver detalle</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card
            className="h-100 border-0 shadow-sm"
            role="button"
            tabIndex={0}
            onClick={() => cancellationModalRef.current?.open("week")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                cancellationModalRef.current?.open("week");
            }}
            style={{ cursor: "pointer" }}
          >
            <Card.Body className="py-3">
              <small className="dashboard-kpi-label d-block">
                Canceladas por clientes (turno esta semana)
              </small>
              <h4 className="mb-0 mt-1">
                {kpis?.canceladasSemanaCliente ?? "-"}
              </h4>
              <small className="text-muted">Ver detalle</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <DashboardCancellationModal ref={cancellationModalRef} apiUrl={api} token={token} />

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
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#0d6efd"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#0d6efd"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--color-chart-grid)"
                    />
                    <XAxis
                      dataKey="label"
                      stroke="var(--color-chart-axis)"
                      fontSize={12}
                    />
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
              <div
                className="dashboard-chart dashboard-chart-pie"
                style={{ height: 200 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ordersByStatus || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={76}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      label={({ percent }) => formatPiePercent(percent)}
                      labelStyle={{
                        fill: pieChartLabelColor(isDark),
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {(ordersByStatus || []).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle(isDark)}
                      formatter={(value, name, item) => {
                        const p = item?.payload?.percent ?? item?.percent;
                        if (typeof p === "number" && !Number.isNaN(p)) {
                          return [
                            `${value} (${formatPiePercent(p)})`,
                            "Cantidad",
                          ];
                        }
                        return [value, name];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div
                className="d-flex flex-wrap gap-3 justify-content-center align-items-center pt-2 px-1 small"
                role="list"
                aria-label="Leyenda órdenes por estado"
              >
                {(ordersByStatus || []).map((entry, i) => (
                  <div
                    key={`${entry.name}-${i}`}
                    className="d-flex align-items-center gap-2"
                    role="listitem"
                    style={{ color: "var(--color-text)" }}
                  >
                    <span
                      aria-hidden
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 2,
                        backgroundColor: COLORS[i % COLORS.length],
                        flexShrink: 0,
                        border: "1px solid var(--color-border)",
                      }}
                    />
                    <span>{entry.name}</span>
                  </div>
                ))}
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
                      <linearGradient
                        id="colorClients"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#198754"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#198754"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--color-chart-grid)"
                    />
                    <XAxis
                      dataKey="label"
                      stroke="var(--color-chart-axis)"
                      fontSize={12}
                    />
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
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--color-chart-grid)"
                    />
                    <XAxis
                      type="number"
                      stroke="var(--color-chart-axis)"
                      fontSize={12}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="var(--color-chart-axis)"
                      fontSize={12}
                      width={55}
                    />
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
                    <BarChart
                      data={popularSlots}
                      margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--color-chart-grid)"
                      />
                      <XAxis
                        dataKey="name"
                        stroke="var(--color-chart-axis)"
                        fontSize={12}
                      />
                      <YAxis stroke="var(--color-chart-axis)" fontSize={12} />
                      <Tooltip contentStyle={tooltipStyle(isDark)} />
                      <Bar
                        dataKey="value"
                        fill="#6f42c1"
                        radius={[4, 4, 0, 0]}
                      />
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
