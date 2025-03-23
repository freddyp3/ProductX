import React, { useState } from "react";
import { Platform, FlatList } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useGroups } from "../context/GroupContext";

export default function CreateGroupScreen({ navigation }) {
  const { addGroup } = useGroups();
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState("");
  const [unlockDate, setUnlockDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [photos, setPhotos] = useState([]);

  const handleAddMember = () => {
    if (newMember.trim()) {
      setMembers([...members, newMember.trim()]);
      setNewMember("");
    }
  };

  const handleRemoveMember = (memberToRemove) => {
    setMembers(members.filter((member) => member !== memberToRemove));
  };

  const handleConfirm = () => {
    const newGroup = {
      id: Date.now().toString(),
      name: groupName,
      members: members,
      unlockDate: unlockDate.toISOString(),
      photoCount: photos.length,
      photos: photos, // Add selected photos
    };

    addGroup(newGroup);

    // Reset navigation stack to Home screen to avoid back button issues
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
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
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      // Add the selected photos to the state
      const newPhotos = result.assets.map((asset) => asset.uri);
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (index) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setUnlockDate(selectedDate);
    }

    // Don't navigate to another screen, just update the date
    // This fixes the "action NAVIGATE with payload was not handled by any navigator" error
  };

  return (
    <ScrollView style={styles.scrollView}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../assets/back-icon.png")}
            defaultSource={require("../assets/back-icon.png")}
            style={styles.backIcon}
            tintColor="#DFDFDF"
          />
        </TouchableOpacity>

        <Text style={styles.title}>Create a Momento</Text>

        {/* Group Name Input */}
        <Text style={styles.label}>Momento Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter momento name"
          placeholderTextColor="#777"
          value={groupName}
          onChangeText={setGroupName}
        />

        <View style={styles.memberInputContainer}>
          <TextInput
            style={styles.memberInput}
            placeholder="Enter member's name"
            placeholderTextColor="#777"
            value={newMember}
            onChangeText={setNewMember}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddMember}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Members List */}
        <View style={styles.membersContainer}>
          {/* User box (always present) */}
          <View style={styles.memberBox}>
            <Text style={styles.memberBoxText}>You</Text>
          </View>

          {/* Added members */}
          {members.map((member, index) => (
            <View key={index} style={styles.memberBoxWrapper}>
              <View style={styles.memberBox}>
                <Text style={styles.memberBoxText}>{member}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveMember(member)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Unlock Date Selection */}
        <Text style={styles.label}>Unlock Date</Text>
        <View style={styles.datePickerContainer}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {unlockDate.toLocaleDateString()}
            </Text>
            {Platform.OS === "ios" && showDatePicker && (
              <DateTimePicker
                value={unlockDate}
                mode="date"
                display="spinner"
                onChange={onDateChange}
                minimumDate={new Date()}
                textColor="#DFDFDF"
                style={styles.iosDatePicker}
              />
            )}
          </TouchableOpacity>

          {Platform.OS === "android" && showDatePicker && (
            <DateTimePicker
              value={unlockDate}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* Photos Section */}
        <Text style={styles.label}>Add Photos/Videos</Text>
        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <Text style={styles.photoButtonText}>Select from Camera Roll</Text>
        </TouchableOpacity>

        {photos.length > 0 && (
          <View style={styles.photosContainer}>
            <Text style={styles.photoCount}>
              {photos.length} {photos.length === 1 ? "photo" : "photos"}{" "}
              selected
            </Text>
            <FlatList
              data={photos}
              horizontal
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.photoWrapper}>
                  <Image source={{ uri: item }} style={styles.photoThumbnail} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Text style={styles.removePhotoButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              )}
              contentContainerStyle={styles.photosList}
            />
          </View>
        )}

        {/* Create Group Button */}
        <TouchableOpacity
          style={[
            styles.createButton,
            (!groupName || members.length === 0) && styles.disabledButton,
          ]}
          onPress={handleConfirm}
          disabled={!groupName || members.length === 0}
        >
          <Text style={styles.createButtonText}>Create Momento</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    padding: 20,
    fontFamily: "System",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 70, // Move down further to match CurrentGroupsScreen
    zIndex: 10,
    padding: 10, // Add padding to increase touch target
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 24,
    marginTop: 40, // Increase top margin to move down
    marginBottom: 30,
    textAlign: "center",
    color: "#DFDFDF",
    fontWeight: "700",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    color: "#DFDFDF",
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#212121",
    color: "#DFDFDF",
  },
  memberInputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  memberInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: "#212121",
    color: "#DFDFDF",
  },
  addButton: {
    backgroundColor: "#1ED860",
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  addButtonText: {
    color: "#111",
    fontWeight: "700",
  },
  membersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    gap: 10,
  },
  memberBoxWrapper: {
    position: "relative",
  },
  memberBox: {
    backgroundColor: "#1ED860",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 5,
    marginBottom: 5,
  },
  memberBoxText: {
    color: "#111",
    fontWeight: "700",
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -3,
    backgroundColor: "#FF3B30",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  datePickerContainer: {
    marginBottom: 25,
  },
  dateButton: {
    backgroundColor: "#212121",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  dateButtonText: {
    color: "#DFDFDF",
    fontWeight: "600",
  },
  iosDatePicker: {
    width: "100%",
    backgroundColor: "#212121",
    marginTop: 10,
  },
  photoButton: {
    backgroundColor: "#1ED860",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  photoButtonText: {
    color: "#111",
    fontWeight: "700",
  },
  photosContainer: {
    marginBottom: 20,
  },
  photoCount: {
    color: "#DFDFDF",
    marginBottom: 10,
    fontSize: 14,
  },
  photosList: {
    paddingBottom: 10,
  },
  photoWrapper: {
    position: "relative",
    marginRight: 10,
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF3B30",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  removePhotoButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  createButton: {
    backgroundColor: "#1ED860",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
    width: 217,
    height: 50,
    justifyContent: "center",
    alignSelf: "center",
  },
  disabledButton: {
    backgroundColor: "#1ED86080",
  },
  createButtonText: {
    color: "#111",
    fontWeight: "700",
    fontSize: 17,
  },
});
