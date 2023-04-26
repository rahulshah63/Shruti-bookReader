import Slider from "@react-native-community/slider"
import React, { useState, useRef, useEffect } from "react"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Audio } from "expo-av"
import { View } from "./Themed"
import Colors from "../constants/Colors"
import { MonoText } from "./StyledText"
import { TouchableOpacity, StyleSheet } from "react-native"
import { ActivityIndicator } from "react-native-paper"
import window from "../constants/Layout"

export default function AudioSlider({ url, setMsg, onToggleSnackBar }) {
  const [duraMillis, setDuraMillis] = useState(0)
  const [seekTime, setSeekTime] = useState(0)
  const [isRequesting, setIsRequesting] = useState(false)
  const audio = useRef(null)
  const [audioIcon, setAudioIcon] = useState("play")

  async function playAudio() {
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
          uri: url,
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
        setMsg("Playing AudioBook")
        setAudioIcon("pause")
        setIsRequesting(false)
      } catch (error) {
        setMsg(error.message)
      } finally {
        setIsRequesting(false)
        onToggleSnackBar()
      }
    }
  }
  useEffect(() => {
    return () => {
      if (audio.current) {
        audio.current.pauseAsync()
        audio.current.stopAsync()
        audio.current.setOnPlaybackStatusUpdate(null)
        audio.current.unloadAsync()
        audio.current = null
      }
    }
  }, [audio.current])

  return (
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
      <View style={Styles.AudioSlider}>
        <Slider
          style={Styles.slider}
          minimumValue={audio.current ? 0 : 0}
          maximumValue={audio.current ? 1 : 0}
          value={seekTime}
          onValueChange={async (value) => {
            if (!audio.current) return
            const status = await audio.current?.getStatusAsync()
            await audio.current?.setPositionAsync(value * status.durationMillis)
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
        <TouchableOpacity onPress={() => playAudio()} style={Styles.playButton}>
          {isRequesting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <MaterialCommunityIcons name={audioIcon} size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const Styles = StyleSheet.create({
  audioContainer: {
    flex: 1,
    flexDirection: "column",
    margin: 10,
  },
  AudioSlider: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  playButton: {
    width: 45,
    height: 45,
    backgroundColor: Colors.light.tinttab,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  slider: {
    width: window.window.width - 80,
    height: 20,
  },
})
