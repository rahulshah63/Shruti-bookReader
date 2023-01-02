import React, { useEffect, useRef, useState } from "react"
import { StyleSheet, ScrollView } from "react-native"
import { MonoText } from "../components/StyledText"
import { Text, View } from "../components/Themed"
import { FAB, Divider, Snackbar } from "react-native-paper"
import AudioCard from "../components/Audio"
import axios from "axios"

export default function Audiobook() {
  const [SnackVisible, setSnackVisible] = useState(false)
  const [msg, setMsg] = useState("")
  const audiobook = useRef(null)

  const onToggleSnackBar = () => setSnackVisible(!SnackVisible)
  const onDismissSnackBar = () => setSnackVisible(false)

  async function fetchAudiobooks() {
    try {
      const response = await axios.get(`${global.API}/audiobooks`)
      audiobook.current = response.data
      setMsg("Audiobooks fetched Successfully.")
      onToggleSnackBar()
    } catch (error) {
      setMsg(error)
      onToggleSnackBar()
    }
  }

  useEffect(() => {
    ;(async () => {
      await fetchAudiobooks()
    })()
  }, [])

  return (
    <View>
      <ScrollView>
        <View style={Styles.container}>
          <MonoText>Audiobook Views</MonoText>
          <Text>Get all your generated audiobooks</Text>
          <Divider style={Styles.divider} />
          {audiobook.current ? (
            audiobook.current?.map((book) => <AudioCard book={book} />)
          ) : (
            <MonoText>No Audiobooks Found</MonoText>
          )}
        </View>
      </ScrollView>
      <FAB style={Styles.fab} icon="refresh" onPress={fetchAudiobooks} />
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
    </View>
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
