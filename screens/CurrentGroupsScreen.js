import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Button } from 'react-native';
import { useGroups } from '../context/GroupContext';

export default function CurrentGroupsScreen({ navigation }) {
  const { groups } = useGroups();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const handleGroupPress = (group) => {
    navigation.navigate('Group', { 
      groupName: group.name,
      unlockDate: group.unlockDate,
      isUnlocked: false
    });
  };

  const handleLongPress = (group) => {
    setSelectedGroup(group);
    setShowPasswordInput(true);
    setPassword('');
  };

  const handleUnlock = () => {
    if (password === '1234') {
      navigation.navigate('Group', {
        groupName: selectedGroup.name,
        unlockDate: selectedGroup.unlockDate,
        isUnlocked: true
      });
    } else {
      alert('Incorrect password');
    }
    setShowPasswordInput(false);
    setPassword('');
  };

  return (
    <View>
      {showPasswordInput && (
        <View>
          <TextInput
            placeholder="Enter password to unlock"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Unlock" onPress={handleUnlock} />
        </View>
      )}

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => handleGroupPress(item)}
            onLongPress={() => handleLongPress(item)}
          >
            <View>
              <Text>{item.name}</Text>
              <Text>Unlocks: {new Date(item.unlockDate).toLocaleDateString()}</Text>
              <Text>Photos: {item.photoCount}</Text>
              <Text>Long press to unlock with password</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
} 