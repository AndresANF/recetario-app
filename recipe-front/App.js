import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { AuthProvider, AuthContext } from './src/context/AuthContext';

import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';

import { HomeScreen } from './src/screens/HomeScreen';
import { GeneralScreen } from './src/screens/GeneralScreen'; 
import { GroupScreen } from './src/screens/GroupScreen';
import { CreateRecipeScreen } from './src/screens/CreateRecipeScreen';
import { EditRecipeScreen } from './src/screens/EditRecipeScreen'; 
import { ProfileScreen } from './src/screens/ProfileScreen';
import { RecipeDetailScreen } from './src/screens/RecipeDetailScreen'; 
import { GroupDetailScreen } from './src/screens/GroupDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#007bff' }}>
      <Tab.Screen name="Mis Recetas" component={HomeScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>🍳</Text> }} />
      <Tab.Screen name="General" component={GeneralScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>🌍</Text> }} />
      <Tab.Screen name="Grupos" component={GroupScreen} options={{ tabBarIcon: () => <Text style={{ fontSize: 20 }}>📁</Text> }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {currentUser ? (
          <React.Fragment>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
            <Stack.Screen name="GroupDetail" component={GroupDetailScreen} /> 
            <Stack.Screen name="CreateRecipe" component={CreateRecipeScreen} /> 
            <Stack.Screen name="EditRecipe" component={EditRecipeScreen} /> 
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </React.Fragment>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}