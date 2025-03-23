import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { GroupProvider } from "./context/GroupContext";

// Import screens
import WelcomeScreen from "./screens/WelcomeScreen";
import HomeScreen from "./screens/HomeScreen";
import CreateGroupScreen from "./screens/CreateGroupScreen";
import GroupScreen from "./screens/GroupScreen";
import CurrentGroupsScreen from "./screens/CurrentGroupsScreen";
import UnlockedGroupsScreen from "./screens/UnlockedGroupsScreen";
import PhotoDetailScreen from "./screens/PhotoDetailScreen";
// Uncomment the line below if you have this screen
// import SetUnlockDateScreen from "./screens/SetUnlockDateScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <GroupProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#000" },
          }}
          initialRouteName="Welcome"
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
          <Stack.Screen name="Group" component={GroupScreen} />
          <Stack.Screen name="CurrentGroups" component={CurrentGroupsScreen} />
          <Stack.Screen
            name="UnlockedGroups"
            component={UnlockedGroupsScreen}
          />
          <Stack.Screen name="PhotoDetail" component={PhotoDetailScreen} />
          {/* Uncomment the line below if you have the SetUnlockDateScreen component */}
          {/* <Stack.Screen name="SetUnlockDate" component={SetUnlockDateScreen} /> */}
        </Stack.Navigator>
        <StatusBar style="light-content" />
      </NavigationContainer>
    </GroupProvider>
  );
}
