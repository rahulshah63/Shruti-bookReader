import React, { useState, useEffect } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Audio } from "expo-av"
import AudioSlider from "./AudioSlider"
import { MaterialCommunityIcons } from "@expo/vector-icons"

export default function AudioRecording() {
  const [recording, setRecording] = useState(null)
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync()
      }
    }
  }, [recording])

  const startRecording = async () => {
    setRecording(null)
    try {
      const { status } = await Audio.requestPermissionsAsync()
      if (status !== "granted") {
        console.error("Permission to access microphone denied")
        return
      }

      const newRecording = new Audio.Recording()
      await newRecording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      )
      await newRecording.startAsync()
      setRecording(newRecording)
      setIsRecording(true)
    } catch (error) {
      console.error("Failed to start recording", error)
    }
  }

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync()
      setIsRecording(false)
    } catch (error) {
      console.error("Failed to stop recording", error)
    }
  }

  const ontranslateApiCall = async () => {
    console.log("ontranslateApiCall")
    const uri = recording.getURI()
    console.log("uri", uri)
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Record Audio</Text>
      {isRecording ? (
        <TouchableOpacity style={styles.button} onPress={stopRecording}>
          <Text style={styles.buttonText}>Stop Recording</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.translate}>
          <TouchableOpacity style={styles.button} onPress={startRecording}>
            <Text style={styles.buttonText}>
              {recording ? "Re Record" : "Start Recording"}
            </Text>
          </TouchableOpacity>
          {recording && (
            <TouchableOpacity
              style={styles.button}
              onPress={ontranslateApiCall}
            >
              <Text style={styles.buttonText}>Translate</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {recording && !isRecording && (
        <AudioSlider
          url={recording.getURI()}
          setMsg={() => null}
          onToggleSnackBar={() => null}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  translate: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007aff",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
})
