import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useGroups } from '../context/GroupContext';

export default function CurrentGroupsScreen({ navigation }) {
  const { groups } = useGroups();

  const handleGroupPress = (group) => {
    navigation.navigate('Group', { 
      groupName: group.name,
      unlockDate: group.unlockDate,
      isUnlocked: false
    });
  };

  return (
    <View>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleGroupPress(item)}>
            <View>
              <Text>{item.name}</Text>
              <Text>Unlocks: {new Date(item.unlockDate).toLocaleDateString()}</Text>
              <Text>Photos: {item.photoCount}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
} 