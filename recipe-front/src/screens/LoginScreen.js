import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export const LoginScreen = ({ navigation }) => {
  const { login, API_URL } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        login(data); 
      } else {
        Alert.alert('Error', data.error || 'Credenciales inválidas');
      }
    } catch (error) {
      Alert.alert('Error de red', 'No se pudo conectar con el servidor');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="Correo electrónico" 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address" 
          autoCapitalize="none" 
        />
        
        <TextInput 
          style={styles.input} 
          placeholder="Contraseña" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
        />
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        {/* BOTÓN PARA IR AL REGISTRO */}
        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>¿No tienes cuenta? Regístrate aquí</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  formContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#333', marginBottom: 40, textAlign: 'center' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 10, marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  linkButton: { marginTop: 25, alignItems: 'center' },
  linkText: { color: '#007bff', fontSize: 16, fontWeight: '600' }
});