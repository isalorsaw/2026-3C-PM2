// src/utils/alert.js
import { Alert, Platform } from 'react-native';

/**
 * Muestra una alerta compatible con iOS, Android y Web.
 * @param {string} title - Título de la alerta.
 * @param {string} message - Mensaje secundario o cuerpo del error.
 */
export const showAlert = (title, message) => {
    if (Platform.OS === 'web') 
    {
        window.alert(`${title}\n\n${message || ''}`);
    } 
    else 
    {
        Alert.alert(title, message);
    }
};