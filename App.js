import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { GroupProvider } from "./context/GroupContext";

// Import screens
import HomeScreen from "./screens/HomeScreen";
import CreateGroupScreen from "./screens/CreateGroupScreen";
import GroupScreen from "./screens/GroupScreen";
import CurrentGroupsScreen from "./screens/CurrentGroupsScreen";
import UnlockedGroupsScreen from "./screens/UnlockedGroupsScreen";
import PhotoDetailScreen from "./screens/PhotoDetailScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GroupProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#000" },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
          <Stack.Screen name="Group" component={GroupScreen} />
          <Stack.Screen name="CurrentGroups" component={CurrentGroupsScreen} />
          <Stack.Screen
            name="UnlockedGroups"
            component={UnlockedGroupsScreen}
          />
          <Stack.Screen name="PhotoDetail" component={PhotoDetailScreen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </GroupProvider>
  );
}
