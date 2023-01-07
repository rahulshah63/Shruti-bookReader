import * as WebBrowser from "expo-web-browser"
import { StyleSheet, Image, ScrollView } from "react-native"
import { Divider } from "react-native-paper"
import window from "../constants/Layout"
import { MonoText } from "./StyledText"
import { Text, View } from "./Themed"

export default function TextReader({ pdf }) {
  return (
    <ScrollView>
      <View style={Styles.textView}>
        <View style={Styles.metatags}>
          <View style={Styles.info}>
            <MonoText style={Styles.title}>{pdf.name}</MonoText>
            <MonoText style={Styles.tag}>{pdf.tag}</MonoText>
            <MonoText style={Styles.description}>{pdf.description}</MonoText>
          </View>
          <View>
            <Image source={{ uri: pdf.cover }} style={Styles.image} />
          </View>
        </View>
        <Divider style={Styles.divider} />
        {Object.keys(pdf.content).map((key) => (
          <Text style={Styles.content} key={key}>{`${pdf.content[key]}`}</Text>
        ))}
      </View>
    </ScrollView>
  )
}

const Styles = StyleSheet.create({
  text: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 20,
    color: "pink",
  },
  textView: {
    padding: 10,
    // marginBottom: 100,
  },
  image: {
    width: window.window.width * 0.3,
    height: window.window.height * 0.3,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
  },
  metatags: {
    display: "flex",
    flexDirection: "row",
    maxWidth: window.window.width * 0.6,
    alignItems: "center",
    paddingVertical: 10,
  },
  tag: {
    fontSize: 20,
  },
  description: {
    fontSize: 18,
    marginVertical: 10,
  },
  info: {
    paddingHorizontal: 10,
    alignItems: "center",
  },
  content: {
    textAlign: "left",
    fontSize: 18,
    paddingVertical: 10,
  },
  divider: {
    marginVertical: 20,
    height: 1.5,
    backgroundColor: "lightgrey",
  },
})
