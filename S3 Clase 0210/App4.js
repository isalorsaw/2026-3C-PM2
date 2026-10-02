import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Pressable,
  Image,
  ImageBackground,
  ScrollView,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

// ✅ Datos dummy para FlatList (demostración de lista)
const ACCESOS_RECIENTES = [
  { id: '1', correo: 'admin@empresa.com', fecha: 'Hoy, 09:30' },
  { id: '2', correo: 'usuario@tienda.com', fecha: 'Ayer, 18:45' },
  { id: '3', correo: 'soporte@app.com', fecha: 'Lun, 14:20' },
];

export default function App() {
  // ✅ Estado para controlar la pantalla actual
  const [cargando, setCargando] = useState(true);
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginCargando, setLoginCargando] = useState(false);

  // ✅ Simulamos carga inicial (splash screen)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCargando(false);
    }, 2500); // 2.5 segundos de splash
    return () => clearTimeout(timer);
  }, []);

  // ✅ Validación + loading simulado de login
  const manejarLogin = () => {
    setError('');

    if (!correo.trim() || !password.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (!correo.includes('@')) {
      setError('Ingresa un correo válido');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener mínimo 6 caracteres');
      return;
    }

    setLoginCargando(true);
    setTimeout(() => {
      setLoginCargando(false);
      Alert.alert('✅ Bienvenido', `Sesión iniciada como ${correo}`);
    }, 2000);
  };

  // ============================================
  // ✅ PANTALLA 1: SPLASH / LOADING CON IMAGEN DE FONDO
  // Componentes: ImageBackground, View, Text, ActivityIndicator
  // ============================================
  if (cargando) {
    return (
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1080&q=80' }}
        style={styles.splashBackground}
        resizeMode="cover"
      >
        <View style={styles.splashOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.splashText}>Cargando aplicación...</Text>
        </View>
      </ImageBackground>
    );
  }

  // ============================================
  // ✅ PANTALLA 2: LOGIN FORMULARIO
  // Componentes: ScrollView, KeyboardAvoidingView, TextInput,
  //            Button, TouchableOpacity, Pressable, FlatList, Image
  // ============================================
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1080&q=80' }}
      style={styles.loginBackground}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* ✅ Image como logo */}
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3064/3064197.png' }}
            style={styles.logo}
          />

          <Text style={styles.titulo}>Iniciar Sesión</Text>
          <Text style={styles.subtitulo}>Accede a tu cuenta para continuar</Text>

          {/* ✅ Contenedor semitransparente para legibilidad sobre la imagen */}
          <View style={styles.formCard}>

            {/* ✅ TextInput controlados con estado */}
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* ✅ Mensaje de error dinámico */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* ✅ Button nativo o loading durante login */}
            {loginCargando ? (
              <ActivityIndicator size="small" color="#4A90D9" style={{ marginVertical: 12 }} />
            ) : (
              <View style={styles.buttonContainer}>
                <Button title="INGRESAR" onPress={manejarLogin} color="#4A90D9" />
              </View>
            )}

            {/* ✅ TouchableOpacity para acción secundaria */}
            <TouchableOpacity onPress={() => Alert.alert('Info', 'Registro disponible próximamente')}>
              <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
            </TouchableOpacity>
          </View>

          {/* ✅ FlatList con Pressable para accesos recientes */}
          <Text style={styles.seccionTitulo}>Accesos recientes:</Text>
          <FlatList
            data={ACCESOS_RECIENTES}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <Pressable
                style={styles.accesoItem}
                onPress={() => {
                  setCorreo(item.correo);
                  setPassword('');
                  setError('');
                }}
              >
                <Text style={styles.accesoCorreo}>{item.correo}</Text>
                <Text style={styles.accesoFecha}>{item.fecha}</Text>
              </Pressable>
            )}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

// ✅ StyleSheet centralizado
const styles = StyleSheet.create({
  flex1: { flex: 1 },

  // --- Splash Screen ---
  splashBackground: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  splashOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 40, borderRadius: 20, alignItems: 'center'
  },
  splashText: { color: '#FFF', fontSize: 18, marginTop: 16, fontWeight: '600' },

  // --- Login Screen ---
  loginBackground: { flex: 1 },
  scrollContent: { padding: 24, alignItems: 'center', flexGrow: 1 },
  logo: { width: 80, height: 80, marginTop: 40, marginBottom: 12 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#FFF', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 4 },
  subtitulo: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 24, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 4 },

  // ✅ Card semitransparente para que el formulario sea legible sobre la imagen
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16, padding: 24, width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 8
  },
  input: {
    backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E0E0E0',
    borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 14
  },
  errorText: { color: '#E74C3C', fontSize: 13, marginBottom: 10, fontWeight: '500' },
  buttonContainer: { marginVertical: 8 },
  linkText: { color: '#4A90D9', fontSize: 14, textAlign: 'center', marginTop: 8, textDecorationLine: 'underline' },

  // --- Accesos Recientes ---
  seccionTitulo: { fontSize: 15, fontWeight: '600', color: '#FFF', marginTop: 28, marginBottom: 10, alignSelf: 'flex-start', width: '100%', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 4 },
  accesoItem: {
    backgroundColor: 'rgba(255,255,255,0.88)', padding: 14,
    borderRadius: 10, width: '100%'
  },
  accesoCorreo: { fontSize: 14, fontWeight: '500', color: '#1A1A2E' },
  accesoFecha: { fontSize: 12, color: '#777', marginTop: 2 },
  separator: { height: 8 },
});