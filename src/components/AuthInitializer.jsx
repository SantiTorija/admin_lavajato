import { useEffect, useState } from "react";
import { useAuthRedux } from "../hooks/useAuthRedux";

const AuthInitializer = ({ children }) => {
  const { verifyToken } = useAuthRedux();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await verifyToken();
      } catch {
        // Ignorar errores de verificación inicial
        console.log("Verificación inicial completada");
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []); // Solo se ejecuta una vez

  // Mostrar loading solo durante la inicialización
  if (!isInitialized) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Inicializando aplicación...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthInitializer;
