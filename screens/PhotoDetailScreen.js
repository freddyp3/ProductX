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
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase";

export default function PhotoDetailScreen({ route, navigation }) {
  const { photoUri, photoDate, groupId } = route.params || {};
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const formattedDate = photoDate
    ? new Date(photoDate).toLocaleDateString()
    : "Date unknown";

  // Validate required parameters
  useEffect(() => {
    if (!photoUri) {
      setError("Photo not found or could not be loaded");
    }
  }, [photoUri]);

  // Fetch comments from Firestore with retry logic
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const fetchComments = async () => {
      if (!groupId) {
        console.log("No groupId provided, skipping comment fetch");
        return;
      }

      if (retryCount > 0) {
        console.log(
          `Retrying fetch comments (attempt ${retryCount}/${maxRetries})...`,
        );
      }

      try {
        console.log(`Fetching comments for group: ${groupId}`);

        // Validate db is available
        if (!db) {
          console.error("Firestore db is not properly initialized");
          if (retryCount < maxRetries) {
            retryCount++;
            const delay = Math.pow(2, retryCount) * 1000;
            console.log(`Waiting ${delay}ms before retry...`);
            setTimeout(fetchComments, delay);
          }
          return;
        }

        // Create a safe reference to the comments collection
        let commentsRef;
        try {
          // Check if groupId is valid
          if (
            !groupId ||
            typeof groupId !== "string" ||
            groupId.trim() === ""
          ) {
            console.error("Invalid groupId:", groupId);
            if (isMounted) setError("Invalid group ID");
            return;
          }

          console.log("Creating document reference for group:", groupId);

          // First try to create a reference to the groups collection
          try {
            // Create a direct path to the comments collection
            commentsRef = collection(db, "groups", groupId, "comments");
            console.log("Successfully created collection reference");
          } catch (collectionError) {
            console.error(
              "Error with direct collection path:",
              collectionError,
            );

            // Fallback: try the two-step approach
            try {
              const groupDocRef = doc(db, "groups", groupId);
              commentsRef = collection(groupDocRef, "comments");
              console.log(
                "Successfully created collection reference with two-step approach",
              );
            } catch (docError) {
              console.error("Error creating document reference:", docError);
              if (isMounted)
                setError("Could not access comments for this group");
              return;
            }
          }
        } catch (refError) {
          console.error("Error creating collection reference:", refError);
          if (isMounted) setError("Failed to load comments");
          return;
        }

        // Create and execute the query with error handling
        try {
          const q = query(commentsRef, orderBy("timestamp", "asc"));
          const querySnapshot = await getDocs(q);

          if (!isMounted) return;

          const fetchedComments = [];
          querySnapshot.forEach((doc) => {
            try {
              const data = doc.data();
              fetchedComments.push({
                id: doc.id,
                ...data,
                timestamp: data.timestamp?.toDate() || new Date(),
                text: data.text || "No comment text",
                user: data.user || "Anonymous",
              });
            } catch (docError) {
              console.error("Error processing document:", docError);
            }
          });

          console.log(`Fetched ${fetchedComments.length} comments`);

          if (isMounted) {
            setComments(fetchedComments);
            // Reset retry count on success
            retryCount = 0;
          }
        } catch (queryError) {
          console.error("Error executing query:", queryError);

          if (isMounted) {
            // If we haven't exceeded max retries, try again
            if (retryCount < maxRetries) {
              retryCount++;
              const delay = Math.pow(2, retryCount) * 1000;
              console.log(`Query failed. Retrying in ${delay}ms...`);
              setTimeout(fetchComments, delay);
            } else {
              // Max retries exceeded, show error
              setError(`Error loading comments: ${queryError.message}`);
              console.error(
                `Failed to fetch comments after ${maxRetries} attempts`,
              );
            }
          }
        }
      } catch (error) {
        console.error("Error fetching comments: ", error);

        if (isMounted) {
          // If we haven't exceeded max retries, try again
          if (retryCount < maxRetries) {
            retryCount++;
            const delay = Math.pow(2, retryCount) * 1000;
            console.log(`Operation failed. Retrying in ${delay}ms...`);
            setTimeout(fetchComments, delay);
          } else {
            // Max retries exceeded, show error
            setError(`Error loading comments: ${error.message}`);
            console.error(
              `Failed to fetch comments after ${maxRetries} attempts`,
            );
          }
        }
      }
    };

    fetchComments();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [groupId, db]);

  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    const userName = "You";

    const newCommentObj = {
      text: newComment,
      user: userName,
      timestamp: new Date(),
    };

    // Generate a temporary ID for local state
    const tempId = Date.now().toString();

    // Add to local state immediately for UI responsiveness
    setComments([...comments, { ...newCommentObj, id: tempId }]);
    setNewComment("");

    // Save to Firestore if groupId is available
    if (groupId) {
      try {
        console.log(`Adding comment to group: ${groupId}`);

        // Validate db is available
        if (!db) {
          console.error("Firestore db is not properly initialized");
          return;
        }

        // Create a safe reference to the comments collection
        let commentsRef;
        try {
          // Check if groupId is valid
          if (
            !groupId ||
            typeof groupId !== "string" ||
            groupId.trim() === ""
          ) {
            console.error("Invalid groupId:", groupId);
            return;
          }

          console.log("Creating document reference for group:", groupId);

          // First try to create a reference to the groups collection
          try {
            // Create a direct path to the comments collection
            commentsRef = collection(db, "groups", groupId, "comments");
            console.log("Successfully created collection reference");
          } catch (collectionError) {
            console.error(
              "Error with direct collection path:",
              collectionError,
            );

            // Fallback: try the two-step approach
            try {
              const groupDocRef = doc(db, "groups", groupId);
              commentsRef = collection(groupDocRef, "comments");
              console.log(
                "Successfully created collection reference with two-step approach",
              );
            } catch (docError) {
              console.error("Error creating document reference:", docError);
              throw new Error("Could not access comments for this group");
            }
          }
        } catch (refError) {
          console.error("Error creating collection reference:", refError);
          throw new Error("Failed to access comments collection");
        }

        // Add the document with error handling
        try {
          const docRef = await addDoc(commentsRef, {
            ...newCommentObj,
            timestamp: serverTimestamp(),
            userId: "anonymous-user", // Use a fixed value instead of auth.currentUser
          });

          console.log(`Comment added with ID: ${docRef.id}`);

          // Update the local comment with the real ID
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === tempId ? { ...comment, id: docRef.id } : comment,
            ),
          );
        } catch (addError) {
          console.error("Error adding document:", addError);

          // Keep the comment in local state but mark it as failed
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === tempId
                ? { ...comment, sendFailed: true }
                : comment,
            ),
          );
        }
      } catch (error) {
        console.error("Error adding comment: ", error);

        // Keep the comment in local state but mark it as failed
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === tempId ? { ...comment, sendFailed: true } : comment,
          ),
        );
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

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../assets/back-icon.png")}
            defaultSource={require("../assets/back-icon.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <ScrollView style={styles.contentContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.goBackButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.goBackButtonText}>Go Back</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoContainer}>
              <Image
                source={
                  photoUri ? { uri: photoUri } : require("../assets/bg.jpg")
                }
                style={styles.photoImage}
                resizeMode="cover"
                onError={() => setError("Failed to load image")}
              />
              <Text style={styles.photoDate}>{formattedDate}</Text>
            </View>
          )}

          <View style={styles.commentsContainer}>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Image
                    source={require("../assets/user-icon.png")}
                    defaultSource={require("../assets/user-icon.png")}
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
              defaultSource={require("../assets/send-icon.png")}
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
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginTop: 50,
  },
  errorText: {
    color: "#DFDFDF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  goBackButton: {
    backgroundColor: "#1ED860",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  goBackButtonText: {
    color: "#111",
    fontSize: 16,
    fontWeight: "700",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 70,
    zIndex: 10,
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
