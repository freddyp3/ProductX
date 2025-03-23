import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Video } from 'expo-av';
import { useGroups } from '../context/GroupContext';

export default function MediaViewScreen({ route }) {
  const { mediaUri, groupId, isVideo, groupName } = route.params;
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const { groups, unlockedGroups, addCommentToMedia } = useGroups();

  const allGroups = [...groups, ...unlockedGroups];
  const currentGroup = allGroups.find(g => g.id === groupId);
  const currentMedia = currentGroup?.media?.find(m => m.uri === mediaUri);
  const comments = currentMedia?.comments || [];

  const handleSendComment = () => {
    if (newComment.trim()) {
      const comment = {
        text: newComment.trim(),
        user: 'User',
      };

      addCommentToMedia(groupId, currentMedia.id, comment, replyingTo?.id);
      setNewComment('');
      setReplyingTo(null);
      Keyboard.dismiss();
    }
  };

  const handleReply = (comment) => {
    setReplyingTo(comment);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const renderReply = ({ item }) => (
    <View style={styles.reply}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentUser}>{item.user}</Text>
        <Text style={styles.commentTime}>{formatDate(item.timestamp)}</Text>
      </View>
      <Text style={styles.commentText}>{item.text}</Text>
    </View>
  );

  const renderComment = ({ item }) => (
    <View style={styles.comment}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentUser}>{item.user}</Text>
        <Text style={styles.commentTime}>{formatDate(item.timestamp)}</Text>
      </View>
      <Text style={styles.commentText}>{item.text}</Text>
      
      <TouchableOpacity 
        style={styles.replyButton} 
        onPress={() => handleReply(item)}
      >
        <Text style={styles.replyButtonText}>Reply</Text>
      </TouchableOpacity>

      {item.replies && item.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          <FlatList
            data={item.replies}
            renderItem={renderReply}
            keyExtractor={(reply) => reply.id}
          />
        </View>
      )}
    </View>
  );

  if (!mediaUri) {
    return (
      <View style={styles.container}>
        <Text>Error loading media</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.groupName}>{groupName}</Text>
        
        <View style={styles.mediaContainer}>
          {isVideo ? (
            <Video
              source={{ uri: mediaUri }}
              style={styles.media}
              useNativeControls
              resizeMode="contain"
              shouldPlay={false}
            />
          ) : (
            <Image
              source={{ uri: mediaUri }}
              style={styles.media}
              resizeMode="contain"
            />
          )}
        </View>

        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <Text style={styles.emptyComments}>No comments yet</Text>
          )}
          style={styles.commentsList}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.keyboardAvoid}
      >
        {replyingTo && (
          <View style={styles.replyingToContainer}>
            <Text style={styles.replyingToText}>
              Replying to {replyingTo.user}
            </Text>
            <TouchableOpacity 
              onPress={() => setReplyingTo(null)}
              style={styles.cancelReplyButton}
            >
              <Text style={styles.cancelReplyText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={replyingTo ? "Write a reply..." : "Add a comment..."}
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxHeight={100}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !newComment.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSendComment}
            disabled={!newComment.trim()}
          >
            <Text style={[
              styles.sendButtonText,
              !newComment.trim() && styles.sendButtonTextDisabled
            ]}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
  groupName: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 15,
  },
  mediaContainer: {
    height: 300,
    backgroundColor: '#000',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  commentsList: {
    flex: 1,
    padding: 15,
  },
  comment: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reply: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    marginLeft: 20,
    marginTop: 5,
    borderLeftWidth: 2,
    borderLeftColor: '#ddd',
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  commentTime: {
    fontSize: 12,
    color: '#666',
  },
  commentText: {
    fontSize: 16,
  },
  emptyComments: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  keyboardAvoid: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sendButtonTextDisabled: {
    color: '#fff',
  },
  replyButton: {
    marginTop: 5,
    padding: 5,
  },
  replyButtonText: {
    color: '#007AFF',
    fontSize: 14,
  },
  repliesContainer: {
    marginTop: 10,
  },
  replyingToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  replyingToText: {
    color: '#666',
    fontSize: 14,
  },
  cancelReplyButton: {
    padding: 5,
  },
  cancelReplyText: {
    color: '#666',
    fontSize: 16,
  },
}); 