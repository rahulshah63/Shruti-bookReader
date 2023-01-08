import { LinkingOptions } from "@react-navigation/native"
import * as Linking from "expo-linking"

import { RootStackParamList } from "../types"

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              Screen: "one",
            },
          },
          Audiobook: {
            screens: {
              Screen: "two",
            },
          },
        },
      },
      About: "modal",
      Content: "modal",
      NotFound: "*",
    },
  },
}

export default linking
