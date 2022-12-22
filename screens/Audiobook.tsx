import React from "react"
import { StyleSheet, StyleProp, ViewStyle } from "react-native"
import { MonoText } from "../components/StyledText"
import { Text, View } from "../components/Themed"
import {
  Provider,
  Button,
  FAB,
  Modal,
  Portal,
  TextInput,
} from "react-native-paper"

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
    <Provider>
      <View style={Styles.container}>
        <MonoText>Audiobook Views</MonoText>
        <Text>Get all your generated audiobooks</Text>

        <Portal>
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
              // multiline={true}
              // numberOfLines={2}
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
        </Portal>
        <FAB style={Styles.fab} icon="paperclip" onPress={showModal} />
      </View>
    </Provider>
  )
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    right: 30,
    bottom: 30,
    backgroundColor: "#ffb6c1",
    transform: [{ rotate: "45deg" }],
  },
})
