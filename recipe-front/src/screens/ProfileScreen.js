import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export const ProfileScreen = ({ navigation }) => {
  const { currentUser, login, API_URL } = useContext(AuthContext);
  
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState(''); 

  const handleUpdate = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'El nombre y el correo no pueden estar vacíos');
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
      const dataToSend = { name, email };
      if (password.trim() !== '') {
        dataToSend.password = password;
      }

      const response = await fetch(`${API_URL}/users/${currentUser.id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (response.status === 400) {
        const errorData = await response.json();
        Alert.alert('Email no disponible', errorData.error);
        return;
      }

      if (response.ok) {
        const updatedUser = await response.json();
        login(updatedUser); 
        Alert.alert('¡Éxito!', 'Tu perfil ha sido actualizado');
        navigation.goBack();
      } else {
        const errorData = await response.json();
        Alert.alert('Error del servidor', errorData.error || 'No se pudo actualizar tu perfil en este momento.');
      }
    } catch (error) {
      Alert.alert('Error de red', 'No se pudo conectar con el servidor');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "¡CUIDADO!",
      "¿Estás seguro? Esta acción borrará tu cuenta, todas tus recetas y tus grupos permanentemente.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sí, borrar mi cuenta", 
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/users/${currentUser.id_usuario}`, { method: 'DELETE' });
              
              if (response.ok) {
                Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido borrada del sistema.');
                login(null); 
              } else {
                Alert.alert('Error', 'No se pudo borrar la cuenta');
              }
            } catch (error) {
              Alert.alert('Error', 'Hubo un problema de conexión al intentar borrar la cuenta');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mi Perfil</Text>
      </View>

      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Correo Electrónico</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

      <Text style={styles.label}>Nueva Contraseña (Opcional)</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Escribe aquí para cambiarla" secureTextEntry />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>

      <View style={styles.dangerZone}>
        <Text style={styles.dangerTitle}>Zona de Peligro</Text>
        <Text style={styles.dangerText}>Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate de estar seguro.</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteButtonText}>Eliminar mi cuenta</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa', paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, gap: 15 },
  backButton: { fontSize: 16, color: '#007bff', fontWeight: 'bold' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  label: { fontSize: 16, fontWeight: 'bold', color: '#555', marginBottom: 5 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 10, marginBottom: 20, fontSize: 16 },
  updateButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 40 },
  updateButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  dangerZone: { backgroundColor: '#fff0f0', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#ffcccc' },
  dangerTitle: { fontSize: 18, fontWeight: 'bold', color: '#dc3545', marginBottom: 10 },
  dangerText: { color: '#666', marginBottom: 20, lineHeight: 20 },
  deleteButton: { backgroundColor: '#dc3545', padding: 15, borderRadius: 10, alignItems: 'center' },
  deleteButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});