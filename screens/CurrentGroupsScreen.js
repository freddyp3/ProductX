import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Button,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useGroups } from "../context/GroupContext";
import { useFocusEffect } from "@react-navigation/native";

export default function CurrentGroupsScreen({ navigation }) {
  const { groups, updateGroup } = useGroups();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [currentGroups, setCurrentGroups] = useState([]);

  // Filter groups that are still locked (unlock date is in the future)
  useFocusEffect(
    useCallback(() => {
      const now = new Date();

      // Check for groups that should be unlocked first
      if (groups && updateGroup) {
        groups.forEach((group) => {
          const unlockDate = new Date(group.unlockDate);
          // Set to beginning of day for comparison
          unlockDate.setHours(0, 0, 0, 0);
          const nowDate = new Date(now);
          nowDate.setHours(0, 0, 0, 0);

          if (unlockDate <= nowDate && !group.isUnlocked) {
            // Update the group to be unlocked
            try {
              updateGroup({
                ...group,
                isUnlocked: true,
              });
            } catch (error) {
              console.error("Error updating group:", error);
            }
          }
        });
      }

      // Then filter current groups - only show groups that are still locked
      const filtered = groups
        ? groups.filter((group) => {
            if (!group) return false;

            // Only show groups that are not unlocked yet
            if (group.isUnlocked) return false;

            const unlockDate = new Date(group.unlockDate);
            // Set to beginning of day for comparison
            unlockDate.setHours(0, 0, 0, 0);
            const nowDate = new Date(now);
            nowDate.setHours(0, 0, 0, 0);

            // Only show groups where unlock date is in the future (strictly greater than today)
            return unlockDate > nowDate;
          })
        : [];

      setCurrentGroups(filtered);
    }, [groups, updateGroup]),
  );

  const handleGroupPress = (group) => {
    // Since we're only showing locked groups in this screen now,
    // we can simplify this function
    navigation.navigate("Group", {
      groupName: group.name,
      unlockDate: group.unlockDate,
      isUnlocked: false, // Always false since we're only showing locked groups
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

  const renderGroupItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.groupItem}
        onPress={() => handleGroupPress(item)}
        onLongPress={() => handleLongPress(item)}
      >
        <View style={styles.groupContent}>
          <Text style={styles.groupName}>{item.name}</Text>
          <Text style={styles.groupDate}>
            Unlocks: {new Date(item.unlockDate).toLocaleDateString()}
          </Text>
          <Text style={styles.groupPhotos}>Photos: {item.photoCount}</Text>
          <Text style={styles.groupHint}>
            Tap to add photos • Long press to unlock with password
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
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

        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Momentos.</Text>
            <Image
              source={require("../assets/lock-icon.png")}
              style={styles.lockIcon}
            />
          </View>
        </View>

        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Enjoy reminiscing</Text>
        </View>
      </View>

      {showPasswordInput && (
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter password to unlock"
            placeholderTextColor="#777"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.unlockButton} onPress={handleUnlock}>
            <Text style={styles.unlockButtonText}>Unlock</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentGroups.length > 0 ? (
        <FlatList
          data={currentGroups}
          keyExtractor={(item) => item.id}
          renderItem={renderGroupItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No locked momentos yet</Text>
          <Text style={styles.emptySubtext}>
            Create a new momento to get started
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    width: "100%",
    position: "relative",
  },
  header: {
    padding: 20,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 30,
    top: 70, // Move down further
    zIndex: 10,
    padding: 10, // Add padding to increase touch target
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  titleContainer: {
    marginTop: 40, // Increase top margin to move everything down
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#DFDFDF",
    fontFamily: "System",
    fontSize: 30,
    fontWeight: "700",
  },
  lockIcon: {
    width: 29,
    height: 29,
    marginLeft: 10,
    marginTop: 0, // Reset to align with text
  },
  subtitleContainer: {
    marginTop: 5,
  },
  subtitle: {
    color: "#DFDFDF",
    fontFamily: "System",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  passwordContainer: {
    backgroundColor: "#212121",
    padding: 15,
    margin: 20,
    borderRadius: 10,
  },
  passwordInput: {
    backgroundColor: "#333",
    color: "#DFDFDF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  unlockButton: {
    backgroundColor: "#1ED860",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  unlockButtonText: {
    color: "#111",
    fontWeight: "700",
  },
  listContent: {
    padding: 15,
  },
  groupItem: {
    backgroundColor: "#1ED860",
    borderRadius: 25,
    marginBottom: 15,
    overflow: "hidden",
    width: 217,
    alignSelf: "center",
  },
  groupContent: {
    padding: 15,
  },
  groupName: {
    color: "#111",
    fontFamily: "System",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 5,
  },
  groupDate: {
    color: "#111",
    fontFamily: "System",
    fontSize: 12,
    marginBottom: 5,
    textAlign: "center",
  },
  groupPhotos: {
    color: "#111",
    fontFamily: "System",
    fontSize: 12,
    marginBottom: 5,
    textAlign: "center",
  },
  groupHint: {
    color: "#111",
    fontFamily: "System",
    fontSize: 10,
    fontStyle: "italic",
    marginTop: 5,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#DFDFDF",
    fontFamily: "System",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  emptySubtext: {
    color: "#777",
    fontFamily: "System",
    fontSize: 14,
    textAlign: "center",
  },
});
