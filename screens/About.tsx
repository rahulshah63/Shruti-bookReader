import { useState } from "react"
import { StatusBar } from "expo-status-bar"
import { Platform, StyleSheet, Image, TouchableOpacity } from "react-native"
import Colors from "../constants/Colors"
import AboutApp from "../components/AboutApp"
import { MonoText } from "../components/StyledText"
import { Text, View } from "../components/Themed"
import { WebView } from "react-native-webview"

export default function About() {
  const website = "https://github.com/rahulshah63" //"https://shrutiapp.com"
  const [visitSite, setVisitSite] = useState(false)

  return (
    <>
      {visitSite ? (
        <WebView style={styles.container} source={{ uri: website }} />
      ) : (
        <View style={styles.container}>
          <Image source={require("../assets/images/shrutiIcon.png")} />
          <Text style={styles.title}>Shruti App</Text>
          <MonoText>Version 1.0.0</MonoText>
          <MonoText>2021 Shruti App &copy;</MonoText>
          <TouchableOpacity onPress={() => setVisitSite(true)}>
            <MonoText lightColor={Colors.light.tint}>Visit website</MonoText>
          </TouchableOpacity>
          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />
          <AboutApp />

          {/* Use a light status bar on iOS to account for the black space above the modal */}
          <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </View>
      )}
    </>
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
