import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Import screens
import HomeScreen from './screens/HomeScreen';
import CreateGroupScreen from './screens/CreateGroupScreen';
import GroupScreen from './screens/GroupScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Time Capsule' }}
        />
        <Stack.Screen 
          name="CreateGroup" 
          component={CreateGroupScreen} 
          options={{ title: 'Create New Group' }}
        />
        <Stack.Screen 
          name="Group" 
          component={GroupScreen} 
          options={{ title: 'Group' }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
