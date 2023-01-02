import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import axios from "axios"
import useCachedResources from "./hooks/useCachedResources"
import useColorScheme from "./hooks/useColorScheme"
import Navigation from "./navigation"
import React, { useState, useEffect } from "react"
import { Snackbar } from "react-native-paper"

export default function App() {
  const [msg, setMsg] = useState("")
  const [SnackVisible, setSnackVisible] = useState(false)
  const onToggleSnackBar = () => setSnackVisible(!SnackVisible)
  const onDismissSnackBar = () => setSnackVisible(false)
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()

  async function getNgrokUrl() {
    try {
      const res = await axios.get("https://api.ngrok.com/endpoints", {
        headers: {
          authorization:
            "Bearer 2JlZCcNQIvf5R5SubwEELcNMQP1_2QLUuwWRRBvVYd21zcRfK",
          "ngrok-version": "2",
        },
      })
      if (res.data.endpoints.length > 0) {
        global.API = res.data.endpoints[0].public_url
        setMsg("Ngrok is running.")
        onToggleSnackBar()
      } else {
        setMsg("Ngrok is not running.")
        onToggleSnackBar()
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    ;(async () => {
      await getNgrokUrl()
    })()
  }, [])

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
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
      </SafeAreaProvider>
    )
  }
}
