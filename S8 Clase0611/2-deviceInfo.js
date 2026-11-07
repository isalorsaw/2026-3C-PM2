// src/utils/deviceInfo.js
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

export const getDispositivoInfo = async () => {
  try {
    // 1. Obtener ID Único del Dispositivo según la plataforma
    let uniqueId = '';
    if (Platform.OS === 'android') {
      uniqueId = Application.androidId || 'ANDROID_UNKNOWN_ID';
    } else if (Platform.OS === 'ios') {
      uniqueId = (await Application.getIosIdForVendorAsync()) || 'IOS_UNKNOWN_ID';
    } else {
      uniqueId = 'WEB_OR_OTHER_' + Date.now();
    }

    // 2. Retornar estructura idéntica a la tabla tbl_dispositivo
    return {
      dispo_unique_id: uniqueId,
      dispo_nombre_equipo: Device.deviceName || 'Equipo Desconocido',
      dispo_marca: Device.brand || Platform.OS,
      dispo_modelo: Device.modelName || Device.designName || 'Genérico',
      dispo_so: Platform.OS.toUpperCase(),
      dispo_so_version: String(Device.osVersion || ''),
      dispo_dir_mac: '02:00:00:00:00:00', // Valor estándar cuando la MAC está restringida
    };
  } catch (error) {
    console.error('Error obteniendo info del dispositivo:', error);
    return null;
  }
};