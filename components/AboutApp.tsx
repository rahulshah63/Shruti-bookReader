import * as WebBrowser from "expo-web-browser"
import { StyleSheet, TouchableOpacity } from "react-native"
import Colors from "../constants/Colors"
import { MonoText } from "./StyledText"
import { Text, View } from "./Themed"

export default function EditScreenInfo() {
  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)"
        >
          Shruti, an AI generated book reader, is an application which creates
          voice for the book.
        </Text>
        <View
          style={[styles.codeHighlightContainer, styles.homeScreenFilename]}
          darkColor="rgba(255,255,255,0.05)"
          lightColor="rgba(0,0,0,0.05)"
        >
          <MonoText>Uses Tacotron 2 Model</MonoText>
        </View>
      </View>

      <View style={styles.helpContainer}>
        <TouchableOpacity onPress={handleHelpPress}>
          <Text style={styles.helpLink}>
            <MonoText>Learn More: </MonoText>
            <MonoText lightColor={Colors.light.tint}>Text-To-Speech</MonoText>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    "https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet"
  )
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 30,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
  },
  helpContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: "center",
  },
})
