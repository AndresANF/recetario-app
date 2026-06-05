import React, { useState, useContext, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, Modal } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

export const GroupDetailScreen = ({ route, navigation }) => {
  const { group: initialGroup } = route.params;
  const { currentUser, API_URL } = useContext(AuthContext);
  
  const [group, setGroup] = useState(() => {
    const sortedRecipes = initialGroup.recipes ? [...initialGroup.recipes].sort((a, b) => a.title.localeCompare(b.title)) : [];
    return { ...initialGroup, recipes: sortedRecipes };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(initialGroup.name);
  
  const [recipeToRemove, setRecipeToRemove] = useState(null); 

  const isOwner = currentUser && group.userId === currentUser.id_usuario;

  const fetchGroupDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/groups`);
      if (response.ok) {
        const data = await response.json();
        const updatedGroup = data.find(g => g.id_grupo === group.id_grupo);
        if (updatedGroup) {
          if (updatedGroup.recipes) {
            updatedGroup.recipes.sort((a, b) => a.title.localeCompare(b.title));
          }
          setGroup(updatedGroup);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGroupDetails();
    }, [])
  );

  const handleUpdateName = async () => {
    if (!editName.trim()) {
      setIsEditing(false);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/groups/${group.id_grupo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, userId: currentUser.id_usuario })
      });
      if (response.ok) {
        setIsEditing(false);
        fetchGroupDetails();
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el nombre');
    }
  };

  // --- AQUÍ ESTÁN LOS MENSAJES ACTUALIZADOS ---
  const handleDeleteOrLeaveGroup = () => {
    const title = isOwner ? "Borrar Grupo" : "Salir del Grupo";
    const message = isOwner 
      ? "¿Estás seguro de que quieres borrar este grupo entero? También se borrarán tus recetas asociadas a él." 
      : "¿Estás seguro de que quieres salir de este grupo? Se borrarán tus recetas asociadas al grupo.";

    Alert.alert(title, message, [
      { text: "Cancelar", style: "cancel" },
      {
        text: isOwner ? "Borrar" : "Salir", 
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(`${API_URL}/groups/${group.id_grupo}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: currentUser.id_usuario })
            });
            if (response.ok) navigation.goBack();
          } catch (error) {
            Alert.alert('Error', 'No se pudo procesar la operación');
          }
        }
      }
    ]);
  };

  const confirmRemoveRecipe = async () => {
    if (!recipeToRemove) return;
    try {
      const response = await fetch(`${API_URL}/groups/${group.id_grupo}/recipes/${recipeToRemove.id_receta}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id_usuario })
      });
      if (response.ok) {
        setRecipeToRemove(null); 
        fetchGroupDetails();     
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo quitar la receta');
    }
  };

  const renderRecipeCard = ({ item }) => (
    <View style={styles.recipeCard}>
      <TouchableOpacity 
        activeOpacity={0.6} 
        onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
      >
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipePreview} numberOfLines={2}>
          Ingredientes: {item.ingredients ? item.ingredients.replace(/\n/g, ', ') : ''}
        </Text>
      </TouchableOpacity>
      
      {isOwner && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={() => setRecipeToRemove(item)}>
            <Text style={styles.removeButton}>Quitar del grupo ✕</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        
        <View style={styles.ownerControls}>
          {isOwner && !isEditing && (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.editGroupBtn}>Editar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleDeleteOrLeaveGroup}>
            <Text style={styles.deleteGroupBtn}>
              {isOwner ? 'Borrar Grupo' : 'Salir del Grupo'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.titleSection}>
        {isEditing ? (
          <TextInput 
            style={styles.editInput} 
            value={editName} 
            onChangeText={setEditName} 
            autoFocus
            onBlur={handleUpdateName}
            onSubmitEditing={handleUpdateName}
          />
        ) : (
          <View style={styles.titleRow}>
            <Text style={styles.groupMainTitle}>{group.name}</Text>
            {isOwner && (
              <View style={styles.badgeWrapper}>
                <Text style={styles.ownerBadge}>👑 Mi Grupo</Text>
              </View>
            )}
          </View>
        )}
      </View>

      <FlatList
        data={group.recipes}
        keyExtractor={(item) => item.id_receta.toString()}
        renderItem={renderRecipeCard}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay recetas en este grupo aún.</Text>}
      />

      <Modal
        visible={!!recipeToRemove}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Quitar Receta</Text>
            <Text style={styles.modalText}>
              ¿Estás seguro de que quieres quitar <Text style={{fontWeight: 'bold'}}>"{recipeToRemove?.title}"</Text> de este grupo?
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setRecipeToRemove(null)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={confirmRemoveRecipe}>
                <Text style={styles.modalConfirmText}>Sí, quitar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backButton: { fontSize: 16, color: '#007bff', fontWeight: 'bold' },
  
  ownerControls: { flexDirection: 'row', gap: 15 },
  editGroupBtn: { color: '#007bff', fontWeight: 'bold', fontSize: 14 },
  deleteGroupBtn: { color: '#dc3545', fontWeight: 'bold', fontSize: 14 },
  
  titleSection: { marginBottom: 25 },
  titleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 },
  groupMainTitle: { fontSize: 32, fontWeight: 'bold', color: '#222' },
  editInput: { fontSize: 32, fontWeight: 'bold', color: '#222', borderBottomWidth: 2, borderBottomColor: '#007bff', padding: 0 },
  
  badgeWrapper: { backgroundColor: '#ffd700', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 15 },
  ownerBadge: { color: '#856404', fontWeight: 'bold', fontSize: 12 },

  recipeCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  recipeTitle: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 5 },
  recipePreview: { fontSize: 14, color: '#666', marginBottom: 5 },
  
  actionsContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  removeButton: { color: '#dc3545', fontWeight: 'bold', fontSize: 13 },
  
  emptyText: { textAlign: 'center', fontSize: 16, color: '#666', marginTop: 40, fontStyle: 'italic' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', width: '100%', borderRadius: 15, padding: 25, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  modalText: { fontSize: 16, color: '#555', marginBottom: 25, lineHeight: 22 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  modalCancelBtn: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
  modalCancelText: { color: '#555', fontWeight: 'bold', fontSize: 16 },
  modalConfirmBtn: { backgroundColor: '#dc3545', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  modalConfirmText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});