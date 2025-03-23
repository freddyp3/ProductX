import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native';
import { useGroups } from '../context/GroupContext';

export default function CurrentGroupsScreen({ navigation }) {
  const { groups, unlockGroup } = useGroups();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const handleGroupPress = (group) => {
    navigation.navigate('Group', { 
      groupName: group.name,
      unlockDate: group.unlockDate,
      isUnlocked: false,
      photos: group.photos
    });
  };

  const handleLongPress = (group) => {
    setSelectedGroup(group);
    setShowPasswordInput(true);
    setPassword('');
  };

  const handleUnlock = () => {
    if (password === '1234') {
      unlockGroup(selectedGroup.id);
      setShowPasswordInput(false);
      setPassword('');
      navigation.navigate('Group', {
        groupName: selectedGroup.name,
        unlockDate: selectedGroup.unlockDate,
        isUnlocked: true,
        photos: selectedGroup.photos
      });
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <View style={styles.container}>
      {showPasswordInput && (
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter password to unlock"
            value={password}
            onChangeText={setPassword}
            keyboardType="numeric"
            autoFocus={true}
          />
          <Button title="Unlock" onPress={handleUnlock} />
          <Button title="Cancel" onPress={() => setShowPasswordInput(false)} color="red" />
        </View>
      )}

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => handleGroupPress(item)}
            onLongPress={() => handleLongPress(item)}
            style={styles.groupItem}
          >
            <View>
              <Text style={styles.groupName}>{item.name}</Text>
              <Text>Unlocks: {new Date(item.unlockDate).toLocaleDateString()}</Text>
              <Text>Photos: {item.photoCount}</Text>
              <Text style={styles.hint}>Long press to unlock with password</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  passwordContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  groupItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
}); 