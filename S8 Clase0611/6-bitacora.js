// src/utils/bitacora.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDispositivoInfo } from './deviceInfo';

// Ajusta la URL a la ubicación de tu API en el servidor
const API_BITACORA = 'https://bonaquian.com/clases/profesor/movil/api/bitacora/save_bitacora.php';

/**
 * Registra un evento en la bitácora del sistema.
 * 
 * @param {Object} params - Parámetros del evento.
 * @param {string} params.accion - Nombre de la acción (ej: 'LOGIN', 'CREAR_USUARIO', 'DESCARGAR_REPORT'). Obligatorio.
 * @param {string} [params.tablaAfectada] - Nombre de la tabla afectada (ej: 'tbl_usuario'). Opcional.
 * @param {string|number} [params.registroId] - ID del registro afectado. Opcional.
 * @param {Object} [params.datosAnteriores] - Objeto o array con datos previos a la modificación. Opcional.
 * @param {Object} [params.datosNuevos] - Objeto o array con datos nuevos depositados. Opcional.
 * @param {'EXITOSO'|'FALLIDO'} [params.estado='EXITOSO'] - Estado del evento. Opcional.
 * @param {number} [params.usuarioId] - ID de usuario explícito. Si no se envía, lo toma de AsyncStorage. Opcional.
 */
export const registrarBitacora = async ({
  accion,
  tablaAfectada = null,
  registroId = null,
  datosAnteriores = null,
  datosNuevos = null,
  estado = 'EXITOSO',
  usuarioId = null,
}) => {
  try {
    // 1. Si no se envía usuarioId, obtenerlo del AsyncStorage
    let userId = usuarioId;
    if (!userId) {
      const storedId = await AsyncStorage.getItem('user_id');
      userId = storedId ? JSON.parse(storedId) : null;
    }

    // 2. Obtener el ID único del dispositivo
    const dispoInfo = await getDispositivoInfo();
    const dispoUniqueId = dispoInfo?.dispo_unique_id || null;

    // 3. Estructurar el payload
    const payload = {
      usuario_id: userId,
      dispo_unique_id: dispoUniqueId,
      bitacora_accion: accion,
      tabla_afectada: tablaAfectada,
      registro_id: registroId ? String(registroId) : null,
      datos_anteriores: datosAnteriores,
      datos_nuevos: datosNuevos,
      bitacora_estado: estado,
    };

    // 4. Enviar al backend en segundo plano (sin bloquear al usuario)
    fetch(API_BITACORA, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.log('Error en fetch bitácora:', err.message);
    });

  } catch (error) {
    console.log('Error al procesar registro de bitácora:', error.message);
  }
};