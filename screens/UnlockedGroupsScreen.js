import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useGroups } from '../context/GroupContext';

export default function UnlockedGroupsScreen({ navigation }) {
  const { unlockedGroups } = useGroups();

  const handleGroupPress = (group) => {
    navigation.navigate('Group', { 
      groupName: group.name,
      unlockDate: group.unlockDate,
      isUnlocked: true,
      photos: group.photos
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