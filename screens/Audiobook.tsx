import React, { useEffect, useRef, useState } from "react"
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { MonoText } from "../components/StyledText"
import { Text, View } from "../components/Themed"
import { FAB, Divider, Snackbar, TouchableRipple } from "react-native-paper"
import AudioCard from "../components/AudioCard"
import axios from "axios"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { BOOKS } from "../constants/book"

export default function Audiobook({ navigation }) {
  const [SnackVisible, setSnackVisible] = useState(false)
  const [msg, setMsg] = useState("")
  const [requesting, setRequesting] = useState(false)
  // const audiobook = useRef(null)
  const audiobook = useRef(BOOKS)

  const onToggleSnackBar = () => setSnackVisible(!SnackVisible)
  const onDismissSnackBar = () => setSnackVisible(false)

  async function fetchAudiobooks() {
    setRequesting(true)
    try {
      const response = await axios.get(`${global.API}/audiobooks`)
      console.log(response)

      if (response.data.length === 0) {
        setMsg("No Audiobooks Found")
      } else {
        audiobook.current = response.data
        setMsg("Audiobooks fetched Successfully.")
      }
    } catch (error) {
      setMsg(error.message)
    } finally {
      setRequesting(false)
      onToggleSnackBar()
    }
  }

  useEffect(() => {
    ;(async () => {
      fetchAudiobooks()
    })()
  }, [])

  return (
    <SafeAreaProvider>
      <ScrollView
        contentContainerStyle={{
          minHeight: "100%",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <MonoText>Audiobook Views</MonoText>
        <Text>Get all your generated audiobooks</Text>
        <Divider style={Styles.divider} />
        {audiobook.current ? (
          audiobook.current?.map((book, index) => (
            <TouchableRipple
              key={index}
              borderless={true}
              onPress={() => {
                navigation.navigate("Content", { content: book })
              }}
            >
              <AudioCard
                book={book}
                setMsg={setMsg}
                onToggleSnackBar={onToggleSnackBar}
              />
            </TouchableRipple>
          ))
        ) : (
          <View style={Styles.container}>
            <MonoText>No Audiobooks Found</MonoText>
          </View>
        )}
      </ScrollView>
      <FAB
        style={Styles.fab}
        icon="refresh"
        loading={requesting}
        onPress={async () => {
          await fetchAudiobooks()
        }}
      />
      {msg.length > 0 && (
        <Snackbar
          visible={SnackVisible}
          onDismiss={onDismissSnackBar}
          action={{
            label: "Dismiss",
            icon: "close",
            onPress: () => {
              onDismissSnackBar()
            },
          }}
        >
          {msg}
        </Snackbar>
      )}
    </SafeAreaProvider>
  )
}

const Styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
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
