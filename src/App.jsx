import AppRoutes from "./routes";
import AuthInitializer from "./components/AuthInitializer";
import "./App.css";

function App() {
  return (
    <AuthInitializer>
      <AppRoutes />
    </AuthInitializer>
  );
}

export default App;
