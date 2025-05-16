// Pantalla para Ver Historial con Filtros y Exportación
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, Button, Alert, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Registro, obtenerHistorial, calcularSaldo, guardarRegistro } from './HistorialService';
import BluetoothSerialOriginal from 'react-native-bluetooth-classic';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';

const BluetoothSerial = BluetoothSerialOriginal as any;

type Props = NativeStackScreenProps<RootStackParamList, 'Historial'>;

const HistorialScreen = ({ navigation }: Props) => {
  const [pin, setPin] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [historial, setHistorial] = useState<Registro[]>([]);
  const [filtro, setFiltro] = useState<'todos' | 'ingreso' | 'egreso' | 'apertura'>('todos');
  const [saldo, setSaldo] = useState(0);

  const validarPIN = async () => {
    const pinGuardado = await AsyncStorage.getItem('pinApertura');
    if (pin === pinGuardado) {
      setAutenticado(true);
      const datos = await obtenerHistorial();
      setHistorial(datos.reverse());
      const total = await calcularSaldo();
      setSaldo(total);
    } else {
      Alert.alert('Error', 'PIN incorrecto');
    }
  };

  useEffect(() => {
    const leerBluetooth = async () => {
      try {
        await BluetoothSerial.withDelimiter('\n');
        const data = await BluetoothSerial.readUntilDelimiter('\n');
        if (data) manejarMensajeBluetooth(data.trim());
      } catch (error) {
        console.log('Error leyendo Bluetooth:', error);
      }
    };
    leerBluetooth();
  }, []);

  const manejarMensajeBluetooth = async (mensaje: string) => {
    const isConnected = await BluetoothSerial.isConnected();
    if (!isConnected) {
      Alert.alert('Error', 'No hay conexión Bluetooth');
      return;
    }

    const ahora = new Date().toLocaleString();
    
    if (mensaje.startsWith('ingreso:')) {
      const monto = parseFloat(mensaje.split(':')[1]);
      if (!isNaN(monto)) {
        await guardarRegistro({ tipo: 'ingreso', monto, fecha: ahora });
        Alert.alert('Ingreso', `Ingresaste Q${monto}`);
      }
    } else if (mensaje.startsWith('egreso:')) {
      const monto = parseFloat(mensaje.split(':')[1]);
      if (!isNaN(monto)) {
        await guardarRegistro({ tipo: 'egreso', monto, fecha: ahora });
        Alert.alert('Egreso', `Retiraste Q${monto}`);
      }
    } else if (mensaje.trim() === 'apertura') {
      await guardarRegistro({ tipo: 'apertura', fecha: ahora });
      Alert.alert('Apertura', 'Se registró la apertura de la alcancía');
    } else {
      console.log('Mensaje no reconocido:', mensaje);
    }
  };

  const exportarPDF = async () => {
    const rows = historial.map(h => `
      <tr>
        <td>${h.fecha}</td>
        <td>${h.tipo}</td>
        <td>${h.monto !== undefined ? `Q${h.monto}` : '-'}</td>
      </tr>
    `).join('');

    const html = `
      <html>
        <body>
          <h1>Historial de la Alcancía</h1>
          <p><strong>Saldo actual:</strong> Q${saldo.toFixed(2)}</p>
          <table border="1" style="width:100%; text-align:center">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const { filePath } = await RNHTMLtoPDF.convert({ html, fileName: 'historial-alcancia', base64: false });
    if (filePath) {
      await Share.open({ url: `file://${filePath}` });
    }
  };

  const historialFiltrado = filtro === 'todos' ? historial : historial.filter(h => h.tipo === filtro);

  if (!autenticado) {
    return (
    <SafeAreaView style={styles.authContainer}>
      <Text style={styles.authTitle}>🔒 Acceso protegido</Text>

      <Text style={styles.label}>Ingresa tu PIN para ver el historial</Text>

      <TextInput
        secureTextEntry
        keyboardType="numeric"
        value={pin}
        onChangeText={setPin}
        style={styles.input}
        placeholder="••••"
        placeholderTextColor="#9E9E9E"
      />

      <TouchableOpacity style={styles.primaryButton} onPress={validarPIN}>
        <Text style={styles.primaryButtonText}>Ver Historial</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  }
  

  const borrarHistorial = async () => {
  Alert.alert(
    '¿Borrar historial?',
    'Esta acción eliminará todo el historial de movimientos del usuario actual. ¿Deseas continuar?',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sí, borrar',
        style: 'destructive',
        onPress: async () => {
          const usuario = await AsyncStorage.getItem('usuarioActivo');
          if (usuario) {
            await AsyncStorage.removeItem(`historial_${usuario}`);
            setHistorial([]); // Limpiar en pantalla también
            setSaldo(0); // Reiniciar saldo si lo estás mostrando
            Alert.alert('Historial eliminado', 'Tu historial ha sido borrado correctamente.');
          }
        },
      },
    ]
  );
};

  return (
  <SafeAreaView style={styles.container}>
    <Text style={styles.label}>Saldo actual: <Text style={styles.saldo}>Q{saldo.toFixed(2)}</Text></Text>

    <View style={styles.filtros}>
      {['todos', 'ingreso', 'egreso', 'apertura'].map(t => (
        <TouchableOpacity
          key={t}
          onPress={() => setFiltro(t as any)}
          style={[
            styles.botonFiltro,
            filtro === t && styles.botonFiltroActivo
          ]}
        >
          <Text style={styles.botonFiltroTexto}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
        </TouchableOpacity>
      ))}
    </View>

    <FlatList
      data={historialFiltrado}
      keyExtractor={(_, i) => i.toString()}
      renderItem={({ item }) => (
        <View style={styles.filaTabla}>
          <Text style={styles.celda}>{item.fecha}</Text>
          <Text style={styles.celda}>{item.tipo}</Text>
          <Text style={styles.celda}>{item.monto !== undefined ? `Q${item.monto}` : '-'}</Text>
        </View>
      )}
      ListHeaderComponent={() => (
        <View style={[styles.filaTabla, styles.encabezado]}>
          <Text style={styles.celda}>Fecha</Text>
          <Text style={styles.celda}>Tipo</Text>
          <Text style={styles.celda}>Monto</Text>
        </View>
      )}
    />

    <View style={{ marginTop: 20 }}>
      <TouchableOpacity style={styles.primaryButton} onPress={exportarPDF}>
        <Text style={styles.primaryButtonText}>Exportar a PDF</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.primaryButtonText}>Volver al menú principal</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dangerButton} onPress={borrarHistorial}>
        <Text style={styles.dangerButtonText}>🗑 Borrar historial</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF1',
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#212121',
    textAlign: 'center',
    fontFamily: 'Roboto-Medium',
  },
  saldo: {
    fontWeight: 'bold',
    color: '#FFCA28', // amarillo oro
    fontSize: 18,
    fontFamily: 'Roboto-Bold',
  },
  filtros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  botonFiltro: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#CFD8DC',
  },
  botonFiltroActivo: {
    backgroundColor: '#004D40',
  },
  botonFiltroTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    fontFamily: 'Roboto-Regular',
  },
  filaTabla: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: '#B0BEC5',
  },
  celda: {
    flex: 1,
    textAlign: 'center',
    color: '#212121',
    fontFamily: 'Roboto-Regular',
  },
  encabezado: {
    backgroundColor: '#CFD8DC',
    paddingVertical: 8,
  },
  primaryButton: {
    backgroundColor: '#00695C',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  dangerButton: {
    backgroundColor: '#D32F2F',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 6,
  },
  dangerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  input: {
  borderWidth: 1,
  borderColor: '#B0BEC5',
  backgroundColor: '#FFFFFF',
  padding: 12,
  marginBottom: 15,
  borderRadius: 10,
  fontSize: 16,
  color: '#212121',
  fontFamily: 'Roboto-Regular',
},
authContainer: {
  flex: 1,
  backgroundColor: '#ECEFF1',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},
authTitle: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 20,
  color: '#004D40',
  fontFamily: 'Roboto-Bold',
  textAlign: 'center',
}
});

export default HistorialScreen;
