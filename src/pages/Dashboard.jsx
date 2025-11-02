import { Card, Container } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useFetchNewClientsByMonth from "../hooks/useFetchNewClientsByMonth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { data, loading, error } = useFetchNewClientsByMonth();
  return (
    <Container fluid className="py-4">
      <h1 className="h3 mb-4">Dashboard</h1>
      <div style={{ minHeight: 300 }}>
        <Card
          style={{
            width: "50%",
            minWidth: 220,
            maxWidth: 400,
            height: 240,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 0,
          }}
        >
          <Card.Body
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 16,
            }}
          >
            <h5 className="mb-3">Crecimiento de clientes</h5>
            {loading && <div>Cargando gráfico...</div>}
            {error && <div>Error al cargar datos</div>}
            {data && (
              <div style={{ width: "100%", minWidth: 180, height: 120 }}>
                <Line
                  data={{
                    labels: Object.keys(data),
                    datasets: [
                      {
                        data: Object.values(data),
                        borderColor: "#007bff",
                        backgroundColor: "rgba(0,123,255,0.1)",
                        tension: 0.3,
                        fill: true,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      title: { display: false },
                    },
                    scales: {
                      y: { beginAtZero: true, precision: 0 },
                    },
                  }}
                  height={60}
                />
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Dashboard;
