import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'IngresoPin'>;

const IngresoPin = ({ navigation }: Props) => {
  const [pin, setPin] = useState('');
  const [modoConfiguracion, setModoConfiguracion] = useState(false);

  useEffect(() => {
    const verificarExistenciaPIN = async () => {
      const guardado = await AsyncStorage.getItem('pinApertura');
      setModoConfiguracion(!guardado);
    };
    verificarExistenciaPIN();
  }, []);

  const manejarPIN = async () => {
    const guardado = await AsyncStorage.getItem('pinApertura');

    if (!guardado) {
      if (pin.length < 4) {
        Alert.alert('Error', 'El PIN debe tener al menos 4 dígitos');
        return;
      }
      await AsyncStorage.setItem('pinApertura', pin);
      Alert.alert('Éxito', 'PIN guardado correctamente');
      navigation.goBack();
      return;
    }

    if (pin === guardado) {
      await AsyncStorage.setItem('pinValidado', 'true');
      navigation.goBack();
    } else {
      Alert.alert('Error', 'PIN incorrecto');
    }
  };

  return (
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>
      {modoConfiguracion ? 'Configure su nuevo código de apertura' : 'Ingrese su código de apertura'}
    </Text>

    <TextInput
      style={styles.input}
      secureTextEntry
      keyboardType="numeric"
      value={pin}
      onChangeText={setPin}
      placeholder="Ingrese PIN"
      placeholderTextColor="#9E9E9E"
    />

    <TouchableOpacity style={styles.primaryButton} onPress={manejarPIN}>
      <Text style={styles.primaryButtonText}>
        {modoConfiguracion ? 'Guardar PIN' : 'Validar'}
      </Text>
    </TouchableOpacity>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF1',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#212121',
    fontFamily: 'Roboto-Bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#B0BEC5',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    color: '#212121',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
    marginBottom: 20,
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
export default IngresoPin;