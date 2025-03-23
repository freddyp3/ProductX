import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";

export default function WelcomeScreen({ navigation }) {
  const handlePress = () => {
    navigation.navigate("Home");
  };

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={handlePress}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Momento.</Text>
        </View>
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>
            Ready to change the way you reminisce?
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    width: "100%",
  },
  content: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  titleContainer: {
    marginTop: 75,
  },
  title: {
    color: "#DFDFDF",
    fontFamily: "System",
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 40,
  },
  taglineContainer: {
    marginTop: 251,
  },
  tagline: {
    color: "#DFDFDF",
    fontFamily: "System",
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 40,
    textAlign: "center",
    maxWidth: 289,
  },
});
