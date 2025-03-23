import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time Capsule</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CreateGroup')}>
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.buttonText}>Create New Group</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('CurrentGroups')}>
        <Ionicons name="lock-closed" size={24} color="#fff" />
        <Text style={styles.buttonText}>Current Groups</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('UnlockedGroups')}>
        <Ionicons name="lock-open" size={24} color="#fff" />
        <Text style={styles.buttonText}>Unlocked Groups</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#000',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 