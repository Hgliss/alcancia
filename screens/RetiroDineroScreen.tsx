// Pantalla para Retirar Dinero (envía al Arduino)
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { guardarRegistro } from './HistorialService';
import BluetoothSerialOriginal from 'react-native-bluetooth-classic';

const BluetoothSerial = BluetoothSerialOriginal as any;

type RetiroProps = NativeStackScreenProps<RootStackParamList, 'RetiroDinero'>;
const RetiroDineroScreen = ({ navigation }: RetiroProps) => {
  const [monto, setMonto] = useState('');

  const registrarEgreso = async () => {
    const valor = parseFloat(monto);
    if (isNaN(valor) || valor <= 0) {
      Alert.alert('Error', 'Monto inválido');
      return;
    }

    const fecha = new Date().toLocaleString();
    await guardarRegistro({ tipo: 'egreso', monto: valor, fecha });

    try {
      const isConnected = await BluetoothSerial.isConnected();
      if (isConnected) {
        await BluetoothSerial.write(`egreso:${valor}\n`);
      } else {
        Alert.alert('Bluetooth no conectado');
      }
    } catch (error) {
      console.log('❌ Error enviando a Bluetooth:', error);
      Alert.alert('Error al enviar al módulo Bluetooth');
    }

    Alert.alert('Éxito', `Se registró un retiro de Q${valor}`);
    navigation.goBack();
  };

  return (
  <SafeAreaView style={styles.container}>
    <Text style={styles.label}>¿Cuánto deseas retirar?</Text>

    <TextInput
      keyboardType="numeric"
      value={monto}
      onChangeText={setMonto}
      placeholder="Q0.00"
      placeholderTextColor="#9E9E9E"
      style={styles.input}
    />

    <TouchableOpacity style={styles.primaryButton} onPress={registrarEgreso}>
      <Text style={styles.primaryButtonText}>Registrar Retiro</Text>
    </TouchableOpacity>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF1',
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#212121',
    textAlign: 'center',
    fontFamily: 'Roboto-Medium',
  },
  input: {
    borderWidth: 1,
    borderColor: '#B0BEC5',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    color: '#212121',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#004D40',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
});


export default RetiroDineroScreen;
