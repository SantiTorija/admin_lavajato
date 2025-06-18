import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Navbar, Container, Button } from "react-bootstrap";
import { FaBell, FaUserCircle, FaInfoCircle, FaBars } from "react-icons/fa";
import { useState } from "react";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Detectar si es móvil
  const isMobile = typeof window !== "undefined" && window.innerWidth < 992;

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
              <FaUserCircle
                size={26}
                style={{ cursor: "pointer", color: "var(--color-text)" }}
              />
              <FaBell
                size={22}
                style={{ cursor: "pointer", color: "var(--color-text)" }}
              />
            </div>
          </Container>
        </Navbar>
        <main
          style={{
            padding: "32px 24px",
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
