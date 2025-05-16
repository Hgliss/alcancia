import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Recuperar'>;

const RecuperarContrasenaScreen = () => {
  const [usuario, setUsuario] = useState('');
  const [pin, setPin] = useState('');

  const recuperar = async () => {
    if (!usuario || !pin) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    const pinGuardado = await AsyncStorage.getItem(`pin_${usuario}`);
    if (pin === pinGuardado) {
      const pass = await AsyncStorage.getItem(`pass_${usuario}`);
      Alert.alert('Tu contraseña es', pass || 'No encontrada');
    } else {
      Alert.alert('Error', 'PIN incorrecto');
    }
  };

  return (
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>Recuperar contraseña</Text>

    <TextInput
      placeholder="Usuario"
      value={usuario}
      onChangeText={setUsuario}
      style={styles.input}
      placeholderTextColor="#9E9E9E"
    />

    <TextInput
      placeholder="PIN de apertura"
      value={pin}
      onChangeText={setPin}
      secureTextEntry
      keyboardType="numeric"
      style={styles.input}
      placeholderTextColor="#9E9E9E"
    />

    <TouchableOpacity style={styles.primaryButton} onPress={recuperar}>
      <Text style={styles.primaryButtonText}>Recuperar contraseña</Text>
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
    fontSize: 24,
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
    marginBottom: 15,
    color: '#212121',
    fontFamily: 'Roboto-Regular',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#004D40',
    padding: 14,
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

export default RecuperarContrasenaScreen;
