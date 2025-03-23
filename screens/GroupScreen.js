import React from 'react';
import { View, Text, Button, Image, FlatList, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { useGroups } from '../context/GroupContext';

export default function GroupScreen({ route, navigation }) {
  const { groupName, unlockDate, isUnlocked } = route.params || {};
  const { groups, unlockedGroups, addPhotoToGroup } = useGroups();
  
  const currentGroup = isUnlocked 
    ? unlockedGroups.find(g => g.name === groupName)
    : groups.find(g => g.name === groupName);

  const media = currentGroup?.media || [];

  const pickMedia = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to your photos to use this feature.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const mediaUri = result.assets[0].uri;
        const isVideo = result.assets[0].type === 'video';
        addPhotoToGroup(currentGroup.id, mediaUri, isVideo);
      }
    } catch (error) {
      Alert.alert('Error', 'There was a problem adding your media.');
    }
  };

  const openMedia = (item) => {
    navigation.navigate('MediaView', {
      mediaUri: item.uri,
      groupId: currentGroup.id,
      isVideo: item.isVideo,
      groupName: currentGroup.name
    });
  };

  const renderMediaItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => openMedia(item)}
      style={styles.mediaItem}
    >
      {item.isVideo ? (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: item.uri }}
            style={styles.media}
            resizeMode="cover"
            shouldPlay={false}
            isMuted={true}
          />
          <Text style={styles.videoIcon}>🎥</Text>
        </View>
      ) : (
        <Image
          source={{ uri: item.uri }}
          style={styles.media}
          resizeMode="cover"
        />
      )}
    </TouchableOpacity>
  );

  if (!currentGroup) {
    return (
      <View style={styles.container}>
        <Text>Loading group...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{groupName}</Text>
      
      {!isUnlocked && (
        <View style={styles.controls}>
          <Text>Unlocks on: {new Date(unlockDate).toLocaleDateString()}</Text>
          <Button title="Add Photo/Video" onPress={pickMedia} />
        </View>
      )}
      
      <FlatList
        data={media}
        numColumns={2}
        keyExtractor={(item) => item.id || item.uri}
        renderItem={renderMediaItem}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No media in this group yet.</Text>
        )}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 15,
  },
  controls: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  gridContainer: {
    padding: 5,
  },
  mediaItem: {
    flex: 1,
    margin: 5,
    aspectRatio: 1,
    maxWidth: '50%',
  },
  media: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  videoIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  }
}); 