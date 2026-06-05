import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipe } = route.params;

  // Función mágica para separar el texto por saltos de línea y quitar espacios en blanco extra
  const formatList = (text) => {
    if (!text) return [];
    return text.split('\n').filter(item => item.trim() !== '');
  };

  const ingredientsList = formatList(recipe.ingredients);
  const stepsList = formatList(recipe.steps);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{recipe.title}</Text>

        {/* ETIQUETAS DE GRUPOS */}
        {recipe.groups && recipe.groups.length > 0 && (
          <View style={styles.badgesContainer}>
            {recipe.groups.map(group => (
              <View key={group.id_grupo} style={styles.groupBadge}>
                <Text style={styles.groupBadgeText}>{group.name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* SECCIÓN DE INGREDIENTES (Con Viñetas •) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛒 Ingredientes</Text>
          <View style={styles.card}>
            {ingredientsList.length > 0 ? (
              ingredientsList.map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listText}>{item.trim()}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.listText}>No hay ingredientes especificados.</Text>
            )}
          </View>
        </View>

        {/* SECCIÓN DE PASOS (Numerados 1., 2., 3...) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👩‍🍳 Instrucciones</Text>
          <View style={styles.card}>
            {stepsList.length > 0 ? (
              stepsList.map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.number}>{index + 1}.</Text>
                  <Text style={styles.listText}>{item.trim()}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.listText}>No hay pasos especificados.</Text>
            )}
          </View>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingTop: 50 },
  header: { paddingHorizontal: 20, paddingBottom: 10 },
  backButton: { fontSize: 16, color: '#007bff', fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
  
  title: { fontSize: 32, fontWeight: 'bold', color: '#222', marginTop: 10, marginBottom: 15 },
  
  badgesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 25 },
  groupBadge: { backgroundColor: '#e7f1ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  groupBadgeText: { color: '#007bff', fontSize: 14, fontWeight: 'bold' },

  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#444', marginBottom: 10 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5 },
  
  // ESTILOS PARA LAS LISTAS
  listItem: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' },
  bullet: { fontSize: 18, color: '#007bff', marginRight: 10, lineHeight: 24, fontWeight: 'bold' },
  number: { fontSize: 16, color: '#007bff', marginRight: 10, lineHeight: 24, fontWeight: 'bold', minWidth: 22 },
  listText: { flex: 1, fontSize: 16, color: '#444', lineHeight: 24 }
});