import React, { useState, useContext, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

export const GeneralScreen = ({ navigation }) => {
  const { currentUser, API_URL } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllRecipes = async () => {
    try {
      const response = await fetch(`${API_URL}/recipes`);
      const data = await response.json();
      
      if (response.ok) {
        setRecipes(data);
      }
    } catch (error) {
      console.error("Error cargando recetas generales", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllRecipes();
    }, [])
  );

  const renderRecipe = ({ item }) => {
    const isMine = currentUser && item.userId === currentUser.id_usuario;

    return (
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
        
        <View style={styles.footerContainer}>
          {isMine ? (
            <View style={styles.myRecipeBadge}>
              <Text style={styles.myRecipeText}>👑 Mi Receta</Text>
            </View>
          ) : (
            <Text style={styles.authorText}>
              👤 Por: <Text style={styles.authorName}>{item.user?.name || 'Usuario'}</Text>
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Explorar Comunidad</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : recipes.length === 0 ? (
        <Text style={styles.emptyText}>Aún no hay recetas en la comunidad.</Text>
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
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 20 }, // Ajustado a 24
  
  recipeCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  recipeTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 5 }, // Ajustado a 18
  
  groupScrollContainer: { marginBottom: 10 },
  groupBadge: { backgroundColor: '#e7f1ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15, marginRight: 8, alignSelf: 'flex-start' },
  groupBadgeText: { color: '#007bff', fontSize: 12, fontWeight: 'bold' },
  
  recipePreview: { fontSize: 14, color: '#666', marginBottom: 5 }, // Ajustado a 14 y marginBottom a 5
  
  footerContainer: { borderTopWidth: 1, borderTopColor: '#eee', marginTop: 5, paddingTop: 10, flexDirection: 'row', alignItems: 'center' }, // Espaciado idéntico a las acciones
  
  authorText: { fontSize: 14, color: '#666' },
  authorName: { fontWeight: 'bold', color: '#444' },
  
  myRecipeBadge: { backgroundColor: '#ffd700', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  myRecipeText: { color: '#856404', fontWeight: 'bold', fontSize: 12 },
  
  emptyText: { textAlign: 'center', fontSize: 16, color: '#666', marginTop: 40, fontStyle: 'italic' }
});