import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator
} from "react-native";

export default function HooksEjemplo() {
  // ============================================
  // PARTE 1: useState básico
  // ============================================
  const [contador, setContador] = useState(0);

  // ============================================
  // PARTE 2: useState con formulario
  // ============================================
  const [nuevaTarea, setNuevaTarea] = useState("");

  // ============================================
  // PARTE 3: useState con lista
  // ============================================
  const [tareas, setTareas] = useState([]);

  // ============================================
  // PARTE 4: useState para estado de carga
  // ============================================
  const [cargando, setCargando] = useState(true);

  // ============================================
  // PARTE 5: useEffect al montar el componente
  // Simulamos que traemos tareas desde una API
  // ============================================
  useEffect(() => {
    console.log("El componente se montó");

    // Simulamos una petición que tarda 3 segundos
    setTimeout(() => {
      const tareasIniciales = [
        { id: "1", titulo: "Aprender useState" },
        { id: "2", titulo: "Aprender useEffect" },
        { id: "3", titulo: "Hacer una app en React Native" }
      ];

      setTareas(tareasIniciales);
      setCargando(false);
    }, 3000);

    // Limpieza del efecto
    return () => {
      console.log("El componente se desmontó o el efecto se limpió");
    };
  }, []);

  // ============================================
  // PARTE 6: useEffect con dependencia
  // Se ejecuta cada vez que cambia el contador
  // ============================================
  useEffect(() => {
    console.log("El contador cambió:", contador);
  }, [contador]);

  // ============================================
  // PARTE 7: useEffect con intervalo
  // Contador automático
  // ============================================
  const [contadorAutomatico, setContadorAutomatico] = useState(0);
  const [intervaloActivo, setIntervaloActivo] = useState(false);

  useEffect(() => {
    if (!intervaloActivo) return;

    console.log("Intervalo iniciado");

    const intervalo = setInterval(() => {
      setContadorAutomatico((valorAnterior) => valorAnterior + 1);
    }, 1000);

    // Limpieza obligatoria del intervalo
    return () => {
      console.log("Intervalo limpiado");
      clearInterval(intervalo);
    };
  }, [intervaloActivo]);

  // ============================================
  // Funciones
  // ============================================
  const aumentarContador = () => {
    setContador(contador + 1);
  };

  const reiniciarContador = () => {
    setContador(0);
  };

  const agregarTarea = () => {
    if (nuevaTarea.trim() === "") {
      return;
    }

    const nueva = {
      id: Date.now().toString(),
      titulo: nuevaTarea
    };

    setTareas([...tareas, nueva]);
    setNuevaTarea("");
  };

  const eliminarTarea = (id) => {
    setTareas(tareas.filter((tarea) => tarea.id !== id));
  };

  // ============================================
  // Render
  // ============================================
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Módulo 4: Hooks y estado</Text>

      {/* Contador manual */}
      <View style={styles.card}>
        <Text style={styles.subtitulo}>1. useState: contador manual</Text>
        <Text style={styles.textoGrande}>Contador: {contador}</Text>

        <View style={styles.filaBotones}>
          <Button title="Sumar" onPress={aumentarContador} />
          <Button title="Reiniciar" onPress={reiniciarContador} color="#E74C3C" />
        </View>
      </View>

      {/* Contador automático */}
      <View style={styles.card}>
        <Text style={styles.subtitulo}>2. useEffect: contador automático</Text>
        <Text style={styles.textoGrande}>
          Automático: {contadorAutomatico}
        </Text>

        <View style={styles.filaBotones}>
          <Button
            title={intervaloActivo ? "Detener" : "Iniciar"}
            onPress={() => setIntervaloActivo(!intervaloActivo)}
            color={intervaloActivo ? "#E74C3C" : "#2ECC71"}
          />
        </View>
      </View>

      {/* Formulario de tareas */}
      <View style={styles.card}>
        <Text style={styles.subtitulo}>3. useState + lista de tareas</Text>

        <TextInput
          style={styles.input}
          placeholder="Escribe una tarea"
          value={nuevaTarea}
          onChangeText={setNuevaTarea}
        />

        <Button title="Agregar tarea" onPress={agregarTarea} />
      </View>

      {/* Lista de tareas */}
      <View style={styles.card}>
        <Text style={styles.subtitulo}>4. useEffect: carga simulada</Text>

        {cargando ? (
          <View style={styles.cargando}>
            <ActivityIndicator size="large" color="#4A90D9" />
            <Text>Cargando tareas...</Text>
          </View>
        ) : (
          <FlatList
            data={tareas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.tareaItem}>
                <Text>{item.titulo}</Text>
                <Button
                  title="Eliminar"
                  color="#E74C3C"
                  onPress={() => eliminarTarea(item.id)}
                />
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.vacio}>No hay tareas todavía</Text>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F7FA"
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10
  },
  textoGrande: {
    fontSize: 22,
    marginBottom: 10
  },
  filaBotones: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10
  },
  cargando: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 10
  },
  tareaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE"
  },
  vacio: {
    textAlign: "center",
    color: "#777",
    marginTop: 10
  }
});