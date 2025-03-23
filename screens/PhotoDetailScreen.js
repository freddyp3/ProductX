import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";

export default function PhotoDetailScreen({ route, navigation }) {
  const { photoUri, photoDate, groupId } = route.params || {};
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const formattedDate = photoDate
    ? new Date(photoDate).toLocaleDateString()
    : "Date unknown";

  // Fetch comments from Firestore
  useEffect(() => {
    const fetchComments = async () => {
      if (!groupId) return;

      try {
        const commentsRef = collection(db, "groups", groupId, "comments");
        const q = query(commentsRef, orderBy("timestamp", "asc"));
        const querySnapshot = await getDocs(q);

        const fetchedComments = [];
        querySnapshot.forEach((doc) => {
          fetchedComments.push({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date(),
          });
        });

        if (fetchedComments.length > 0) {
          setComments(fetchedComments);
        }
      } catch (error) {
        console.error("Error fetching comments: ", error);
      }
    };

    fetchComments();
  }, [groupId]);

  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    const userName = "You";

    const newCommentObj = {
      text: newComment,
      user: userName,
      timestamp: new Date(),
    };

    // Add to local state immediately for UI responsiveness
    setComments([...comments, { ...newCommentObj, id: Date.now().toString() }]);
    setNewComment("");

    // Save to Firestore if groupId is available
    if (groupId) {
      try {
        const commentsRef = collection(db, "groups", groupId, "comments");
        await addDoc(commentsRef, {
          ...newCommentObj,
          timestamp: serverTimestamp(),
          userId: auth.currentUser ? auth.currentUser.uid : null,
        });
      } catch (error) {
        console.error("Error adding comment: ", error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require("../assets/back-icon.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.contentContainer}>
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: photoUri }}
              style={styles.photoImage}
              resizeMode="cover"
            />
            <Text style={styles.photoDate}>{formattedDate}</Text>
          </View>

          <View style={styles.commentsContainer}>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Image
                    source={require("../assets/user-icon.png")}
                    style={styles.userIcon}
                  />
                  <Text style={styles.userName}>{comment.user}</Text>
                </View>
                <View style={styles.commentContent}>
                  <Text style={styles.commentText}>{comment.text}</Text>
                  <Text style={styles.commentTime}>
                    {comment.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your message here"
            placeholderTextColor="#777"
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendComment}
          >
            <Image
              source={require("../assets/send-icon.png")}
              style={styles.sendIcon}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: "#DFDFDF",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  photoContainer: {
    width: "100%",
    marginTop: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  photoImage: {
    width: "100%",
    aspectRatio: 0.89,
    borderRadius: 5,
  },
  photoDate: {
    color: "#DFDFDF",
    fontSize: 14,
    fontWeight: "500",
    padding: 8,
    textAlign: "right",
  },
  commentsContainer: {
    borderRadius: 10,
    marginTop: 5,
    width: "100%",
    padding: 7,
  },
  commentItem: {
    marginBottom: 16,
    borderRadius: 5,
    backgroundColor: "#212121",
    padding: 10,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  userIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: "#1ED860",
  },
  userName: {
    color: "#1ED860",
    fontSize: 14,
    fontWeight: "600",
  },
  commentContent: {
    paddingLeft: 26,
  },
  commentText: {
    color: "#DFDFDF",
    fontSize: 14,
    lineHeight: 20,
  },
  commentTime: {
    color: "#777",
    fontSize: 12,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#212121",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "#DFDFDF",
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1ED860",
    justifyContent: "center",
    alignItems: "center",
  },
  sendIcon: {
    width: 22,
    height: 22,
    tintColor: "#111",
  },
});
