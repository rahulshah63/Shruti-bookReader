import { StyleSheet, SafeAreaView } from "react-native"
import PDFReader from "rn-pdf-reader-js"
import { AnimatedFAB, FAB } from "react-native-paper"
import window from "../constants/Layout"
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { Audio } from "expo-av"

export default function PdfReader({ route, ...rest }) {
  const url = "https://4483-103-163-182-17.in.ngrok.io/"
  const [isExtended, setIsExtended] = useState(true)
  const [isRequesting, setIsRequesting] = useState(false)
  const audio = useRef(null)
  const [audioIcon, setAudioIcon] = useState(
    audio.current ? "play" : "book-music-outline"
  )
  const pdf = route.params.pdf

  const animateFrom = "right"
  const visible = true
  const fabStyle = { [animateFrom]: 30 }

  async function pdf2Text() {
    try {
      setIsRequesting(true)
      playAudio()
      const formData = new FormData()
      formData.append("file", {
        uri: pdf.uri,
        type: pdf.mimeType,
        name: pdf.name,
      })
      formData.append("voice", "true")
      const res = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      console.log(res)
      // after getting response from server in mp3 format
      // play the audio
      playAudio(res.data.audioLink)
    } catch (error) {
      console.log(error)
    }
  }

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
        const { sound } = await Audio.Sound.createAsync({
          uri: audiouri,
        })
        audio.current = sound
        await sound.playAsync()
        setAudioIcon("pause")
        setIsRequesting(false)
      } catch (error) {
        console.log(error)
      }
    }
  }

  //set timeout function to hide the FAB
  useEffect(() => {
    setTimeout(() => {
      setIsExtended(false)
    }, 3000)
  }, [])

  useEffect(() => {
    return audio.current
      ? () => {
          audio.current.unloadAsync()
          audio.current = null
        }
      : undefined
  }, [audio.current])

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
      {isRequesting ? (
        <FAB icon={audioIcon} loading={true} style={Styles.fab} />
      ) : (
        <>
          <AnimatedFAB
            icon={audioIcon}
            label={audio.current ? "Play" : "AudioBook"}
            extended={isExtended}
            onPress={() => {
              audio.current ? playAudio() : pdf2Text()
            }}
            visible={visible}
            animateFrom={"right"}
            iconMode={"static"}
            style={[Styles.fab, fabStyle]}
          />
        </>
      )}
    </SafeAreaView>
  )
}

const Styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignContent: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  pdfReader: {
    width: window["width"],
    height: window["height"],
  },
  fab: {
    position: "absolute",
    right: 30,
    bottom: 30,
  },
  text: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 20,
    color: "pink",
  },
})
