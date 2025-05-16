// HomeScreen funcional con módulo Bluetooth HC-05
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import BluetoothSerialOriginal from 'react-native-bluetooth-classic';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { guardarRegistro } from './HistorialService';

const BluetoothSerial = BluetoothSerialOriginal as any;

type Dispositivo = {
  id: string;
  name: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  const [devices, setDevices] = useState<Dispositivo[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Dispositivo | null>(null);
  const [mostrarModalPIN, setMostrarModalPIN] = useState(false);
  const [pinIngresado, setPinIngresado] = useState('');

  useEffect(() => {
    listarDispositivos();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const verificarPINValidado = async () => {
        const validado = await AsyncStorage.getItem('pinValidado');
        if (validado === 'true') {
          await AsyncStorage.removeItem('pinValidado');
          mostrarMenuDeAccion();
        }
      };
      verificarPINValidado();
    }, [])
  );

  const listarDispositivos = async () => {
    try {
      const paired = await BluetoothSerial.list();
      setDevices(paired);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron obtener los dispositivos emparejados');
    }
  };

  const conectarDispositivo = async (device: Dispositivo) => {
    try {
      const connected = await BluetoothSerial.connect(device.id);
      if (connected) {
        setConnectedDevice(device);
        Alert.alert('Conectado', `Conectado con ${device.name}`);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar al dispositivo');
    }
  };

  const abrirAlcancia = () => {
    if (!connectedDevice) {
      Alert.alert('Error', 'Primero debes conectarte a un dispositivo');
      return;
    }
    setMostrarModalPIN(true);
  };

  const verificarPIN = async () => {
    const pinGuardado = await AsyncStorage.getItem('pinApertura');
    if (pinIngresado === pinGuardado) {
      setMostrarModalPIN(false);
      setPinIngresado('');
      mostrarMenuDeAccion();
    } else {
      Alert.alert('Error', 'PIN incorrecto');
    }
  };

  const mostrarMenuDeAccion = () => {
    Alert.alert('¿Qué deseas hacer?', '', [
      {
        text: 'Ingresar Dinero',
        onPress: () => navigation.navigate('IngresoDinero')
      },
      {
        text: 'Retirar Dinero',
        onPress: () => navigation.navigate('RetiroDinero')
      },
      {
        text: 'Solo apertura',
        onPress: async () => {
          const fecha = new Date().toLocaleString();
          await guardarRegistro({ tipo: 'apertura', fecha });
          try {
            const isConnected = await BluetoothSerial.isConnected();
            if (isConnected) {
              await BluetoothSerial.write('apertura\n');
            }
          } catch (error) {
            console.log('❌ Error al escribir apertura:', error);
          }
          Alert.alert('Apertura registrada');
        },
        style: 'cancel'
      }
    ]);
  };

  const [conectado, setConectado] = useState(false);

useEffect(() => {
  const verificarConexion = async () => {
    const estado = await BluetoothSerial.isConnected();
    setConectado(estado);
  };
  verificarConexion();
}, []);

  return (
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>Dispositivos emparejados:</Text>

    <FlatList
      data={devices}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => conectarDispositivo(item)} style={styles.deviceButton}>
          <Text style={styles.deviceText}>{item.name || item.id}</Text>
        </TouchableOpacity>
      )}
    />

    <View style={styles.actions}>
      <TouchableOpacity
        style={[
          styles.primaryButton,
          !connectedDevice && styles.disabledButton
        ]}
        disabled={!connectedDevice}
        onPress={abrirAlcancia}
      >
        <Text style={styles.primaryButtonText}>Abrir Alcancía</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.primaryButtonText}>Configuración</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Historial')}>
        <Text style={styles.primaryButtonText}>Ver Historial</Text>
      </TouchableOpacity>
    </View>

    <Modal visible={mostrarModalPIN} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Ingresa el PIN</Text>
          <TextInput
            secureTextEntry
            keyboardType="numeric"
            value={pinIngresado}
            onChangeText={setPinIngresado}
            style={styles.input}
            placeholderTextColor="#9E9E9E"
          />
          <TouchableOpacity style={styles.primaryButton} onPress={verificarPIN}>
            <Text style={styles.primaryButtonText}>Confirmar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dangerButton} onPress={() => {
            setPinIngresado('');
            setMostrarModalPIN(false);
          }}>
            <Text style={styles.dangerButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.estadoBluetooth}>
            Estado Bluetooth: {conectado ? '🟢 Conectado' : '🔴 Desconectado'}
          </Text>
        </View>
      </View>
    </Modal>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF1',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#212121',
    textAlign: 'center',
    fontFamily: 'Roboto-Bold',
  },
  deviceButton: {
    padding: 14,
    marginVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderColor: '#B0BEC5',
    borderWidth: 1,
  },
  deviceText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: '#212121',
  },
  actions: {
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: '#004D40',
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
  disabledButton: {
    backgroundColor: '#B0BEC5',
  },
  dangerButton: {
    backgroundColor: '#D32F2F',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
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
    borderRadius: 10,
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'Roboto-Regular',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#212121',
    fontFamily: 'Roboto-Bold',
  },
  estadoBluetooth: {
    marginTop: 10,
    fontSize: 14,
    color: '#37474F',
    fontFamily: 'Roboto-Medium',
  },
});

export default HomeScreen;
