import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Momento.</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.createButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("CreateGroup")}
        >
          <Text style={styles.createButtonText}>Create New Momento</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("CurrentGroups")}
        >
          <Image
            source={require("../assets/lock-icon.png")}
            style={styles.lockIcon}
            defaultSource={require("../assets/bg.jpg")}
          />
          <Text style={styles.secondaryButtonText}>Current Momentos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("UnlockedGroups")}
        >
          <Text style={styles.secondaryButtonText}>Unlocked Momentos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    fontFamily: "System",
  },
  titleContainer: {
    marginTop: 75,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#DFDFDF",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 21,
    marginTop: 215,
  },
  createButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 217,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1ED860",
  },
  createButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
  },
  secondaryButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 217,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#212121",
  },
  lockIcon: {
    width: 32,
    height: 32,
    marginRight: 9,
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#DFDFDF",
  },
});
