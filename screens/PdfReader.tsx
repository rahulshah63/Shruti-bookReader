import { StyleSheet, SafeAreaView } from "react-native"
import PDFReader from "rn-pdf-reader-js"
import { ActivityIndicator, AnimatedFAB, Button, FAB } from "react-native-paper"
import window from "../constants/Layout"
import axios from "axios"
import { Snackbar } from "react-native-paper"
import { useEffect, useRef, useState } from "react"
import { Audio } from "expo-av"
import Slider from "@react-native-community/slider"
import Colors from "../constants/Colors"

export default function PdfReader({ route }) {
  const [SnackVisible, setSnackVisible] = useState(false)
  const [msg, setMsg] = useState("")
  const [isExtended, setIsExtended] = useState(true)
  const [seekTime, setSeekTime] = useState(0)
  const [isRequesting, setIsRequesting] = useState(false)
  const [sliderVisible, setSliderVisible] = useState(false)
  const audio = useRef(null)
  const [audioIcon, setAudioIcon] = useState(
    audio.current ? "play" : "book-music-outline"
  )
  const pdf = route.params.pdf
  const animateFrom = "right"
  const visible = true
  const fabStyle = { [animateFrom]: 30 }

  const onToggleSnackBar = () => setSnackVisible(!SnackVisible)
  const onDismissSnackBar = () => setSnackVisible(false)

  async function pdf2Text() {
    try {
      setIsRequesting(true)
      const formData = new FormData()
      formData.append("file", {
        uri: pdf.uri,
        type: pdf.mimeType,
        name: pdf.name,
      })
      formData.append("voice", "true")
      const res = await axios.post(global.API, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      console.log(res)
      if (res.status === 200) playAudio()
    } catch (error) {
      setMsg("Error: " + error.message)
      onToggleSnackBar()
      setIsRequesting(false)
    }
  }

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
        const { sound } = await Audio.Sound.createAsync({
          uri: `${global.API}/sendfile/?filename=${pdf.name.split(".")[0]}`,
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
            setSeekTime(status.positionMillis / status.durationMillis)
          }
        )
        await sound.playAsync()
        setAudioIcon("pause")
        setIsRequesting(false)
      } catch (error) {
        setMsg("Error: " + error.message)
        setIsRequesting(false)
        onToggleSnackBar()
      }
    }
  }
  useEffect(() => {
    return audio.current
      ? () => {
          audio.current.pauseAsync()
          audio.current.unloadAsync()
          audio.current = null
        }
      : undefined
  }, [audio.current])

  //set timeout function to hide the FAB
  useEffect(() => {
    setTimeout(() => {
      setIsExtended(false)
    }, 3000)
  }, [])

  return (
    <SafeAreaView style={Styles.container}>
      <PDFReader
        style={Styles.pdfReader}
        source={{
          uri: `${pdf.uri}`,
        }}
        withPinchZoom={true}
        withScroll={true}
        customStyle={{
          readerContainer: {
            backgroundColor: "#e5e5e5",
          },
          readerContainerZoomContainerButton: {
            display: "none",
          },
        }}
      />
      {sliderVisible && (
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
          minimumTrackTintColor="orange"
          maximumTrackTintColor="#000000"
        />
      )}
      {isRequesting ? (
        <FAB icon={audioIcon} loading={true} style={Styles.fab} />
      ) : (
        <AnimatedFAB
          icon={audioIcon}
          label={audio.current ? "Play" : "AudioBook"}
          extended={isExtended}
          onPress={() => {
            audio.current ? playAudio() : pdf2Text()
          }}
          onLongPress={() => {
            setSliderVisible(!sliderVisible)
          }}
          visible={visible}
          animateFrom={"right"}
          iconMode={"static"}
          style={[fabStyle, Styles.fab]}
        />
      )}
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
    </SafeAreaView>
  )
}

const Styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  pdfReader: {
    width: window["width"],
    height: window["height"],
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  text: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 20,
    color: "pink",
  },
  slider: {
    position: "absolute",
    bottom: 5,
    width: window.window.width,
    height: 20,
  },
})
