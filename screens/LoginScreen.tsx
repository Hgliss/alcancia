// Pantalla para Login y enlace a Registro
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';


type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');

  const handleLogin = async () => {
    const usuarioGuardado = await AsyncStorage.getItem('adminUser');
    const claveGuardada = await AsyncStorage.getItem('adminPass');

    if (usuario === usuarioGuardado && clave === claveGuardada) {
      await AsyncStorage.setItem('usuarioActivo', usuario);
      navigation.replace('Home');
    } else {
      Alert.alert('Acceso denegado', 'Usuario o contraseña incorrectos');
    }
  };

  return (
  <SafeAreaView style={styles.container}>
    <Image
      source={require('../assets/alcancia.png')} // Ajusta la ruta si es necesario
      style={styles.logo}
      resizeMode="contain"
    />
    <Text style={styles.title}>Iniciar sesión</Text>

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

    <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
      <Text style={styles.primaryButtonText}>Ingresar</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
      <Text style={styles.link}>¿No tienes cuenta? Crea una</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => navigation.navigate('Recuperar')}>
      <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
    </TouchableOpacity>
  </SafeAreaView>
);
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Fondo blanco
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#212121', // Gris oscuro para texto
    fontFamily: 'Montserrat-Bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
  },
  link: {
    marginTop: 15,
    textAlign: 'center',
    color: '#00695C', // Azul petróleo
    textDecorationLine: 'underline',
    fontFamily: 'Roboto-Medium',
  },
  primaryButton: {
    backgroundColor: '#004D40', // Verde oscuro
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
  highlight: {
    backgroundColor: '#FFCA28', // Amarillo oro
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  logo: {
  width: 180,
  height: 180,
  marginBottom: 20,
  alignSelf: 'center',
},

});

export default LoginScreen;
