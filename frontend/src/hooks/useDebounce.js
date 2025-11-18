import { useState, useEffect } from 'react';

/**
 * Hook custom para aplicar debounce a un valor
 * Útil para evitar requests excesivos al escribir en inputs
 *
 * @param {*} value - Valor a aplicar debounce
 * @param {number} delay - Delay en milisegundos (default: 500ms)
 * @returns {*} Valor con debounce aplicado
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   // Este efecto solo se ejecuta después de 500ms de que el usuario dejó de escribir
 *   if (debouncedSearchTerm) {
 *     fetchResults(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 */
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Setear un timer para actualizar el valor después del delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancelar el timer si el valor cambia antes del delay
    // o si el componente se desmonta
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
