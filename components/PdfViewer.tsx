import { StyleSheet } from "react-native"
import PDFReader from "rn-pdf-reader-js-improved"
import window from "../constants/Layout"

export default function PdfViewer({ pdf }) {
  return (
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
  )
}

const Styles = StyleSheet.create({
  pdfReader: {
    width: window["width"],
    height: window["height"],
  },
})
