import React, { useEffect, useRef, useState } from "react"
import { StyleSheet, ScrollView } from "react-native"
import { MonoText } from "../components/StyledText"
import { Text, View } from "../components/Themed"
import { FAB, Divider, Snackbar } from "react-native-paper"
import AudioCard from "../components/Audio"
import axios from "axios"
import { SafeAreaProvider } from "react-native-safe-area-context"

export default function Audiobook() {
  const [SnackVisible, setSnackVisible] = useState(false)
  const [requesting, setRequesting] = useState(false)
  const [msg, setMsg] = useState("")
  const audiobook = useRef(null)

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
        <View style={Styles.container}>
          {audiobook.current ? (
            audiobook.current?.map((book) => <AudioCard book={book} />)
          ) : (
            <MonoText>No Audiobooks Found</MonoText>
          )}
        </View>
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
    flex: 1,
    alignItems: "center",
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
