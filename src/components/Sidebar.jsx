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
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const SidebarContent = ({ onClose }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

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
      <div
        style={{ minHeight: "5rem" }}
        className="d-flex align-items-center justify-content-center py-2 border-bottom border-secondary"
      >
        <FaUser className="me-2" />
        <span>Marcos Gonzalez</span>
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
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/logout"
            className="d-flex align-items-center sidebar-link bg-transparent border-0"
            onClick={onClose}
          >
            <FaSignOutAlt className="me-2" /> Cerrar sesión
          </Nav.Link>
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
