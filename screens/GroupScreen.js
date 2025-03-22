import React from 'react';
import { View, Text, Button, Image, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useGroups } from '../context/GroupContext';

export default function GroupScreen({ route }) {
  const { groupName, unlockDate, isUnlocked } = route.params || {};
  const { groups, addPhotoToGroup } = useGroups();
  
  // Find the current group from our groups context
  const currentGroup = groups.find(g => g.name === groupName);
  const photos = currentGroup?.photos || [];

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Pick the image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Allow both photos and videos
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Save the photo to the group
      addPhotoToGroup(currentGroup.id, result.assets[0].uri);
    }
  };

  if (isUnlocked) {
    // View for unlocked groups - just show photos
    return (
      <View>
        <Text>{groupName}</Text>
        <FlatList
          data={photos}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={{ width: 150, height: 150, margin: 5 }}
            />
          )}
        />
      </View>
    );
  }

  // View for current groups - allow adding photos
  return (
    <View>
      <Text>{groupName}</Text>
      <Text>Unlocks on: {new Date(unlockDate).toLocaleDateString()}</Text>
      
      <Button title="Add Photo/Video" onPress={pickImage} />
      
      <FlatList
        data={photos}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width: 150, height: 150, margin: 5 }}
          />
        )}
      />
    </View>
  );
} 