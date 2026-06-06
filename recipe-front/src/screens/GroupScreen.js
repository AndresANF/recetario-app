import React, { useState, useContext, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

export const GroupScreen = ({ navigation }) => {
  const { currentUser, API_URL } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGroupName, setNewGroupName] = useState('');

  const fetchGroups = async () => {
    try {
      const response = await fetch(`${API_URL}/groups`);
      if (response.ok) {
        const data = await response.json();
        data.sort((a, b) => a.name.localeCompare(b.name));
        setGroups(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [])
  );

  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || !currentUser) return;
    try {
      const response = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newGroupName, userId: currentUser.id_usuario })
      });
      if (response.ok) {
        setNewGroupName('');
        fetchGroups();
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el grupo');
    }
  };

  const renderGroup = ({ item }) => {
    const isOwner = currentUser && item.userId === currentUser.id_usuario;
    const recipeCount = item.recipes ? item.recipes.length : 0;

    return (
      <TouchableOpacity 
        style={styles.groupCard}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('GroupDetail', { group: item })}
      >
        <View style={styles.headerRow}>
          <Text style={styles.groupName}>{item.name}</Text>
          {isOwner && (
            <View style={styles.badgeWrapper}>
              <Text style={styles.ownerBadge}>👑 Mi Grupo</Text>
            </View>
          )}
        </View>
        <Text style={styles.recipeCountText}>
          {recipeCount} {recipeCount === 1 ? 'receta' : 'recetas'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Directorio de Grupos</Text>
      
      <View style={styles.createContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del nuevo grupo..."
          value={newGroupName}
          onChangeText={setNewGroupName}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleCreateGroup}>
          <Text style={styles.addButtonText}>Crear</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id_grupo.toString()}
          renderItem={renderGroup}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  
  createContainer: { flexDirection: 'row', marginBottom: 30 },
  input: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 15, fontSize: 16, marginRight: 10 },
  addButton: { backgroundColor: '#28a745', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, borderRadius: 10 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  groupCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  headerRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 5 },
  groupName: { fontSize: 22, fontWeight: 'bold', color: '#222' },
  
  badgeWrapper: { backgroundColor: '#ffd700', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15 },
  ownerBadge: { color: '#856404', fontWeight: 'bold', fontSize: 12 },
  
  recipeCountText: { fontSize: 14, color: '#666', marginTop: 5 }
});