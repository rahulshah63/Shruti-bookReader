import { StyleSheet, TouchableOpacity } from "react-native"
import { MonoText } from "./StyledText"
import { Text, View } from "./Themed"
import window from "../constants/Layout"
import { Card, Title, Paragraph } from "react-native-paper"
import AudioSlider from "./AudioSlider"

export default function AudioCard({ book, setMsg, onToggleSnackBar }) {
  return (
    <Card style={Styles.cardContatiner}>
      <View style={Styles.card}>
        <Card.Cover
          style={Styles.image}
          source={{
            uri: `${global.API}/sendcover/?filename=${book.name}`,
          }}
        />
        <Card.Content>
          <Title>{book.name}</Title>
          <MonoText>{book.tag}</MonoText>
          <Paragraph>{book.description}</Paragraph>
        </Card.Content>
      </View>
      <AudioSlider
        url={`${global.API}/sendfile/?filename=${book.name}`}
        setMsg={setMsg}
        onToggleSnackBar={onToggleSnackBar}
      />
    </Card>
  )
}

const Styles = StyleSheet.create({
  cardContatiner: {
    width: window.window.width - 20,
    borderRadius: 10,
    margin: 5,
  },
  card: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    width: "95%",
    borderRadius: 10,
    margin: 5,
  },
  image: {
    width: 60,
    height: 100,
    borderRadius: 5,
  },
})
