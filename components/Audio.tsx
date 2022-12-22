import { StyleSheet, TouchableOpacity } from "react-native"
import Colors from "../constants/Colors"
import { MonoText } from "./StyledText"
import { Text, View } from "./Themed"
import window from "../constants/Layout"
import { Audio } from "expo-av"
import Slider from "@react-native-community/slider"
import { useState, useRef, useEffect } from "react"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import {
  Card,
  Title,
  Paragraph,
  Snackbar,
  ActivityIndicator,
} from "react-native-paper"

export default function AudioCard() {
  const [isRequesting, setIsRequesting] = useState(false)
  const audio = useRef(null)
  const [audioIcon, setAudioIcon] = useState("play")

  async function playAudio(
    audiouri = "http://labs.phaser.io/assets/audio/DOG.mp3"
  ) {
    if (audio.current !== null) {
      if (audioIcon === "pause") {
        setAudioIcon("play")
        await audio.current.pauseAsync()
      } else {
        await audio.current.playAsync()
        setAudioIcon("pause")
      }
    } else {
      try {
        setIsRequesting(true)
        const { sound } = await Audio.Sound.createAsync({
          uri: audiouri,
        })
        audio.current = sound
        audio.current.setOnPlaybackStatusUpdate(
          (status: { didJustFinish: any }) => {
            if (status.didJustFinish) {
              setAudioIcon("play")
            }
          }
        )
        await sound.playAsync()
        setAudioIcon("pause")
        setIsRequesting(false)
      } catch (error) {
        console.log(error)
      }
    }
  }

  function getCurrentSliderPosition() {
    audio.current?.setOnPlaybackStatusUpdate(
      (status: { positionMillis: number; durationMillis: number }) => {
        const current = status.positionMillis / status.durationMillis
        console.log({ current })
        return current
      }
    )
    return 0
  }

  useEffect(() => {
    return audio.current
      ? () => {
          audio.current.unloadAsync()
          audio.current = null
        }
      : undefined
  }, [audio.current])

  return (
    <Card style={Styles.cardContatiner}>
      <Card.Content>
        <Title>Shruti</Title>
        <Paragraph>
          Shruti, a nepali text to speech app based on Tacotron 2 model. This
          app is developed by the team of <MonoText>Quadruples</MonoText>
        </Paragraph>
      </Card.Content>

      <View style={Styles.card}>
        <Card.Cover
          style={Styles.image}
          source={{ uri: "https://picsum.photos/700" }}
        />
        <Slider
          style={Styles.slider}
          minimumValue={audio.current ? 0 : 0}
          maximumValue={audio.current ? 1 : 0}
          value={getCurrentSliderPosition()}
          onValueChange={(value) => {
            audio.current?.setOnPlaybackStatusUpdate(
              async (status: { durationMillis: number }) => {
                const current = value * status.durationMillis
                await audio.current.setPositionAsync(current)
              }
            )
          }}
          onSlidingStart={async () => {
            await audio.current.pauseAsync()
            setAudioIcon("play")
          }}
          onSlidingComplete={async () => {
            await audio.current.playAsync()
            setAudioIcon("pause")
          }}
          minimumTrackTintColor="orange"
          maximumTrackTintColor="#000000"
        />
        <TouchableOpacity
          onPress={() => {
            playAudio()
          }}
          style={Styles.playButton}
        >
          {isRequesting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <MaterialCommunityIcons name={audioIcon} size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </Card>
  )
}

const Styles = StyleSheet.create({
  cardContatiner: {
    width: window.window.width - 20,
    height: 150,
    borderRadius: 10,
    margin: 15,
  },
  card: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    width: "95%",
    backgroundColor: "white",
    borderRadius: 10,
    margin: 5,
  },
  slider: {
    width: "70%",
  },
  playButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.light.tint,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
})
