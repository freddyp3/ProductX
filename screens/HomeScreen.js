import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time Capsule</Text>
      <Button
        title="Create New Group"
        onPress={() => navigation.navigate('CreateGroup')}
      />
      <Button
        title="Current Groups"
        onPress={() => navigation.navigate('CurrentGroups')}
      />
      <Button
        title="Unlocked Groups"
        onPress={() => navigation.navigate('UnlockedGroups')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
}); 