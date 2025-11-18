/**
 * Formatea un número como moneda colombiana (COP)
 * @param {number} amount - Cantidad a formatear
 * @returns {string} Cantidad formateada (ej: "$850.000.000")
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0';

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
