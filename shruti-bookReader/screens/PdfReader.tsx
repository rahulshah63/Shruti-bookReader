import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import PDFReader from 'rn-pdf-reader-js'
import { FAB } from 'react-native-paper';
import window from '../constants/Layout';
import * as WebBrowser from 'expo-web-browser';

export default function PdfReader({route, navigation}) {
  const { pdf } = route.params;
  
  async function pdf2Text() {

    // WebBrowser.openBrowserAsync(
    //   'https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet'
    // );

    try {
      const apiURL = "https://62b5-103-166-18-111.in.ngrok.io/uploadpdf"
      const formdata = new FormData();
      formdata.append('file', {
        uri:pdf.uri,
        type:pdf.mimeType,
        name:pdf.name
      });
      console.log(formdata);
      
      let response = await fetch(apiURL, {
            method: 'post',
            body: formdata,
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          });
  
      let result = await response.json();
      console.log(result);
    } 
    catch (error) {
      console.error(error)
    }

  }

  return (
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
                    backgroundColor: '#e5e5e5',
                },
                readerContainerZoomContainerButton: {
                    display: 'none',
                }
            }}
          />
          <FAB style={Styles.fab} icon='book-music-outline' onPress={pdf2Text}/>
          {/* book-play-outline */}
    </>
  );
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfReader: {
    width: window['width'],
    height: window['height'],
  },
  fab: {
      position: 'absolute',
      right: 30,
      bottom: 40,
      backgroundColor: '#ffb6c1',
  },
});
