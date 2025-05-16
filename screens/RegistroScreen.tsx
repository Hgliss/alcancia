// Pantalla de Registro de Usuario, Contraseña y PIN
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert,  TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Registro'>;

const RegistroScreen = ({ navigation }: Props) => {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [pin, setPin] = useState('');

  const handleRegistro = async () => {
    if (!usuario || !clave || !pin) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    await AsyncStorage.setItem('adminUser', usuario);
    await AsyncStorage.setItem('adminPass', clave);
    await AsyncStorage.setItem('pinApertura', pin);

    Alert.alert('Registro exitoso', 'Ya puedes iniciar sesión');
    navigation.replace('Login');
  };

  return (
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>Crear cuenta</Text>

    <TextInput
      placeholder="Usuario"
      value={usuario}
      onChangeText={setUsuario}
      style={styles.input}
      placeholderTextColor="#9E9E9E"
    />

    <TextInput
      placeholder="Contraseña"
      value={clave}
      onChangeText={setClave}
      secureTextEntry
      style={styles.input}
      placeholderTextColor="#9E9E9E"
    />

    <TextInput
      placeholder="PIN para apertura"
      value={pin}
      onChangeText={setPin}
      keyboardType="numeric"
      secureTextEntry
      style={styles.input}
      placeholderTextColor="#9E9E9E"
    />

    <TouchableOpacity style={styles.primaryButton} onPress={handleRegistro}>
      <Text style={styles.primaryButtonText}>Registrarse</Text>
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


export default RegistroScreen;
