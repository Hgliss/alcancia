import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'CambiarPin'>;

const CambiarPinScreen = ({ navigation }: Props) => {
  const [actual, setActual] = useState('');
  const [nuevo, setNuevo] = useState('');

  const handleCambioPin = async () => {
    const guardado = await AsyncStorage.getItem('pinApertura');
    if (actual !== guardado) {
      Alert.alert('Error', 'PIN actual incorrecto');
      return;
    }

    if (nuevo.length < 4) {
      Alert.alert('Error', 'El nuevo PIN debe tener al menos 4 dígitos');
      return;
    }

    await AsyncStorage.setItem('pinApertura', nuevo);
    Alert.alert('Éxito', 'PIN actualizado', [
        {
            text: 'OK',
            onPress: () => navigation.replace('Settings')
        }
    ]);;
  };

  return (
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>Cambiar PIN</Text>

    <TextInput
      placeholder="PIN actual"
      secureTextEntry
      keyboardType="numeric"
      value={actual}
      onChangeText={setActual}
      style={styles.input}
      placeholderTextColor="#9E9E9E"
    />
    <TextInput
      placeholder="Nuevo PIN"
      secureTextEntry
      keyboardType="numeric"
      value={nuevo}
      onChangeText={setNuevo}
      style={styles.input}
      placeholderTextColor="#9E9E9E"
    />

    <TouchableOpacity style={styles.primaryButton} onPress={handleCambioPin}>
      <Text style={styles.primaryButtonText}>Guardar</Text>
    </TouchableOpacity>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF1', // Fondo gris claro
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#212121', // Gris oscuro
    fontFamily: 'Montserrat-Bold', // si usas fuentes personalizadas
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
  primaryButton: {
    backgroundColor: '#004D40', // Verde oscuro
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
});

export default CambiarPinScreen;
