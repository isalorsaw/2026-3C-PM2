// src/utils/debug.js
import { showAlert } from './alert';

/**
 * Lee la respuesta de un fetch y la muestra detallada en un alert.
 * @param {Response} response - Objeto Response retornado por fetch
 * @param {string} tag - Nombre opcional para identificar la petición (ej: 'LOGIN')
 */
export const showResponseAlert = async (response, tag = 'API') => {
    try 
    {
    
            // 1. Clonar la respuesta (para no consumir el body si necesitas usarlo luego)
            const clonedResponse = response.clone();
    
            // 2. Leer como texto plano primero
            const rawText = await clonedResponse.text();

            // 3. Intentar parsear a JSON
            let parsedJson = null;
            try 
            {
                parsedJson = JSON.parse(rawText);
            } 
            catch (e) 
            {
                // No era JSON válido (posible error HTML de PHP)
            }

            // 4. Armar el objeto estructurado
            const report = {status: response.status,
                ok: response.ok,
                data: parsedJson || rawText,};

    // 5. Mostrar en pantalla
            showAlert(`[${tag}] HTTP ${response.status}`,
            JSON.stringify(report, null, 2)
            );

            return parsedJson; // Opcional: devuelve el JSON listo para usar
    } 
    catch (err) 
    {
        showAlert(`[${tag}] Error al leer respuesta`, err.message);
        return null;
    }
};