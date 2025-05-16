import React, { useState } from 'react';
import { View, Button, StyleSheet, Text,TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const SettingsScreen = ({ navigation }: Props) => {
  return (
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>Configuración</Text>

    <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('CambiarClave')}>
      <Text style={styles.primaryButtonText}>Cambiar Contraseña</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('CambiarPin')}>
      <Text style={styles.primaryButtonText}>Cambiar PIN de apertura</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.dangerButton} onPress={() => navigation.replace('Login')}>
      <Text style={styles.dangerButtonText}>Cerrar sesión</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#212121',
    fontFamily: 'Roboto-Bold',
  },
  primaryButton: {
    backgroundColor: '#004D40',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
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
    marginTop: 15,
  },
  dangerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
});

export default SettingsScreen;