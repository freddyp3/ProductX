import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Button,
  Modal,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useGroups } from "../context/GroupContext";

export default function CurrentGroupsScreen({ navigation }) {
  const { groups } = useGroups();

  // Filter groups to only show those that have not reached their unlock date
  const currentGroups = groups.filter((group) => {
    const unlockDate = new Date(group.unlockDate);
    const currentDate = new Date();
    return unlockDate > currentDate;
  });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const handleGroupPress = (group) => {
    navigation.navigate("Group", {
      groupName: group.name,
      unlockDate: group.unlockDate,
      isUnlocked: false,
    });
  };

  const handleLongPress = (group) => {
    setSelectedGroup(group);
    setShowPasswordInput(true);
    setPassword("");
  };

  const handleUnlock = () => {
    if (password === "1234") {
      navigation.navigate("Group", {
        groupName: selectedGroup.name,
        unlockDate: selectedGroup.unlockDate,
        isUnlocked: true,
      });
    } else {
      alert("Incorrect password");
    }
    setShowPasswordInput(false);
    setPassword("");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Back Button - Positioned like CreateGroupScreen */}
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

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.backIconPlaceholder} />
          <View style={styles.titleContainer}>
            <View style={styles.titleWithIcon}>
              <Text style={styles.title}>Momentos.</Text>
              <Image
                source={require("../assets/lock-icon.png")}
                defaultSource={require("../assets/lock-icon.png")}
                style={styles.titleLockIcon}
              />
            </View>
          </View>
          <Image
            source={require("../assets/profile-icon.png")}
            defaultSource={require("../assets/profile-icon.png")}
            style={styles.profileIcon}
          />
        </View>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Enjoy reminiscing</Text>
        </View>
      </View>

      {/* Password Modal */}
      <Modal
        visible={showPasswordInput}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPasswordInput(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Password</Text>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter password to unlock"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={() => setShowPasswordInput(false)}
                color="#777"
              />
              <Button title="Unlock" onPress={handleUnlock} color="#1ED860" />
            </View>
          </View>
        </View>
      </Modal>

      {/* Groups List */}
      <FlatList
        data={currentGroups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.groupItem}
            onPress={() => handleGroupPress(item)}
            onLongPress={() => handleLongPress(item)}
          >
            <View>
              <Text style={styles.groupName}>{item.name}</Text>
              <Text style={styles.groupDetails}>
                Unlocks: {new Date(item.unlockDate).toLocaleDateString()}
              </Text>
              <Text style={styles.groupDetails}>Photos: {item.photoCount}</Text>
              <Text style={styles.hintText}>
                Long press to unlock with password
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No current Momentos</Text>
            <Text style={styles.emptySubText}>
              Create a new Momento to get started
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
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
  backIconPlaceholder: {
    width: 24,
    height: 24,
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 5,
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  titleLockIcon: {
    width: 24,
    height: 24,
    marginLeft: 8,
    tintColor: "#DFDFDF",
  },
  title: {
    color: "#DFDFDF",
    fontFamily: "System",
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 40,
  },
  profileIcon: {
    width: 29,
    height: 29,
  },
  subtitleContainer: {
    alignItems: "center",
    marginTop: 5,
  },
  subtitle: {
    color: "#DFDFDF",
    fontFamily: "System",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 40,
  },
  groupItem: {
    backgroundColor: "#1ED860",
    padding: 15,
    borderRadius: 25,
    marginBottom: 10,
    marginHorizontal: 20,
    alignItems: "center",
  },
  groupName: {
    color: "#111",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
    textAlign: "center",
  },
  groupDetails: {
    color: "#111",
    fontSize: 14,
    marginBottom: 3,
    fontWeight: "600",
    textAlign: "center",
  },
  hintText: {
    color: "#111",
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 5,
    textAlign: "center",
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#212121",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    color: "#DFDFDF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  passwordInput: {
    backgroundColor: "#333",
    color: "#DFDFDF",
    width: "100%",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    marginTop: 50,
  },
  emptyText: {
    color: "#DFDFDF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  emptySubText: {
    color: "#777",
    fontSize: 14,
  },
});
