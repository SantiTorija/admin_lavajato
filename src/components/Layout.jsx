import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Navbar, Container, Button, Dropdown } from "react-bootstrap";
import {
  FaBell,
  FaUserCircle,
  FaInfoCircle,
  FaBars,
  FaSun,
  FaMoon,
  FaSignOutAlt,
} from "react-icons/fa";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuthRedux } from "../hooks/useAuthRedux";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuthRedux();

  // Detectar si es móvil
  const isMobile = typeof window !== "undefined" && window.innerWidth < 992;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Overlay para móvil */}
      {sidebarOpen && isMobile && (
        <div
          className="sidebar-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: 1039,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className="main-content"
        style={{
          marginLeft: 0,
        }}
      >
        <Navbar
          style={{
            minHeight: "5rem",
            background: "var(--color-bg-secondary)",
            color: "var(--color-text)",
          }}
          className="shadow-sm px-3"
        >
          <Container fluid className="justify-content-between">
            {/* Botón hamburguesa solo en móvil */}
            <Button
              style={{
                border: "none",
                background: "transparent",
                color: "var(--color-text)",
              }}
              className="me-2 d-lg-none"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <FaBars size={22} />
            </Button>
            <div className="d-flex align-items-center gap-3 ms-auto">
              {/* Botón de tema solo en mobile */}
              <Button
                variant="link"
                className="d-lg-none p-0"
                style={{ color: "var(--color-text)", fontSize: 22 }}
                onClick={toggleTheme}
                aria-label="Cambiar tema"
              >
                {theme === "dark" ? <FaSun /> : <FaMoon />}
              </Button>

              {/* Dropdown del usuario */}
              {/* <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  className="p-0 d-flex align-items-center"
                  style={{
                    color: "var(--color-text)",
                    textDecoration: "none",
                    background: "transparent",
                    border: "none",
                  }}
                >
                  <FaUserCircle size={26} />
                  <span className="ms-2 d-none d-md-inline">
                    {user?.name || "Usuario"}
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu
                  style={{
                    background: "var(--color-bg-secondary)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <Dropdown.Header
                    style={{ color: "var(--color-text)" }}
                    className="fw-semibold"
                  >
                    {user?.email || "usuario@ejemplo.com"}
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={handleLogout}
                    style={{ color: "var(--color-text)" }}
                    className="d-flex align-items-center gap-2"
                  >
                    <FaSignOutAlt />
                    Cerrar sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown> */}

              <FaBell
                size={22}
                style={{ cursor: "pointer", color: "var(--color-text)" }}
              />
            </div>
          </Container>
        </Navbar>
        <main
          style={{
            background: "var(--color-bg)",
            minHeight: "calc(100vh - 64px)",
            marginLeft: 0,
            color: "var(--color-text)",
          }}
          className="content-area"
        >
          <Outlet />
        </main>
      </div>
      {/* Estilo para margen en escritorio */}
      <style>{`
        @media (min-width: 992px) {
          .main-content {
            margin-left: 250px !important;
          }
          .content-area {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
