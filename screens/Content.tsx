import { StyleSheet, SafeAreaView, Image } from "react-native"
import { AnimatedFAB, Divider, FAB, Text } from "react-native-paper"
import window from "../constants/Layout"
import axios from "axios"
import { Snackbar } from "react-native-paper"
import { useEffect, useRef, useState } from "react"
import { Audio } from "expo-av"
import Slider from "@react-native-community/slider"
import TextViewer from "../components/TextViewer"
import PdfViewer from "../components/PdfViewer"

export default function Content({ route }) {
  const [SnackVisible, setSnackVisible] = useState(false)
  const [msg, setMsg] = useState("")
  const [isRequesting, setIsRequesting] = useState(false)
  const [isExtended, setIsExtended] = useState(true)
  const [posMillis, setPositionMillis] = useState(0)
  const [duraMillis, setDuraMillis] = useState(0)
  const [sliderVisible, setSliderVisible] = useState(false)
  const audio = useRef(null)
  const [audioIcon, setAudioIcon] = useState("book-music-outline")

  const pdf = route.params.content

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
      if (res.status === 200) {
        setMsg("AudioBook generated successfully")
        playAudio()
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

  async function loadAudio() {
    try {
      setIsRequesting(true)
      const filename =
        pdf.mimeType === "application/pdf" ? pdf.name.split(".")[0] : pdf.name

      const { sound } = await Audio.Sound.createAsync({
        // uri: `${global.API}/sendfile/?filename=${filename}`,
        uri: `https://labs.phaser.io/assets/audio/jungle.mp3`,
      })
      audio.current = sound
      audio.current.setOnPlaybackStatusUpdate(
        async (status: {
          didJustFinish: boolean
          positionMillis: number
          durationMillis: number
        }) => {
          if (status.didJustFinish) {
            setAudioIcon("play")
            await audio.current.pauseAsync()
            await audio.current.setPositionAsync(0)
          }
          setDuraMillis(status.durationMillis)
          setPositionMillis(status.positionMillis)
        }
      )
      setIsRequesting(false)
      setAudioIcon("play")
    } catch (error) {
      setMsg("Error loading audio file. Please try again later")
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
        await loadAudio()
        await audio.current.playAsync()
        setMsg("Playing AudioBook")
        setAudioIcon("pause")
      } catch (error) {
        setMsg(error.message)
      } finally {
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
  }, [audio])

  //set timeout function to hide the FAB
  useEffect(() => {
    setTimeout(() => {
      setIsExtended(false)
    }, 3000)

    //Load the audio file only for textReader
    if (pdf.mimeType !== "application/pdf") {
      ;(async () => {
        await loadAudio()
      })()
    }
  }, [])

  return (
    <SafeAreaView style={Styles.container}>
      {pdf.mimeType === "application/pdf" ? (
        <PdfViewer pdf={pdf} />
      ) : (
        <TextViewer pdf={pdf} posMillis={posMillis} durationTime={duraMillis} />
      )}

      {sliderVisible && (
        <Slider
          style={Styles.slider}
          minimumValue={audio.current ? 0 : 0}
          maximumValue={audio.current ? duraMillis : 0}
          value={posMillis}
          onValueChange={async (value) => {
            if (!audio.current) return
            await audio.current?.setPositionAsync(value)
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
    </SafeAreaView>
  )
}

const Styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },

  slider: {
    position: "absolute",
    bottom: 5,
    width: window.window.width,
    height: 20,
  },
})
