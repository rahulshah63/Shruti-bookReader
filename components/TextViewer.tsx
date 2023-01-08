import * as WebBrowser from "expo-web-browser"
import { useEffect, useRef, useState } from "react"
import { StyleSheet, Image, ScrollView, Animated } from "react-native"
import { Divider } from "react-native-paper"
import Colors from "../constants/Colors"
import window from "../constants/Layout"
import { MonoText } from "./StyledText"
import { Text, View } from "./Themed"

export default function TextViewer({
  pdf,
  posMillis,
}: {
  pdf: any
  posMillis: number
  durationTime: number
}) {
  const [highlightedSentenceKey, sethighlightedSentenceKey] = useState(-1)
  const ScroolAnimation = useRef(new Animated.Value(0))

  useEffect(() => {
    //Scrool Animation
    Animated.sequence([
      Animated.delay(800),
      Animated.timing(ScroolAnimation.current, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(400),
      Animated.timing(ScroolAnimation.current, {
        toValue: 2,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()

    ScroolAnimation.current.addListener(({ value }) => {
      if (value === 2) {
        ScroolAnimation.current.stopAnimation()
      }
    })
  }, [])

  //Set the SentenceHighlightKey
  useEffect(() => {
    if (posMillis === 0) return
    const contentTS = Object.keys(pdf.content).map(Number)
    //find index which is just greater than posMillis
    const index = contentTS.findIndex((ts) => ts > posMillis)
    if (index === highlightedSentenceKey) return
    sethighlightedSentenceKey(index)
  }, [posMillis])

  //Set the TextHighlightKey

  // seekTime.addListener(({ value }) => {
  //interpolate the content from 0 to 1

  // const contentTS = Object.keys(pdf.content).map(Number)
  // const totalTime = contentTS.reduce((a, b) => a + b, 0)
  // const contentTSInterpolated = contentTS.map((ts) => {
  //   return ts / totalTime
  // })

  return (
    <ScrollView>
      <View style={Styles.textView}>
        <Animated.View
          style={{
            transform: [
              {
                translateY: ScroolAnimation.current.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [0, -35 - window.window.height * 0.3, 0], //-35 to compensate for the margin
                }),
              },
            ],
          }}
        >
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
          <View style={Styles.contentContainer}>
            {Object.keys(pdf.content).map((key, index) => (
              <Text
                key={index}
                style={[
                  Styles.content,
                  {
                    color:
                      index === highlightedSentenceKey
                        ? Colors.light.text
                        : Colors.light.text2,
                    backgroundColor:
                      index === highlightedSentenceKey
                        ? Colors.light.lightGreen
                        : "transparent",
                    fontSize:
                      index === highlightedSentenceKey
                        ? 19
                        : Styles.content.fontSize,
                    fontWeight:
                      index === highlightedSentenceKey
                        ? "500"
                        : Styles.content.fontWeight,
                  },
                ]}
              >
                {pdf.content[key]}
              </Text>
            ))}
          </View>
        </Animated.View>
      </View>
    </ScrollView>
  )
}

const Styles = StyleSheet.create({
  textView: {
    paddingVertical: 10,
    marginBottom: 80,
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
    height: window.window.height * 0.3,
    alignItems: "center",
    paddingVertical: 10,
  },
  tag: {
    fontSize: 19,
    backgroundColor: Colors.light.lightGreen,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  description: {
    textAlign: "center",
    fontSize: 17,
    marginVertical: 5,
    backgroundColor: Colors.light.lightYellow,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  info: {
    paddingHorizontal: 10,
    alignItems: "center",
  },
  contentContainer: {
    backgroundColor: Colors.light.lightYellow,
    padding: 10,
    borderRadius: 10,
  },
  content: {
    borderRadius: 10,
    paddingHorizontal: 10,
    textAlign: "left",
    fontSize: 16,
    fontWeight: "300",
    paddingVertical: 5,
  },
  divider: {
    marginVertical: 20,
    height: 1.5,
    backgroundColor: "lightgrey",
  },
})
