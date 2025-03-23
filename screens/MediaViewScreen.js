import React, { useState, useRef } from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  ScrollView, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView,
  Dimensions,
  Modal
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useGroups } from '../context/GroupContext';
import LockedMediaPlaceholder from '../components/LockedMediaPlaceholder';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function MediaViewScreen({ route }) {
  const { mediaId, groupId, isUnlocked } = route.params;
  const [newComment, setNewComment] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { groups, unlockedGroups, addComment } = useGroups();
  const scrollViewRef = useRef();
  const videoRef = useRef(null);
  
  const group = isUnlocked 
    ? unlockedGroups.find(g => g.id === groupId)
    : groups.find(g => g.id === groupId);
    
  const mediaItem = group?.media?.find(m => m.id === mediaId);

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(groupId, mediaId, newComment.trim());
      setNewComment('');
    }
  };

  const toggleFullScreen = () => {
    if (!mediaItem.isVideo) {
      setIsFullScreen(!isFullScreen);
    }
  };

  if (!mediaItem) {
    return <View style={styles.container}><Text>Media not found</Text></View>;
  }

  if (!isUnlocked && mediaItem.isLocked) {
    return (
      <View style={styles.container}>
        <LockedMediaPlaceholder />
        <Text style={styles.lockedText}>
          This media will be available when the group is unlocked
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal
        visible={isFullScreen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsFullScreen(false)}
      >
        <View style={styles.fullScreenContainer}>
          <TouchableOpacity 
            style={styles.fullScreenImage}
            onPress={() => setIsFullScreen(false)}
          >
            <Image
              source={{ uri: mediaItem.uri }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </Modal>

      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
        >
          <TouchableOpacity 
            style={styles.mediaContainer}
            onPress={toggleFullScreen}
          >
            {mediaItem.isVideo ? (
              <Video
                ref={videoRef}
                source={{ uri: mediaItem.uri }}
                style={styles.media}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                shouldPlay={false}
              />
            ) : (
              <Image
                source={{ uri: mediaItem.uri }}
                style={styles.media}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
          
          <View style={styles.commentsSection}>
            <Text style={styles.commentsHeader}>Comments</Text>
            {mediaItem.comments && mediaItem.comments.length > 0 ? (
              mediaItem.comments.map((comment) => (
                <View key={comment.id} style={styles.commentContainer}>
                  <Text style={styles.commentText}>{comment.text}</Text>
                  <Text style={styles.commentTimestamp}>
                    {new Date(comment.timestamp).toLocaleString()}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noCommentsText}>No comments yet</Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Add a comment..."
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[
                styles.sendButton,
                !newComment.trim() && styles.sendButtonDisabled
              ]} 
              onPress={handleAddComment}
              disabled={!newComment.trim()}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  mediaContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.4,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  commentsSection: {
    padding: 16,
    flex: 1,
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  commentContainer: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentText: {
    fontSize: 16,
  },
  noCommentsText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  inputWrapper: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    marginRight: 8,
    fontSize: 16,
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  lockedText: {
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
    padding: 20,
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'black',
  },
}); 