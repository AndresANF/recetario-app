import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export const RegisterScreen = ({ navigation }) => {
  const { API_URL } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Por favor llena todos los campos');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email.trim())) {
      Alert.alert('Email inválido', 'Por favor, introduce una dirección de correo electrónico válida (ej: usuario@correo.com).');
      return;
    }

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (name && !nameRegex.test(name.trim())) {
      Alert.alert('Nombre inválido', 'El nombre solo puede contener letras y espacios.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
    if (password && !passwordRegex.test(password)) {
      Alert.alert(
        'Contraseña débil', 
        'La contraseña debe contener al menos 12 caracteres e incluir una combinación de letras mayúsculas y minúsculas, así como una combinación adecuada de caracteres especiales y números.'
      );
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      if (response.status === 400) {
        Alert.alert('Email no disponible', data.error);
        return;
      }

      if (response.ok) {
        Alert.alert('¡Éxito!', 'Cuenta creada correctamente. Ahora puedes iniciar sesión.');
        navigation.navigate('Login'); 
      } else {
        Alert.alert('Error del servidor', data.error || 'No se pudo registrar la cuenta');
      }
    } catch (error) {
      Alert.alert('Error de red', 'No se pudo conectar con el servidor');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Crear Cuenta</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="Nombre completo" 
          value={name} 
          onChangeText={setName} 
        />

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
        
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        {/* BOTÓN PARA VOLVER AL LOGIN */}
        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
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
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  linkButton: { marginTop: 25, alignItems: 'center' },
  linkText: { color: '#007bff', fontSize: 16, fontWeight: '600' }
});