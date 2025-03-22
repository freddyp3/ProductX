import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

export default function UnlockedGroupsScreen({ navigation }) {
  // Temporary mock data - this would come from Firebase in a real app
  const unlockedGroups = [
    { 
      id: '1', 
      name: 'Birthday 2023', 
      unlockDate: '2023-12-01',
      photoCount: 23
    },
    { 
      id: '2', 
      name: 'New Years', 
      unlockDate: '2024-01-01',
      photoCount: 45
    },
  ];

  const handleGroupPress = (group) => {
    navigation.navigate('Group', { 
      groupName: group.name,
      unlockDate: group.unlockDate,
      isUnlocked: true
    });
  };

  return (
    <View>
      <FlatList
        data={unlockedGroups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleGroupPress(item)}>
            <View>
              <Text>{item.name}</Text>
              <Text>Unlocked on: {new Date(item.unlockDate).toLocaleDateString()}</Text>
              <Text>Photos: {item.photoCount}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
} 