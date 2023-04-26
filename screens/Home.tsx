import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { View } from "../components/Themed"
import window from "../constants/Layout"
import { MonoText } from "../components/StyledText"
import React, { useState } from "react"
import { Card, Title, Paragraph, Snackbar, Divider } from "react-native-paper"
import * as DocumentPicker from "expo-document-picker"

const Home = ({ navigation }) => {
  const [_pdfs, setPdfs] = useState([])
  const [SnackVisible, setSnackVisible] = useState(false)
  const [errMsg, setErrMsg] = useState("")

  const onToggleSnackBar = () => setSnackVisible(!SnackVisible)
  const onDismissSnackBar = () => setSnackVisible(false)

  const addDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    })

    if (result.type === "success") {
      const { name, size } = result
      let doesExist = false
      _pdfs.map((pdf) => {
        if (pdf.name === name && pdf.size === size) {
          setErrMsg("File already exists")
          onToggleSnackBar()
          doesExist = true
        }
      })

      if (!doesExist) {
        setPdfs([..._pdfs, result])
      }
    } else {
      setErrMsg("Error while picking file")
      onToggleSnackBar()
    }
  }

  return (
    <ScrollView contentContainerStyle={{ minHeight: "100%" }}>
      <View style={Styles.container}>
        <TouchableOpacity>
          <Card
            style={Styles.addCardContainer}
            mode="outlined"
            onPress={addDocument}
            // onLongPress={}
          >
            <Card.Content style={{ paddingTop: 80 }}>
              <FontAwesome
                name="file-pdf-o"
                size={25}
                style={{ marginLeft: 30 }}
              />
              <Title>
                <MonoText style={{ fontSize: 18 }}>Import Pdf</MonoText>
              </Title>
            </Card.Content>
          </Card>
        </TouchableOpacity>

        {_pdfs.map((pdf, index) => {
          return (
            <TouchableOpacity key={index}>
              <Card
                style={Styles.cardContainer}
                onPress={() => {
                  // setPdfSource(pdf);
                  // setOpenPdf(true);
                  navigation.navigate("Content", { content: pdf })
                }}
                mode="outlined"
                // onLongPress={}  //TODO: Delete Pdf
              >
                {/* <Card.Cover style={Styles.coverImg} source={require(pdf.cover)} /> */}
                <Card.Content>
                  <Title>
                    <MonoText style={{ fontSize: 16 }}>{pdf.name}</MonoText>
                  </Title>
                  <Paragraph>
                    <MonoText style={{ fontSize: 14 }}>
                      Size: {pdf.size / 1024}kB
                    </MonoText>
                  </Paragraph>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )
        })}
      </View>
      <Snackbar
        visible={SnackVisible}
        onDismiss={onDismissSnackBar}
        duration={2000}
        action={{
          label: "Ok",
          icon: "check",
          onPress: () => {
            onDismissSnackBar()
          },
        }}
      >
        {errMsg}
      </Snackbar>
    </ScrollView>
  )
}
export default Home

const Styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    // flex: 1,
    alignContent: "space-between",
    textAlign: "center",
    margin: 10,
    width: (window.window.width - 60) / 2,
    height: 220,
    backgroundColor: "#ffb6c180",
  },
  addCardContainer: {
    // flex: 1,
    alignContent: "space-between",
    textAlign: "center",
    margin: 10,
    width: 130,
    height: 220,
    backgroundColor: "#F0F8FF",
  },
  coverImg: {
    width: "100%",
    height: "60%",
    resizeMode: "stretch",
  },
})
