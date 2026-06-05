import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export const EditRecipeScreen = ({ route, navigation }) => {
  const { recipe } = route.params;
  const { currentUser, API_URL } = useContext(AuthContext);

  const [title, setTitle] = useState(recipe.title);
  
  const [availableGroups, setAvailableGroups] = useState([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState(
    recipe.groups ? recipe.groups.map(g => g.id_grupo) : []
  );

  const formatInitialList = (text) => {
    if (!text) return [''];
    const list = text.split('\n').filter(item => item.trim() !== '');
    return list.length > 0 ? list : [''];
  };

  const [ingredients, setIngredients] = useState(formatInitialList(recipe.ingredients));
  const [steps, setSteps] = useState(formatInitialList(recipe.steps));

  useEffect(() => {
    const fetchAllGroups = async () => {
      try {
        const response = await fetch(`${API_URL}/groups`);
        if (response.ok) {
          const data = await response.json();
          setAvailableGroups(data);
        }
      } catch (error) {
        console.error("Error cargando grupos", error);
      }
    };
    fetchAllGroups();
  }, []);

  const toggleGroupSelection = (groupId) => {
    if (selectedGroupIds.includes(groupId)) {
      setSelectedGroupIds(selectedGroupIds.filter(id => id !== groupId));
    } else {
      setSelectedGroupIds([...selectedGroupIds, groupId]);
    }
  };

  const handleIngredientChange = (text, index) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = text;
    setIngredients(newIngredients);
  };

  const addIngredientField = () => setIngredients([...ingredients, '']);
  
  const removeIngredientField = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients.length > 0 ? newIngredients : ['']);
  };

  const handleStepChange = (text, index) => {
    const newSteps = [...steps];
    newSteps[index] = text;
    setSteps(newSteps);
  };

  const addStepField = () => setSteps([...steps, '']);
  
  const removeStepField = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps.length > 0 ? newSteps : ['']);
  };

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'El título es obligatorio');
      return;
    }

    const validIngredients = ingredients.filter(i => i.trim() !== '');
    const validSteps = steps.filter(s => s.trim() !== '');

    if (validIngredients.length === 0 || validSteps.length === 0) {
      Alert.alert('Campos vacíos', 'No puedes guardar una receta sin ingredientes o pasos.');
      return;
    }

    const decimalRegex = /\d+[\.,]\d+/; 
    const negativeRegex = /(^|\s)-\d+/; 

    const hasInvalidIngredient = validIngredients.some(ing => 
      decimalRegex.test(ing) || negativeRegex.test(ing)
    );

    if (hasInvalidIngredient) {
      Alert.alert(
        'Formato inválido', 
        'No se permiten cantidades negativas ni decimales en los ingredientes. Por favor usa números enteros (1) o fracciones (1/2).'
      );
      return;
    }

    const finalIngredients = validIngredients.join('\n');
    const finalSteps = validSteps.join('\n');

    try {
      const response = await fetch(`${API_URL}/recipes/${recipe.id_receta}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          ingredients: finalIngredients,
          steps: finalSteps,
          groupIds: selectedGroupIds
        })
      });

      if (response.ok) {
        Alert.alert('¡Éxito!', 'Receta actualizada correctamente', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', 'No se pudo actualizar la receta');
      }
    } catch (error) {
      Alert.alert('Error', 'Problema de conexión');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Receta</Text>
        <View style={{ width: 60 }} /> 
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        
        <Text style={styles.label}>Título de la receta</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        {availableGroups.length > 0 && (
          <View>
            <Text style={styles.label}>Compartir en Grupos</Text>
            <View style={styles.groupsContainer}>
              {availableGroups.map(group => {
                const isSelected = selectedGroupIds.includes(group.id_grupo);
                return (
                  <TouchableOpacity 
                    key={group.id_grupo} 
                    style={[styles.groupChip, isSelected && styles.groupChipSelected]}
                    onPress={() => toggleGroupSelection(group.id_grupo)}
                  >
                    <Text style={[styles.groupChipText, isSelected && styles.groupChipTextSelected]}>
                      {group.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.label}>Ingredientes</Text>
        </View>
        
        {ingredients.map((ing, index) => (
          <View key={`ing-${index}`} style={styles.dynamicRow}>
            <Text style={styles.bullet}>•</Text>
            <TextInput style={styles.dynamicInput} value={ing} onChangeText={(text) => handleIngredientChange(text, index)} />
            <TouchableOpacity onPress={() => removeIngredientField(index)} style={styles.removeBtn}>
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        <TouchableOpacity style={styles.addBtn} onPress={addIngredientField}>
          <Text style={styles.addBtnText}>+ Agregar ingrediente</Text>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.label}>Instrucciones</Text>
        </View>

        {steps.map((step, index) => (
          <View key={`step-${index}`} style={styles.dynamicRow}>
            <Text style={styles.number}>{index + 1}.</Text>
            <TextInput style={[styles.dynamicInput, { minHeight: 60 }]} value={step} multiline={true} onChangeText={(text) => handleStepChange(text, index)} />
            <TouchableOpacity onPress={() => removeStepField(index)} style={styles.removeBtn}>
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={addStepField}>
          <Text style={styles.addBtnText}>+ Agregar paso</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitBtn} onPress={handleUpdate}>
          <Text style={styles.submitBtnText}>Actualizar Receta</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20 },
  backButton: { fontSize: 16, color: '#007bff', fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  label: { fontSize: 18, fontWeight: 'bold', color: '#444', marginBottom: 10, marginTop: 15 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 15, fontSize: 16, marginBottom: 10 },
  groupsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 15 },
  groupChip: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  groupChipSelected: { backgroundColor: '#007bff', borderColor: '#007bff' },
  groupChipText: { color: '#555', fontWeight: 'bold' },
  groupChipTextSelected: { color: '#fff' },
  dynamicRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  bullet: { fontSize: 20, color: '#007bff', marginRight: 10, marginTop: 10 },
  number: { fontSize: 16, fontWeight: 'bold', color: '#007bff', marginRight: 10, marginTop: 12, minWidth: 20 },
  dynamicInput: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 16 },
  removeBtn: { marginLeft: 10, marginTop: 5, backgroundColor: '#ffe5e5', width: 35, height: 35, borderRadius: 17.5, justifyContent: 'center', alignItems: 'center' },
  removeBtnText: { color: '#dc3545', fontWeight: 'bold', fontSize: 16 },
  addBtn: { alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 15, backgroundColor: '#e7f1ff', borderRadius: 8, marginBottom: 15 },
  addBtnText: { color: '#007bff', fontWeight: 'bold' },
  submitBtn: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30 },
  submitBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});