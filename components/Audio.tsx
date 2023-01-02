import { StyleSheet, TouchableOpacity } from "react-native"
import Colors from "../constants/Colors"
import { MonoText } from "./StyledText"
import { Text, View } from "./Themed"
import window from "../constants/Layout"
import { Audio } from "expo-av"
import Slider from "@react-native-community/slider"
import React, { useState, useRef, useEffect } from "react"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Card, Title, Paragraph, ActivityIndicator } from "react-native-paper"

export default function AudioCard() {
  const [duraMillis, setDuraMillis] = useState(0)
  const [seekTime, setSeekTime] = useState(0)
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
          (status: {
            didJustFinish: boolean
            positionMillis: number
            durationMillis: number
          }) => {
            if (status.didJustFinish) {
              setAudioIcon("play")
            }
            setDuraMillis(status.durationMillis)
            setSeekTime(status.positionMillis / status.durationMillis)
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
        <View style={Styles.audioContainer}>
          <MonoText
            style={{
              marginLeft: 10,
            }}
          >
            {Math.floor((seekTime * duraMillis) / 1000 / 3600)}:
            {Math.floor((seekTime * duraMillis) / 1000 / 60)}:
            {Math.floor((seekTime * duraMillis) / 1000) % 60}/
            {Math.floor(duraMillis / 1000 / 3600)}:
            {Math.floor(duraMillis / 1000 / 60)}:
            {Math.floor(duraMillis / 1000) % 60}
          </MonoText>
          <Slider
            minimumValue={audio.current ? 0 : 0}
            maximumValue={audio.current ? 1 : 0}
            value={seekTime}
            onValueChange={async (value) => {
              if (!audio.current) return
              const status = await audio.current?.getStatusAsync()
              await audio.current?.setPositionAsync(
                value * status.durationMillis
              )
            }}
            onSlidingStart={async () => {
              if (!audio.current) return
              await audio.current.pauseAsync()
              setAudioIcon("play")
            }}
            onSlidingComplete={async () => {
              if (!audio.current) return
              await audio.current.playAsync()
              setAudioIcon("pause")
            }}
            minimumTrackTintColor="red"
            maximumTrackTintColor="#000000"
          />
        </View>
        <TouchableOpacity onPress={() => playAudio()} style={Styles.playButton}>
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
  playButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.light.tinttab,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  audioContainer: {
    flex: 1,
    flexDirection: "column",
    margin: 10,
  },
})
