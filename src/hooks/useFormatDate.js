/**
 * Hook para formatear fechas en español
 * Convierte fechas de formato DD/MM/YYYY a "DD de MMMM, YYYY"
 *
 * @param {string|Date} dateInput - Fecha en formato DD/MM/YYYY o objeto Date
 * @returns {string} - Fecha formateada en español
 */
export const useFormatDate = () => {
  const formatDate = (dateInput) => {
    if (!dateInput) return "";

    // Si ya es un objeto Date, usarlo directamente
    let date;
    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === "string") {
      // Si es string, verificar el formato
      if (dateInput.includes("/")) {
        // Formato DD/MM/YYYY
        const [day, month, year] = dateInput.split("/");
        date = new Date(year, month - 1, day);
      } else {
        // Formato ISO
        date = new Date(dateInput);
      }
    } else {
      // Para cualquier otro tipo, intentar crear Date
      date = new Date(dateInput);
    }

    // Validar que la fecha sea válida
    if (isNaN(date.getTime())) {
      return String(dateInput);
    }

    // Nombres de meses en español
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} de ${month}, ${year}`;
  };

  return { formatDate };
};
