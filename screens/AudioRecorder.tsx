import React, { useState, useEffect } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Audio } from "expo-av"
import AudioSlider from "../components/AudioSlider"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { MonoText } from "../components/StyledText"
import axios from "axios"
import { SafeAreaView } from "react-native-safe-area-context"
import { Divider, Snackbar } from "react-native-paper"

export default function AudioRecording() {
  const [recording, setRecording] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [Lang, setLang] = useState<"np" | "en">("np")
  const [SnackVisible, setSnackVisible] = useState(false)
  const [msg, setMsg] = useState("")
  const [isRequesting, setIsRequesting] = useState(false)
  const [audioURL, setAudioURL] = useState(null)

  const onToggleSnackBar = () => setSnackVisible(!SnackVisible)
  const onDismissSnackBar = () => setSnackVisible(false)

  const toggleLang = () => {
    if (Lang === "Nepali") {
      setLang("English")
    } else {
      setLang("Nepali")
    }
  }

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
    const url = recording.getURI()
    console.log("uri", url)
    try {
      setIsRequesting(true)
      const formData = new FormData()
      formData.append("file", {
        uri: url,
        type: "audio/m4a",
        name: "audio.m4a",
      })
      formData.append("voice", "true")
      const res = await axios.post(
        `${global.API}/translate/${Lang}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      if (res.status === 200) {
        setMsg("Transcription success")
        setAudioURL(`${global.API}/translated_file/`)
        // playAudio()
      } else {
        setMsg("Something went wrong")
      }
    } catch (error) {
      setMsg(error.message)
    } finally {
      setIsRequesting(false)
      onToggleSnackBar()
    }
  }

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync()
      }
    }
  }, [recording])
  return (
    <>
      <View style={styles.container}>
        <View style={styles.LangOption}>
          <TouchableOpacity
            style={Lang === "np" ? styles.selectLangColor : styles.selectLang}
            onPress={toggleLang}
          >
            <MonoText style={styles.buttonText}>Nepali</MonoText>
          </TouchableOpacity>
          <TouchableOpacity
            style={Lang === "en" ? styles.selectLangColor : styles.selectLang}
            onPress={toggleLang}
          >
            <MonoText style={styles.buttonText}>English</MonoText>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Translation</Text>
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
        {audioURL && (
          <>
            <Divider />
            <Text style={styles.title}>Transcribed Audio</Text>
            <AudioSlider
              url={audioURL}
              setMsg={setMsg}
              onToggleSnackBar={onToggleSnackBar}
            />
          </>
        )}
      </View>
      {msg.length > 0 && (
        <Snackbar
          visible={SnackVisible}
          onDismiss={onDismissSnackBar}
          action={{
            label: "Close",
            onPress: () => {
              onDismissSnackBar()
            },
          }}
        >
          {msg}
        </Snackbar>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "center",
    paddingTop: 50,
  },
  translate: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  LangOption: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 122, 255, 0.5)",
    margin: 10,
    borderRadius: 10,
  },
  selectLang: {
    padding: 5,
    paddingHorizontal: 10,
  },
  selectLangColor: {
    backgroundColor: "rgba(0, 122, 255, 1)",
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "rgba(0, 122, 255, 1)",
    padding: 10,
    margin: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
})
