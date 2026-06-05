import React, { useState, useContext, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

export const HomeScreen = ({ navigation }) => {
  const { currentUser, logout, API_URL } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`${API_URL}/recipes?userId=${currentUser.id_usuario}`);
      const data = await response.json();
      
      if (response.ok) {
        setRecipes(data);
      } else {
        Alert.alert('Error', 'No se pudieron cargar las recetas');
      }
    } catch (error) {
      Alert.alert('Error de Red', 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRecipes();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert(
      'Eliminar Receta',
      '¿Estás seguro de que quieres eliminar esta receta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/recipes/${id}`, {
                method: 'DELETE',
              });
              if (response.ok) {
                fetchRecipes();
              } else {
                Alert.alert('Error', 'No se pudo eliminar la receta');
              }
            } catch (error) {
              Alert.alert('Error', 'Problema de conexión al eliminar');
            }
          }
        }
      ]
    );
  };

  const renderRecipe = ({ item }) => (
    <View style={styles.recipeCard}>
      
      <TouchableOpacity 
        activeOpacity={0.6} 
        onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
      >
        <Text style={styles.recipeTitle}>{item.title}</Text>
        
        {item.groups && item.groups.length > 0 && (
          <View style={styles.groupScrollContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {item.groups.map((group) => (
                <View key={group.id_grupo} style={styles.groupBadge}>
                  <Text style={styles.groupBadgeText}>{group.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <Text style={styles.recipePreview} numberOfLines={2}>
          Ingredientes: {item.ingredients ? item.ingredients.replace(/\n/g, ', ') : ''}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.actionsContainer}>
        <View style={styles.rightActions}>
          <TouchableOpacity onPress={() => navigation.navigate('EditRecipe', { recipe: item })}>
            <Text style={styles.editButton}>Editar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => handleDelete(item.id_receta)}>
            <Text style={styles.deleteButton}>Borrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Hola, {currentUser?.name}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.profileLink}>Ver perfil ⚙️</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>Tus Recetas</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateRecipe')}
        >
          <Text style={styles.addButtonText}>+ Nueva</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : recipes.length === 0 ? (
        <Text style={styles.emptyText}>No tienes recetas. ¡Crea una nueva!</Text>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id_receta.toString()}
          renderItem={renderRecipe}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  welcome: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  profileLink: { color: '#007bff', fontSize: 14, marginTop: 4 },
  logoutButton: { backgroundColor: '#dc3545', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  addButton: { backgroundColor: '#28a745', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  recipeCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  recipeTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 5 },
  
  groupScrollContainer: { marginBottom: 10 },
  groupBadge: { backgroundColor: '#e7f1ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15, marginRight: 8, alignSelf: 'flex-start' },
  groupBadgeText: { color: '#007bff', fontSize: 12, fontWeight: 'bold' },
  
  recipePreview: { fontSize: 14, color: '#666', marginBottom: 5 },
  
  actionsContainer: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 5, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  rightActions: { flexDirection: 'row', gap: 15 },
  editButton: { color: '#007bff', fontWeight: 'bold', fontSize: 14 },
  deleteButton: { color: '#dc3545', fontWeight: 'bold', fontSize: 14 },
  
  emptyText: { textAlign: 'center', fontSize: 16, color: '#666', marginTop: 40 }
});