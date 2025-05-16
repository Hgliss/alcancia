import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'CambiarClave'>;

const CambiarClaveScreen = ({ navigation }: Props) => {
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');

  const handleCambioClave = async () => {
    const guardada = await AsyncStorage.getItem('adminPass');
    if (actual !== guardada) {
      Alert.alert('Error', 'Contraseña actual incorrecta');
      return;
    }

    await AsyncStorage.setItem('adminPass', nueva);
    Alert.alert('Éxito', 'Contraseña actualizada', [
  {
    text: 'OK',
    onPress: () => navigation.replace('Settings')
  }
]);
  };

  return (
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>Cambiar contraseña</Text>

    <TextInput
      placeholder="Contraseña actual"
      secureTextEntry
      value={actual}
      onChangeText={setActual}
      style={styles.input}
      placeholderTextColor="#9E9E9E"
    />
    <TextInput
      placeholder="Nueva contraseña"
      secureTextEntry
      value={nueva}
      onChangeText={setNueva}
      style={styles.input}
      placeholderTextColor="#9E9E9E"
    />

    <TouchableOpacity style={styles.primaryButton} onPress={handleCambioClave}>
      <Text style={styles.primaryButtonText}>Guardar</Text>
    </TouchableOpacity>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF1', // Gris claro
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#212121', // Gris oscuro
    fontFamily: 'Montserrat-Bold', // opcional si ya usas esta fuente
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

export default CambiarClaveScreen;