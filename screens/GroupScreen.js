import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useGroups } from "../context/GroupContext";

const { width } = Dimensions.get("window");

export default function GroupScreen({ route, navigation }) {
  const { groupName, unlockDate, isUnlocked } = route.params || {};
  const { groups, addPhotoToGroup } = useGroups();

  // Find the current group from our groups context
  const currentGroup = groups.find((g) => g.name === groupName);

  // Ensure mediaItems is properly initialized
  const mediaItems = currentGroup?.mediaItems || [];

  // Log the current group for debugging
  useEffect(() => {
    if (currentGroup) {
      console.log(`Found group: ${currentGroup.name}`);
      console.log(`Media items count: ${mediaItems.length}`);
    } else {
      console.log(`Group not found: ${groupName}`);
    }
  }, [currentGroup, groupName, mediaItems]);

  // Extract photo and video URIs
  const photos = mediaItems
    .filter((item) => item && item.type === "photo" && item.uri)
    .map((item) => item.uri);
  const videos = mediaItems
    .filter((item) => item && item.type === "video" && item.uri)
    .map((item) => item.uri);
  const photoCount = photos.length || currentGroup?.photoCount || 0;
  const videoCount = videos.length || currentGroup?.videoCount || 0;

  // State for member filtering
  const [selectedMember, setSelectedMember] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  // Mock members data (in a real app, this would come from the group data)
  const members = currentGroup?.members || [];
  if (!members.includes("You")) {
    members.unshift("You");
  }

  // Member colors mapping
  const memberColors = {
    You: "#1ED860",
    Alex: "#1ED860",
    Reagan: "#1D6F1A",
    Freddy: "#25603A",
    Marco: "#2A6B7B",
  };

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
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
      // Determine if it's a video based on the mimeType
      const asset = result.assets[0];
      const isVideo = asset.type && asset.type.startsWith("video");

      // Save the media to the group
      addPhotoToGroup(currentGroup.id, asset.uri, isVideo ? "video" : "photo");
    }
  };

  const handleMemberPress = (member) => {
    // Toggle selection
    if (selectedMember === member) {
      setSelectedMember(null);
    } else {
      setSelectedMember(member);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: comments.length + 1,
        text: newComment,
        user: "You", // In a real app, this would be the current user
        color: memberColors["You"],
      };
      setComments([...comments, newCommentObj]);
      setNewComment("");
    }
  };

  // For debugging - log the photos array
  useEffect(() => {
    console.log(`Group ${groupName} has ${photos.length} photos`);
    console.log(`Media items: ${JSON.stringify(mediaItems.slice(0, 2))}`);
  }, [photos, groupName, mediaItems]);

  // Filter photos by selected member if needed
  // This is a simplified approach - in a real app, each photo would have an owner field
  const filteredPhotos = selectedMember
    ? photos.filter(
        (_, index) =>
          index % members.length === members.indexOf(selectedMember),
      )
    : photos;

  if (isUnlocked) {
    // View for unlocked groups - show the new design
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../assets/back-icon.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            {/* Group Name Header */}
            <View style={styles.groupHeader}>
              <Text style={styles.groupName}>{groupName} ⭐️️</Text>
            </View>

            {/* Member Tags */}
            <View style={styles.membersContainer}>
              {members.map((member, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.memberTag,
                    { backgroundColor: memberColors[member] || "#1ED860" },
                    selectedMember === member && styles.selectedMemberTag,
                  ]}
                  onPress={() => handleMemberPress(member)}
                >
                  <Text style={styles.memberTagText}>{member}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Photo Grid - First Row */}
            {filteredPhotos.length > 0 ? (
              <View style={styles.photoGrid}>
                {filteredPhotos.slice(0, 4).map((photo, index) => (
                  <TouchableOpacity
                    key={`row1-${index}`}
                    onPress={() =>
                      navigation.navigate("PhotoDetail", {
                        photoUri: photo,
                        photoDate:
                          currentGroup?.mediaItems?.[index]?.creationTime ||
                          new Date().toISOString(),
                        groupId: currentGroup?.id,
                      })
                    }
                  >
                    <Image
                      source={{ uri: photo }}
                      style={styles.gridPhoto}
                      defaultSource={require("../assets/placeholder-image.png")}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.noPhotosContainer}>
                <Text style={styles.noPhotosText}>No photos available</Text>
              </View>
            )}

            {/* Photo Grid - Second Row with Feature Photo */}
            {filteredPhotos.length > 4 && (
              <View style={styles.featureRow}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("PhotoDetail", {
                      photoUri: filteredPhotos[4],
                      photoDate:
                        currentGroup?.mediaItems?.[4]?.creationTime ||
                        new Date().toISOString(),
                      groupId: currentGroup?.id,
                    })
                  }
                >
                  <Image
                    source={{ uri: filteredPhotos[4] }}
                    style={styles.featurePhoto}
                  />
                </TouchableOpacity>
                <View style={styles.smallPhotosContainer}>
                  {filteredPhotos.slice(5, 9).map((photo, index) => (
                    <TouchableOpacity
                      key={`row2-small-${index}`}
                      onPress={() =>
                        navigation.navigate("PhotoDetail", {
                          photoUri: photo,
                          photoDate:
                            currentGroup?.mediaItems?.[index + 5]
                              ?.creationTime || new Date().toISOString(),
                          groupId: currentGroup?.id,
                        })
                      }
                    >
                      <Image
                        source={{ uri: photo }}
                        style={styles.smallGridPhoto}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Photo Grid - Third Row */}
            {filteredPhotos.length > 9 && (
              <View style={styles.photoGrid}>
                {filteredPhotos.slice(9, 13).map((photo, index) => (
                  <TouchableOpacity
                    key={`row3-${index}`}
                    onPress={() =>
                      navigation.navigate("PhotoDetail", {
                        photoUri: photo,
                        photoDate:
                          currentGroup?.mediaItems?.[index + 9]?.creationTime ||
                          new Date().toISOString(),
                        groupId: currentGroup?.id,
                      })
                    }
                  >
                    <Image source={{ uri: photo }} style={styles.gridPhoto} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Photo Grid - Fourth Row with varying sizes */}
            {filteredPhotos.length > 13 && (
              <View style={styles.lastRow}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("PhotoDetail", {
                      photoUri: filteredPhotos[13],
                      photoDate:
                        currentGroup?.mediaItems?.[13]?.creationTime ||
                        new Date().toISOString(),
                      groupId: currentGroup?.id,
                    })
                  }
                >
                  <Image
                    source={{ uri: filteredPhotos[13] }}
                    style={styles.widePhoto}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("PhotoDetail", {
                      photoUri: filteredPhotos[14],
                      photoDate:
                        currentGroup?.mediaItems?.[14]?.creationTime ||
                        new Date().toISOString(),
                      groupId: currentGroup?.id,
                    })
                  }
                >
                  <Image
                    source={{ uri: filteredPhotos[14] }}
                    style={styles.widePhoto}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("PhotoDetail", {
                      photoUri: filteredPhotos[15],
                      photoDate:
                        currentGroup?.mediaItems?.[15]?.creationTime ||
                        new Date().toISOString(),
                      groupId: currentGroup?.id,
                    })
                  }
                >
                  <Image
                    source={{ uri: filteredPhotos[15] }}
                    style={styles.fullWidthPhoto}
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* Comments Section */}
            <View style={styles.commentsContainer}>
              {comments.map((comment, index) => (
                <View
                  key={index}
                  style={[
                    styles.commentBubble,
                    { backgroundColor: comment.color },
                  ]}
                >
                  <View style={styles.userIcon}>
                    <Image
                      source={require("../assets/user-icon.png")}
                      style={styles.userIconImage}
                    />
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                </View>
              ))}

              {/* Comment Input */}
              <View style={styles.commentInputContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Type your message here"
                  placeholderTextColor="rgba(17, 17, 17, 0.5)"
                  value={newComment}
                  onChangeText={setNewComment}
                />
                <TouchableOpacity onPress={handleAddComment}>
                  <Image
                    source={require("../assets/send-icon.png")}
                    style={styles.sendIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // View for locked groups - only allow adding photos, don't show existing photos
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image
          source={require("../assets/back-icon.png")}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>{groupName}</Text>
        <Text style={styles.unlockDate}>
          Unlocks on: {new Date(unlockDate).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.photoCountContainer}>
        <Text style={styles.photoCount}>
          {photoCount > 0 &&
            `${photoCount} ${photoCount === 1 ? "photo" : "photos"} added`}
          {photoCount > 0 && videoCount > 0 && " and "}
          {videoCount > 0 &&
            `${videoCount} ${videoCount === 1 ? "video" : "videos"} added`}
          {photoCount === 0 && videoCount === 0 && "No media added yet"}
        </Text>
        <Text style={styles.photoHint}>
          Media will be visible when this momento unlocks
        </Text>
      </View>

      <View style={styles.addButtonContainer}>
        <Button
          title="Add Photo/Video from Camera Roll"
          onPress={pickImage}
          color="#1ED860"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 8,
    paddingTop: 80, // To account for the back button
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
  },
  groupHeader: {
    alignItems: "center",
    marginBottom: 15,
  },
  groupName: {
    color: "#111",
    fontSize: 17,
    fontWeight: "700",
    backgroundColor: "#1ED860",
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 8,
    textAlign: "center",
  },
  membersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 15,
    gap: 6,
  },
  memberTag: {
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 4,
    marginBottom: 4,
  },
  selectedMemberTag: {
    borderWidth: 2,
    borderColor: "#FFF",
  },
  memberTagText: {
    color: "#111",
    fontSize: 10,
    fontWeight: "500",
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  noPhotosContainer: {
    padding: 20,
    backgroundColor: "#212121",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  noPhotosText: {
    color: "#DFDFDF",
    fontSize: 16,
    fontWeight: "500",
  },
  gridPhoto: {
    width: (width - 32) / 4 - 4,
    height: 90,
    borderRadius: 5,
    marginBottom: 6,
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  featurePhoto: {
    width: (width - 32) / 2 - 3,
    height: 186,
    borderRadius: 5,
  },
  smallPhotosContainer: {
    width: (width - 32) / 2 - 3,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  smallGridPhoto: {
    width: (width - 32) / 4 - 4,
    height: 90,
    borderRadius: 5,
    marginBottom: 6,
  },
  lastRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  widePhoto: {
    width: ((width - 32) / 4) * 1.5 - 3,
    height: 90,
    borderRadius: 5,
    marginBottom: 6,
  },
  fullWidthPhoto: {
    width: width - 16,
    height: 90,
    borderRadius: 5,
    marginBottom: 6,
  },
  commentsContainer: {
    backgroundColor: "#1B1B1B",
    borderRadius: 5,
    padding: 6,
    marginTop: 7,
  },
  commentBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 5,
    padding: 4,
    marginBottom: 7,
  },
  userIcon: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  userIconImage: {
    width: 20,
    height: 20,
  },
  commentText: {
    color: "#111",
    fontSize: 10,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1ED860",
    borderRadius: 5,
    padding: 4,
    marginTop: 32,
  },
  commentInput: {
    flex: 1,
    color: "#111",
    fontSize: 10,
  },
  sendIcon: {
    width: 22,
    height: 22,
  },

  // Styles for locked view (existing styles)
  header: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#DFDFDF",
    marginBottom: 10,
  },
  unlockDate: {
    fontSize: 16,
    color: "#DFDFDF",
    marginBottom: 20,
  },
  photoCountContainer: {
    backgroundColor: "#212121",
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: "center",
    marginHorizontal: 20,
  },
  photoCount: {
    fontSize: 16,
    color: "#DFDFDF",
    fontWeight: "600",
    marginBottom: 5,
  },
  photoHint: {
    fontSize: 14,
    color: "#777",
    fontStyle: "italic",
  },
  addButtonContainer: {
    marginTop: 20,
    alignItems: "center",
    marginHorizontal: 20,
  },
});
