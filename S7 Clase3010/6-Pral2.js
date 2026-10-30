// src/pantallas/Home.js
import React,{useState,useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image, 
  ActivityIndicator// 👈 Importante: Componente Image para renderizar archivos
} from 'react-native';

import { showAlert } from '../utils/alert';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) 
{
  // 🖼️ ARRAY DE OPCIONES CON IMÁGENES LOCALES
  // Asegúrate de colocar tus imágenes en la carpeta 'assets/' de tu proyecto
  const menuOptions = [
    {
      id: '1',
      title: 'Gestión Usuarios',
      icon: require('../../assets/icon.png'), // 👈 Archivo local
      screen: 'Usuarios',
      description: 'Mantenimiento de usuarios',
    },
    {
      id: '2',
      title: 'Clientes',
      icon: require('../../assets/icon.png'),
      screen: 'Cliente',
      description: 'Administración de clientes',
    },
    {
      id: '3',
      title: 'Calculadora IMC',
      icon: require('../../assets/icon.png'),
      screen: 'IMC',
      description: 'Cálculo de índice corporal',
    },
    {
      id: '4',
      title: 'Dispositivos',
      icon: require('../../assets/icon.png'),
      screen: 'DispoBus',
      description: 'Lista de unidades/buses',
    },
    {
      id: '5',
      title: 'Foto Perfil',
      icon: require('../../assets/icon.png'),
      screen: 'FotoPerfil',
      description: 'Cambiar imagen de usuario',
    },
    {
      id: '6',
      title: 'Puntos GPS',
      icon: require('../../assets/icon.png'),
      screen: 'MapaPuntosGPS',
      description: 'Mapa de ubicaciones',
    },
    {
      id: '7',
      title: 'Mi Localización',
      icon: require('../../assets/icon.png'),
      screen: 'MiLocalizacion',
      description: 'Ubicación actual',
    },
    {
      id: '8',
      title: 'Generar QR',
      icon: require('../../assets/icon.png'),
      screen: 'GenerarQRScreen',
      description: 'Crear código QR',
    },
    {
      id: '9',
      title: 'Login por QR',
      icon: require('../../assets/icon.png'),
      screen: 'LoginQR',
      description: 'Escanear credenciales',
    },
  ];

  const [usuarioData,setUsuarioData]=useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí puedes realizar cualquier acción adicional al cargar la pantalla, si es necesario.
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try
    {
      const usuarioJson = await AsyncStorage.getItem('user_session');
      const usuarionombre=await AsyncStorage.getItem('user_owner');
      const user_id=await AsyncStorage.getItem('user_id');
      
      const parsedUsuario = usuarioJson ? JSON.parse(usuarioJson) : null;
      const parsedNombre = usuarionombre ? JSON.parse(usuarionombre) : 'Usuario';
      const parsedId = user_id ? JSON.parse(user_id) : null;

      setUsuarioData({
        nombre: parsedNombre,
        usuario: parsedUsuario,
        rol: '',       // Asignado vacío
        sucursal: '',  // Asignado vacío
        id: parsedId,
      });
    }
    catch(error)
    {
        console.error('Error al cargar perfil:', error);
    }
    finally 
    {
      setLoading(false);
    }
  };

  const handleNavigation = (screenName) => {
    if (!screenName) 
    {
      showAlert('Aviso', 'Pantalla no configurada.');
      return;
    }

    try 
    {
      navigation.navigate(screenName);
    } 
    catch (error) 
    {
      showAlert('Módulo en construcción', `La pantalla "${screenName}" aún no está en el Navigator.`);
    }
  };

  const handleCerrarSesion = () => {
    showAlert('Cerrar Sesión', 'Has salido de la aplicación.');
    navigation.replace('Login');
  };

  if (loading || !usuarioData) {
    return (
      <SafeAreaView style={[styles.container, styles.centerLoader]}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      {/* ENCABEZADO CON DATOS DEL USUARIO */}
      <View style={styles.header}>
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {usuarioData.nombre ? usuarioData.nombre.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.userTextDetails}>
            <Text style={styles.welcomeText}>Bienvenido(a),</Text>
            <Text style={styles.userName}>{usuarioData.nombre || 'Usuario'}</Text>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>Rol: {usuarioData.rol || 'General'}</Text>
              <Text style={styles.badgeDivider}>•</Text>
              <Text style={styles.badgeText}>Sucursal: {usuarioData.sucursal || 'Principal'}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleCerrarSesion}>
          <Text style={styles.logoutIcon}>🚪</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* TARJETA INFORMATIVA */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Panel de Control</Text>
          <Text style={styles.summarySubtitle}>
            Selecciona uno de los módulos habilitados para trabajar.
          </Text>
        </View>

        {/* MÓDULOS CON ICONOS DE IMAGEN */}
        <Text style={styles.sectionTitle}>Módulos Disponibles</Text>

        <View style={styles.gridContainer}>
          {menuOptions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.gridCard}
              activeOpacity={0.7}
              onPress={() => handleNavigation(item.screen)}
            >
              <View style={styles.iconCircle}>
                {/* 👈 Renderizado del archivo de imagen */}
                <Image
                  source={item.icon}
                  style={styles.gridIconImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.gridTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.gridDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  userTextDetails: {
    flex: 1,
  },
  welcomeText: {
    color: '#E0E7FF',
    fontSize: 12,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  badgeText: {
    color: '#C7D2FE',
    fontSize: 11,
  },
  badgeDivider: {
    color: '#C7D2FE',
    fontSize: 11,
    marginHorizontal: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 12,
  },
  logoutIcon: {
    fontSize: 18,
  },
  scrollContent: {
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 18,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#4F46E5',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  summarySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  // 👈 Estilo ajustado para la imagen
  gridIconImage: {
    width: 28,
    height: 28,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  gridDescription: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});