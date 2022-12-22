import { StyleSheet, SafeAreaView } from "react-native"
import PDFReader from "rn-pdf-reader-js"
import {
  AnimatedFAB,
  ActivityIndicator,
  Text,
  Button,
} from "react-native-paper"
import window from "../constants/Layout"
import axios from "axios"
import { useEffect, useState } from "react"
const url = "https://4483-103-163-182-17.in.ngrok.io/"

export default function PdfReader({ route, ...rest }) {
  const [isExtended, setIsExtended] = useState(true)
  const [isRequesting, setIsRequesting] = useState(false)
  const pdf = route.params.pdf

  const animateFrom = isExtended ? "right" : "right"
  const visible = true
  const fabStyle = { [animateFrom]: 30 }

  //set timeout function to hide the FAB
  useEffect(() => {
    setTimeout(() => {
      setIsExtended(false)
    }, 3000)
  }, [])

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
      const res = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <SafeAreaView style={Styles.container}>
      <ActivityIndicator
        animating={isRequesting}
        color={"orange"}
        size={"large"}
      />
      {isRequesting ? (
        <>
          <Text style={Styles.text}>Converting to AudioBook</Text>
          <Button onPress={() => setIsRequesting(false)} color={"orange"}>
            Cancel
          </Button>
        </>
      ) : (
        <>
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
          <AnimatedFAB
            icon={"book-music-outline"}
            label={"AudioBook"}
            extended={isExtended}
            onPress={() => pdf2Text()}
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
