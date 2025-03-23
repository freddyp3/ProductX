import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from "react-native";
import { useGroups } from "../context/GroupContext";

export default function UnlockedGroupsScreen({ navigation }) {
  const { groups } = useGroups();

  // Filter groups to only show those that have reached their unlock date
  const unlockedGroups = groups.filter((group) => {
    const unlockDate = new Date(group.unlockDate);
    const currentDate = new Date();
    return unlockDate <= currentDate;
  });

  const handleGroupPress = (group) => {
    navigation.navigate("Group", {
      groupName: group.name,
      unlockDate: group.unlockDate,
      isUnlocked: true,
      groupId: group.id, // Ensure groupId is passed
    });
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
            <Text style={styles.title}>Momentos.</Text>
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

      {/* Groups List */}
      <FlatList
        data={unlockedGroups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.groupItem}
            onPress={() => handleGroupPress(item)}
          >
            <View>
              <Text style={styles.groupName}>{item.name}</Text>
              <Text style={styles.groupDetails}>
                Unlocked on: {new Date(item.unlockDate).toLocaleDateString()}
              </Text>
              <Text style={styles.groupDetails}>Photos: {item.photoCount}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Unlocked Momentos</Text>
            <Text style={styles.emptySubText}>
              Your Momentos will appear here once they've reached their unlock
              date
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
    marginTop: 10,
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
  emptyContainer: {
    flex: 1,
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
    textAlign: "center",
  },
});
