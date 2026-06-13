/**
 * Módulo de notificaciones locales — implementación pura con React Native.
 * expo-notifications fue removido de Expo Go en SDK 53+, por eso usamos
 * un sistema de banner animado propio que funciona en cualquier entorno.
 */

// Callback registrado desde App.js para mostrar el banner visual
let _handler = null;

// App.js llama esto una sola vez al montar para conectar el banner
export function setNotificationHandler(fn) {
  _handler = fn;
}

// Función interna que dispara la notificación visual
function dispatch(titulo, cuerpo) {
  if (_handler) {
    _handler({ titulo, cuerpo });
  }
}

// No se necesitan permisos para notificaciones in-app
export async function requestNotificationPermissions() {
  return true;
}

// Notificación al crear un gasto
export async function notifyGastoCreado(descripcion, monto) {
  dispatch('💸 Gasto registrado', `"${descripcion}" por Q${monto.toFixed(2)} fue guardado.`);
}

// Notificación al editar un gasto
export async function notifyGastoActualizado(descripcion) {
  dispatch('✏️ Gasto actualizado', `El gasto "${descripcion}" fue modificado.`);
}

// Notificación al eliminar un gasto
export async function notifyGastoEliminado(descripcion) {
  dispatch('🗑️ Gasto eliminado', `"${descripcion}" fue eliminado del historial.`);
}

// Placeholder del recordatorio diario (disponible en development build con expo-notifications)
export async function scheduleRecordatorioDiario(hora = 20, minuto = 0) {
  const hh = String(hora).padStart(2, '0');
  const mm = String(minuto).padStart(2, '0');
  console.log(`[Recordatorio] Configurado para las ${hh}:${mm} diariamente.`);
}
