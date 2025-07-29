/**
 * Hook para formatear fechas en español
 * Convierte fechas de formato DD/MM/YYYY a "DD de MMMM, YYYY"
 *
 * @param {string} dateString - Fecha en formato DD/MM/YYYY
 * @returns {string} - Fecha formateada en español
 */
export const useFormatDate = () => {
  const formatDate = (dateString) => {
    if (!dateString) return "";

    // Si ya está en formato ISO o Date object, convertirlo
    let date;
    if (dateString.includes("/")) {
      // Formato DD/MM/YYYY
      const [day, month, year] = dateString.split("/");
      date = new Date(year, month - 1, day);
    } else {
      // Formato ISO o Date object
      date = new Date(dateString);
    }

    // Validar que la fecha sea válida
    if (isNaN(date.getTime())) {
      return dateString;
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
