import React, { useState } from 'react';
import { View, Text, Button, Image, FlatList, Alert, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { useGroups } from '../context/GroupContext';
import LockedMediaPlaceholder from '../components/LockedMediaPlaceholder';

export default function GroupScreen({ route, navigation }) {
  const { groupId, isUnlocked } = route.params;
  const { groups, unlockedGroups, addPhotoToGroup, unlockGroup } = useGroups();
  const [password, setPassword] = useState('');
  
  const group = isUnlocked 
    ? unlockedGroups.find(g => g.id === groupId)
    : groups.find(g => g.id === groupId);

  const media = group?.media || [];

  const handleUnlock = () => {
    if (password === '1234') {
      unlockGroup(groupId);
      navigation.goBack(); // Return to the groups list
      Alert.alert('Success', 'Group unlocked successfully!');
    } else {
      Alert.alert('Error', 'Incorrect password');
      setPassword('');
    }
  };

  const handleAddMedia = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      // Pick the media
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const isVideo = asset.type === 'video';
        addPhotoToGroup(groupId, asset.uri, isVideo);
      }
    } catch (error) {
      console.error('Error adding media:', error);
      alert('There was a problem adding your media. Please try again.');
    }
  };

  const renderMediaItem = ({ item }) => {
    if (!isUnlocked && item.isLocked) {
      return (
        <TouchableOpacity
          style={styles.mediaItem}
          onPress={() => navigation.navigate('MediaView', {
            mediaId: item.id,
            groupId,
            isUnlocked
          })}
        >
          <LockedMediaPlaceholder />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.mediaItem}
        onPress={() => navigation.navigate('MediaView', {
          mediaId: item.id,
          groupId,
          isUnlocked
        })}
      >
        {item.isVideo ? (
          <View style={styles.videoContainer}>
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoIcon}>🎥</Text>
            </View>
            <View style={styles.playButton}>
              <Text style={styles.playButtonText}>▶️</Text>
            </View>
          </View>
        ) : (
          <Image source={{ uri: item.uri }} style={styles.mediaPreview} />
        )}
      </TouchableOpacity>
    );
  };

  const CommentItem = ({ comment, onReply, level = 0 }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');

    const handleSubmitReply = () => {
      if (replyText.trim()) {
        onReply({
          text: replyText,
          parentId: comment.id
        });
        setReplyText('');
        setShowReplyInput(false);
      }
    };

    return (
      <View style={[styles.commentContainer, { marginLeft: level * 20 }]}>
        <Text style={styles.commentText}>{comment.text}</Text>
        <Text style={styles.commentTimestamp}>
          {new Date(comment.timestamp).toLocaleString()}
        </Text>
        
        <TouchableOpacity 
          style={styles.replyButton}
          onPress={() => setShowReplyInput(!showReplyInput)}
        >
          <Text style={styles.replyButtonText}>Reply</Text>
        </TouchableOpacity>

        {showReplyInput && (
          <View style={styles.replyInputContainer}>
            <TextInput
              style={styles.replyInput}
              value={replyText}
              onChangeText={setReplyText}
              placeholder="Write a reply..."
              multiline
            />
            <TouchableOpacity 
              style={styles.submitReplyButton}
              onPress={handleSubmitReply}
            >
              <Text style={styles.submitReplyText}>Send</Text>
            </TouchableOpacity>
          </View>
        )}

        {comment.replies?.map(reply => (
          <CommentItem
            key={reply.id}
            comment={reply}
            onReply={onReply}
            level={level + 1}
          />
        ))}
      </View>
    );
  };

  if (!group) {
    return (
      <View style={styles.container}>
        <Text>Loading group...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{group.name}</Text>
      
      {!isUnlocked && (
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={handleAddMedia}
          >
            <Text style={styles.addButtonText}>Add Photo/Video</Text>
          </TouchableOpacity>

          <View style={styles.unlockContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter password to unlock"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity 
              style={styles.unlockButton}
              onPress={handleUnlock}
            >
              <Text style={styles.unlockButtonText}>Unlock</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <FlatList
        data={media}
        numColumns={3}
        keyExtractor={item => item.id}
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
  headerContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  unlockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  unlockButton: {
    backgroundColor: '#28CD41',
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  unlockButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  gridContainer: {
    padding: 2,
  },
  mediaItem: {
    flex: 1/3,
    aspectRatio: 1,
    padding: 2,
  },
  mediaPreview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  videoPlaceholder: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIcon: {
    fontSize: 32,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -15 },
      { translateY: -15 }
    ],
    width: 30,
    height: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 20,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentText: {
    fontSize: 14,
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  replyButton: {
    marginTop: 8,
    padding: 8,
  },
  replyButtonText: {
    color: '#007AFF',
    fontSize: 14,
  },
  replyInputContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  submitReplyButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 8,
  },
  submitReplyText: {
    color: '#fff',
  },
}); 