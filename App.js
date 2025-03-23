import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { GroupProvider } from './context/GroupContext';

// Import all screens
import HomeScreen from './screens/HomeScreen';
import CreateGroupScreen from './screens/CreateGroupScreen';
import CurrentGroupsScreen from './screens/CurrentGroupsScreen';
import UnlockedGroupsScreen from './screens/UnlockedGroupsScreen';
import GroupScreen from './screens/GroupScreen';
import MediaViewScreen from './screens/MediaViewScreen';
import SetUnlockDateScreen from './screens/SetUnlockDateScreen';
import GroupsScreen from './screens/GroupsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <GroupProvider>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
          <Stack.Screen name="CurrentGroups" component={CurrentGroupsScreen} />
          <Stack.Screen name="UnlockedGroups" component={UnlockedGroupsScreen} />
          <Stack.Screen name="Group" component={GroupScreen} />
          <Stack.Screen name="MediaView" component={MediaViewScreen} />
          <Stack.Screen name="SetUnlockDate" component={SetUnlockDateScreen} />
          <Stack.Screen name="Groups" component={GroupsScreen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </GroupProvider>
    </NavigationContainer>
  );
}
