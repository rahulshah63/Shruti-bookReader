import React from "react"
import { StyleSheet, StyleProp, ViewStyle, ScrollView } from "react-native"
import { MonoText } from "../components/StyledText"
import { Text, View } from "../components/Themed"
import {
  Provider,
  Button,
  FAB,
  Modal,
  Portal,
  TextInput,
  Divider,
} from "react-native-paper"
import AudioCard from "../components/Audio"
import Colors from "../constants/Colors"

export default function Audiobook() {
  const [ModalVisible, setModalVisible] = React.useState(false)
  const showModal = () => setModalVisible(true)
  const hideModal = () => setModalVisible(false)
  const containerStyle: StyleProp<ViewStyle> = {
    backgroundColor: "#e5e5e5",
    height: "40%",
    width: "70%",
    borderRadius: 20,
    alignSelf: "center",
    padding: 20,
  }
  return (
    // <Provider>
    <View>
      <ScrollView>
        <View style={Styles.container}>
          <MonoText>Audiobook Views</MonoText>
          <Text>Get all your generated audiobooks</Text>
          <Divider style={Styles.divider} />
          <AudioCard />
          <AudioCard />
          <AudioCard />
          <AudioCard />
          {/* <Portal>
            <Modal
              visible={ModalVisible}
              onDismiss={hideModal}
              contentContainerStyle={containerStyle}
            >
              <MonoText style={{ textAlign: "center" }}>
                Add link to Modal
              </MonoText>
              <TextInput
                mode="outlined"
                label="PDF Link"
                right={<TextInput.Affix text="🔗" />}
                style={{ width: "100%", alignSelf: "center" }}
              />
              <Button
                mode="contained"
                color="#ffb6c1"
                onPress={() => console.log("Pressed")}
                labelStyle={{ color: "#000000" }}
                style={{ width: "50%", alignSelf: "center", marginTop: 5 }}
              >
                <MonoText>Fetch Pdf</MonoText>
              </Button>
            </Modal>
          </Portal> */}
        </View>
      </ScrollView>
      <FAB style={Styles.fab} icon="refresh" onPress={showModal} />
    </View>
    // </Provider>
  )
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    right: 30,
    bottom: 30,
    backgroundColor: "#296d98",
    transform: [{ rotate: "45deg" }],
  },
  divider: {
    width: "100%",
    height: 1,
  },
})
