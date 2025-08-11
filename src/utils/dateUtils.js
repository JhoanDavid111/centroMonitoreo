export const formatDate = (dateString) => {
  if (!dateString) return "No definida";
  
  try {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return dateString; // Devuelve el string original si hay error
  }
};