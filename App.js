import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GroupProvider } from './context/GroupContext';

// Import all screens
import HomeScreen from './screens/HomeScreen';
import CreateGroupScreen from './screens/CreateGroupScreen';
import CurrentGroupsScreen from './screens/CurrentGroupsScreen';
import UnlockedGroupsScreen from './screens/UnlockedGroupsScreen';
import GroupScreen from './screens/GroupScreen';
import MediaViewScreen from './screens/MediaViewScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GroupProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Home' }}
          />
          <Stack.Screen 
            name="CreateGroup" 
            component={CreateGroupScreen} 
            options={{ title: 'Create New Group' }}
          />
          <Stack.Screen 
            name="CurrentGroups" 
            component={CurrentGroupsScreen} 
            options={{ title: 'Current Groups' }}
          />
          <Stack.Screen 
            name="UnlockedGroups" 
            component={UnlockedGroupsScreen} 
            options={{ title: 'Unlocked Groups' }}
          />
          <Stack.Screen 
            name="Group" 
            component={GroupScreen} 
            options={{ title: 'Group' }}
          />
          <Stack.Screen 
            name="MediaView" 
            component={MediaViewScreen} 
            options={{ title: 'View Media' }}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </GroupProvider>
  );
}
