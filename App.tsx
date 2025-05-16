import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import CambiarClaveScreen from './screens/CambiarClaveScreen';
import CambiarPinScreen from './screens/CambiarPinScreen';
import IngresoPinScreen from './screens/IngresoPin'; 
import IngresoDineroScreen from './screens/IngresoDineroScreen';
import RetiroDineroScreen from './screens/RetiroDineroScreen';
import HistorialScreen from './screens/HistorialScreen';
import RegistroScreen from './screens/RegistroScreen';
import RecuperarContrasenaScreen from './screens/RecuperarContrasenaScreen';
import SplashScreen from './screens/SplashScreen';




export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Settings: undefined;
  CambiarClave: undefined;
  CambiarPin: undefined;
  IngresoPin: undefined;
  IngresoDinero: undefined;
  RetiroDinero: undefined;
  Historial: undefined;
  Registro: undefined;
  Recuperar: undefined;
  Splash: undefined;

};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  useEffect(() => {
    const guardarCredenciales = async () => {
      const user = await AsyncStorage.getItem('adminUser');
      if (!user) {
        await AsyncStorage.setItem('adminUser', 'admin');
        await AsyncStorage.setItem('adminPass', '1234');
        await AsyncStorage.setItem('pinApertura', '1234');
      }
    };
    guardarCredenciales();
  }, []);
  
  return (
    <SafeAreaProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="CambiarClave" component={CambiarClaveScreen} />
        <Stack.Screen name="CambiarPin" component={CambiarPinScreen} />
        <Stack.Screen name="IngresoPin" component={IngresoPinScreen} />
        <Stack.Screen name="IngresoDinero" component={IngresoDineroScreen} />
        <Stack.Screen name="RetiroDinero" component={RetiroDineroScreen} />
        <Stack.Screen name="Historial" component={HistorialScreen} />
        <Stack.Screen name="Registro" component={RegistroScreen} />
        <Stack.Screen name="Recuperar" component={RecuperarContrasenaScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
