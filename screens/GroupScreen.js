import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Image, FlatList, Alert, TouchableOpacity, StyleSheet, TextInput, ScrollView, Modal, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { Audio } from 'expo-av';
import { useGroups } from '../context/GroupContext';
import LockedMediaPlaceholder from '../components/LockedMediaPlaceholder';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';

export default function GroupScreen({ route, navigation }) {
  const { groupId, isUnlocked } = route.params;
  const { groups, unlockedGroups, addPhotoToGroup, removePhotoFromGroup, unlockGroup } = useGroups();
  const [password, setPassword] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [lastAddedPhoto, setLastAddedPhoto] = useState(null);
  const [showUndoButton, setShowUndoButton] = useState(false);
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraMode, setIsCameraMode] = useState(true); // true for photo, false for video
  
  const group = isUnlocked 
    ? unlockedGroups.find(g => g.id === groupId)
    : groups.find(g => g.id === groupId);

  const media = group?.media || [];

  useEffect(() => {
    (async () => {
      // Request audio recording permissions for video
      if (!isCameraMode) {
        const audioStatus = await Audio.requestPermissionsAsync();
        if (audioStatus.status !== 'granted') {
          Alert.alert(
            'Audio Permission Required',
            'Please grant microphone access to record videos with sound.'
          );
        }
      }
    })();
  }, [isCameraMode]);

  const handleCameraPress = async () => {
    if (!permission?.granted) {
      const newPermission = await requestPermission();
      if (!newPermission.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please grant camera access in your phone settings to take photos.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
        return;
      }
    }
    setShowCamera(true);
  };

  const handleUnlock = () => {
    if (password === '1234') {
      unlockGroup(groupId);
      navigation.goBack();
      Alert.alert('Success', 'Group unlocked successfully!');
    } else {
      Alert.alert('Error', 'Incorrect password');
      setPassword('');
    }
  };

  const handleAddMedia = async () => {
    try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const isVideo = asset.type === 'video';
        const mediaId = Date.now().toString();
        await addPhotoToGroup(groupId, asset.uri, isVideo, mediaId);
        setLastAddedPhoto({ id: mediaId, uri: asset.uri, isVideo });
        setShowUndoButton(true);
        setTimeout(() => {
          setShowUndoButton(false);
          setLastAddedPhoto(null);
        }, 5000); // Hide undo button after 5 seconds
      }
    } catch (error) {
      console.error('Error adding media:', error);
      alert('There was a problem adding your media. Please try again.');
    }
  };

  const handleUndo = () => {
    if (lastAddedPhoto) {
      removePhotoFromGroup(groupId, lastAddedPhoto.id);
      setLastAddedPhoto(null);
      setShowUndoButton(false);
    }
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        setLoading(true);
        const photo = await cameraRef.current.takePictureAsync();
        const mediaId = Date.now().toString();
        await addPhotoToGroup(groupId, photo.uri, false, mediaId);
        setShowCamera(false);
        setLastAddedPhoto({ id: mediaId, uri: photo.uri, isVideo: false });
        setShowUndoButton(true);
        setTimeout(() => {
          setShowUndoButton(false);
          setLastAddedPhoto(null);
        }, 5000); // Hide undo button after 5 seconds
      } catch (error) {
        console.error('Error taking photo:', error);
        alert('There was a problem taking the photo. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const startRecording = async () => {
    if (!cameraRef.current) {
      console.error('Camera ref is not available');
      return;
    }

    try {
      console.log('Starting recording...');
      setIsRecording(true);

      const options = {
        maxDuration: 60,
        quality: '1080p',
        mute: false
      };

      await cameraRef.current.recordAsync(options);
      console.log('Recording started successfully');
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Recording Error', 'Failed to start recording. Please try again.');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (!cameraRef.current || !isRecording) {
      console.log('No active recording to stop');
      return;
    }

    try {
      console.log('Stopping recording...');
      await cameraRef.current.stopRecording();
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'Failed to stop recording. Please try again.');
      setIsRecording(false);
    }
  };

  const handleRecordingFinished = async (video) => {
    try {
      console.log('Processing recorded video:', video);
      const asset = {
        uri: video.uri,
        type: 'video',
        name: `video_${Date.now()}.mp4`
      };
      
      await addPhotoToGroup(groupId, asset);
      console.log('Video added to group successfully');
    } catch (error) {
      console.error('Error processing video:', error);
      Alert.alert('Error', 'Failed to save video. Please try again.');
    }
  };

  const handleCameraAction = async () => {
    if (isCameraMode) {
      await takePhoto();
    } else {
      console.log('Camera action for video, isRecording:', isRecording);
      if (isRecording) {
        await stopRecording();
      } else {
        await startRecording();
      }
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
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.addButton, styles.cameraButton]} 
              onPress={handleCameraPress}
            >
              <Ionicons name="camera" size={24} color="#fff" />
              <Text style={styles.addButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={handleAddMedia}
            >
              <Ionicons name="images" size={24} color="#fff" />
              <Text style={styles.addButtonText}>Choose Media</Text>
            </TouchableOpacity>
          </View>

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

      {showUndoButton && (
        <View style={styles.undoContainer}>
          <TouchableOpacity 
            style={styles.undoButton}
            onPress={handleUndo}
          >
            <Ionicons name="arrow-undo" size={20} color="#fff" />
            <Text style={styles.undoButtonText}>Undo</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={showCamera}
        animationType="slide"
        onRequestClose={() => setShowCamera(false)}>
        <View style={styles.cameraContainer}>
          {permission?.granted ? (
            <CameraView 
              style={styles.camera}
              ref={cameraRef}
              isActive={true}
              enableAudio={!isCameraMode}
              onMountError={(error) => {
                console.error("Camera mount error:", error);
                Alert.alert("Camera Error", "Failed to start camera. Please try again.");
                setShowCamera(false);
              }}
              onError={(error) => {
                console.error("Camera error:", error);
                Alert.alert("Camera Error", "An error occurred with the camera.");
              }}
              onRecordingFinished={async (video) => {
                console.log('Recording finished:', video);
                try {
                  const mediaId = Date.now().toString();
                  await addPhotoToGroup(groupId, video.uri, true, mediaId);
                  setShowCamera(false);
                  setLastAddedPhoto({ id: mediaId, uri: video.uri, isVideo: true });
                  setShowUndoButton(true);
                  setTimeout(() => {
                    setShowUndoButton(false);
                    setLastAddedPhoto(null);
                  }, 5000);
                } catch (error) {
                  console.error('Error saving video:', error);
                  Alert.alert('Error', 'Failed to save video. Please try again.');
                }
                setIsRecording(false);
              }}
              onInitialized={() => {
                console.log('Camera initialized');
              }}
              videoStabilizationMode="auto"
              zoom={0}
            >
              <View style={styles.cameraControls}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowCamera(false)}>
                  <Ionicons name="close" size={32} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.switchModeButton}
                  onPress={() => {
                    if (isRecording) {
                      Alert.alert('Stop Recording', 'Please stop recording before switching modes');
                      return;
                    }
                    setIsCameraMode(!isCameraMode);
                  }}>
                  <Ionicons 
                    name={isCameraMode ? "videocam" : "camera"} 
                    size={28} 
                    color="#fff" 
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.captureButton,
                    isRecording && styles.recordingButton
                  ]}
                  onPress={handleCameraAction}
                  disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <View style={[
                      styles.captureButtonInner,
                      isRecording && styles.recordingButtonInner
                    ]} />
                  )}
                </TouchableOpacity>
              </View>
            </CameraView>
          ) : (
            <View style={styles.permissionDenied}>
              <Text style={styles.permissionText}>
                Camera permission is required to take photos and videos
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setShowCamera(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  cameraButton: {
    backgroundColor: '#34C759',
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
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
  },
  permissionDenied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
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
  undoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  undoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 12,
    borderRadius: 25,
    gap: 8,
  },
  undoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  switchModeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 20,
  },
  recordingButton: {
    backgroundColor: '#FF3B30',
  },
  recordingButtonInner: {
    backgroundColor: '#FF3B30',
    borderColor: '#fff',
  },
}); 