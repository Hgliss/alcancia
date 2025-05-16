import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Registro {
  tipo: 'ingreso' | 'egreso' | 'apertura';
  monto?: number;
  fecha: string;
}

const obtenerClaveHistorial = async () => {
  const usuario = await AsyncStorage.getItem('usuarioActivo');
  return `historial_${usuario}`;
};

export const guardarRegistro = async (registro: Registro) => {
  const clave = await obtenerClaveHistorial();
  const actual = JSON.parse(await AsyncStorage.getItem(clave) || '[]');
  actual.push(registro);
  await AsyncStorage.setItem(clave, JSON.stringify(actual));
};

export const obtenerHistorial = async (): Promise<Registro[]> => {
  const clave = await obtenerClaveHistorial();
  return JSON.parse(await AsyncStorage.getItem(clave) || '[]');
};

export const calcularSaldo = async (): Promise<number> => {
  const historial = await obtenerHistorial();
  return historial.reduce((total, item) => {
    if (item.tipo === 'ingreso') return total + (item.monto || 0);
    if (item.tipo === 'egreso') return total - (item.monto || 0);
    return total;
  }, 0);
};
