import { PuffLoader } from "react-spinners";

const Loader = () => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem",
      zIndex: 9999,
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      background: "rgba(24, 26, 27, 0.6)",
    }}
  >
    <PuffLoader color="#0d6efd" size={60} speedMultiplier={0.8} />
  </div>
);

export default Loader;
