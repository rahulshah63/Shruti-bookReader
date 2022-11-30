import { StatusBar } from "expo-status-bar"
import { Platform, StyleSheet, Image } from "react-native"

import AboutApp from "../components/AboutApp"
import { Text, View } from "../components/Themed"

export default function About() {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/shrutiIcon.png")} />
      <Text style={styles.title}>Shruti App</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <AboutApp />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
})
