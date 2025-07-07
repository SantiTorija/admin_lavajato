import { Nav, Offcanvas } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaCogs,
  FaSignOutAlt,
  FaBoxOpen,
  FaChevronDown,
  FaUser,
  FaMoon,
  FaSun,
  FaUserCircle,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useAuthRedux } from "../hooks/useAuthRedux";
import { useState } from "react";

const SidebarContent = ({ onClose }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuthRedux();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <div
      className="d-flex flex-column vh-100 p-0"
      style={{
        width: 250,
        minHeight: "100vh",
        background: "var(--color-bg-secondary)",
        color: "var(--color-text)",
      }}
    >
      {/* Aca debe ir el boton de usuario */}
      <div className="d-flex flex-column align-items-center py-3 border-bottom position-relative">
        <FaUserCircle size={38} style={{ color: "var(--color-text)" }} />
        <span
          className="fw-semibold mt-2"
          style={{ color: "var(--color-text)" }}
        >
          {user?.name || "Usuario"}
        </span>
        <button
          className="btn btn-link p-0 mt-1 d-flex align-items-center gap-1"
          style={{
            fontSize: 15,
            textDecoration: "none",
            color: "var(--color-text)",
          }}
          onClick={() => setUserDropdownOpen((open) => !open)}
          aria-label="Abrir menú de usuario"
        >
          <FaChevronDown
            style={{
              transition: "transform 0.2s",
              transform: userDropdownOpen ? "rotate(180deg)" : "none",
            }}
          />
        </button>
        {userDropdownOpen && (
          <div
            className="position-absolute"
            style={{
              top: "100%",
              left: 0,
              right: 0,
              background: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)",
              zIndex: 10,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.8rem",
                color: "var(--color-text)",
                padding: "0.5rem 0.5rem 0.2rem 0.5rem",
                textAlign: "center",
              }}
            >
              {user?.email || "usuario@ejemplo.com"}
            </div>
            <button
              className="btn btn-link w-100 text-danger d-flex align-items-center gap-2 justify-content-center py-2"
              style={{ fontSize: 15, textDecoration: "none" }}
              onClick={logout}
            >
              <FaSignOutAlt />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
      <Nav
        className="flex-column pt-3 px-2"
        variant="pills"
        style={{ flex: 1 }}
      >
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/"
            active={location.pathname === "/"}
            className="d-flex mb-2 align-items-center sidebar-link bg-transparent border-0"
            onClick={onClose}
          >
            <FaHome className="me-2" /> Dashboard
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/clientes"
            active={location.pathname === "/clientes"}
            className="d-flex mb-2 align-items-center sidebar-link bg-transparent border-0"
            onClick={onClose}
          >
            <FaUsers className="me-2" /> Clientes
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/agenda"
            active={location.pathname === "/agenda"}
            className="d-flex mb-2 align-items-center sidebar-link bg-transparent border-0"
            onClick={onClose}
          >
            <FaCalendarAlt className="me-2" /> Agenda
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/servicios"
            active={location.pathname === "/servicios"}
            className="d-flex mb-2 align-items-center sidebar-link bg-transparent border-0"
            onClick={onClose}
          >
            <FaCogs className="me-2" /> Servicios
          </Nav.Link>
        </Nav.Item>
        {/* Ejemplo de submenú */}

        <Nav.Item className="mt-auto">
          <button
            className="btn sidebar-theme-btn w-100 d-flex align-items-center justify-content-center mb-2"
            onClick={toggleTheme}
            type="button"
          >
            {theme === "dark" ? (
              <FaSun className="me-2" />
            ) : (
              <FaMoon className="me-2" />
            )}
            {theme === "dark" ? "Modo claro" : "Modo oscuro"}
          </button>
        </Nav.Item>
      </Nav>
    </div>
  );
};

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {/* Sidebar fijo solo en escritorio */}
      <div
        className="d-none d-lg-flex flex-column"
        style={{ position: "fixed", left: 0, top: 0, zIndex: 1040 }}
      >
        <SidebarContent />
      </div>
      {/* Offcanvas solo en móvil */}
      <Offcanvas
        show={open}
        onHide={onClose}
        backdrop
        scroll={false}
        placement="start"
        className=" d-lg-none"
      >
        <Offcanvas.Body className="p-0">
          <SidebarContent onClose={onClose} />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
