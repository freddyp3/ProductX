import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useGroups } from "../context/GroupContext";
import { useFocusEffect } from "@react-navigation/native";

export default function UnlockedGroupsScreen({ navigation }) {
  const { groups } = useGroups();
  const [unlockedGroups, setUnlockedGroups] = useState([]);

  // Filter groups that are unlocked (unlock date is today or in the past)
  useFocusEffect(
    useCallback(() => {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Set to beginning of day for comparison

      const filtered = groups
        ? groups.filter((group) => {
            if (!group) return false;

            // Include groups that are marked as unlocked
            if (group.isUnlocked) return true;

            const unlockDate = new Date(group.unlockDate);
            unlockDate.setHours(0, 0, 0, 0);

            // Include groups where unlock date is today or earlier
            return unlockDate.getTime() <= now.getTime();
          })
        : [];

      setUnlockedGroups(filtered);
    }, [groups]),
  );

  const handleGroupPress = (group) => {
    navigation.navigate("Group", {
      groupName: group.name,
      unlockDate: group.unlockDate,
      isUnlocked: true,
    });
  };

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => handleGroupPress(item)}
    >
      <View style={styles.groupContent}>
        <Text style={styles.groupName}>{item.name}</Text>
        <Text style={styles.groupDate}>
          Unlocked on: {new Date(item.unlockDate).toLocaleDateString()}
        </Text>
        <Text style={styles.groupPhotos}>Photos: {item.photoCount || 0}</Text>
      </View>
    </TouchableOpacity>
  );

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

      {unlockedGroups.length > 0 ? (
        <FlatList
          data={unlockedGroups}
          keyExtractor={(item) => item.id}
          renderItem={renderGroupItem}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No unlocked momentos yet</Text>
          <Text style={styles.emptySubtext}>
            Your momentos will appear here once they're unlocked
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
    top: 70, // Moved down to match CurrentGroupsScreen
    zIndex: 10,
    padding: 10, // Add padding to increase touch target
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  titleContainer: {
    marginTop: 40, // Increased to match CurrentGroupsScreen
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
    marginBottom: 30,
  },
  highlightedGroup: {
    width: 217,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#1ED860",
    marginTop: 20,
  },
  highlightedGroupText: {
    color: "#111",
    fontFamily: "System",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
});
