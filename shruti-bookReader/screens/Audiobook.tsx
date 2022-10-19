import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../components/Themed';
import { MonoText } from '../components/StyledText';

export default function Audiobook () {
  return (
    <View style={Styles.container}>
      <MonoText>Audiobook Views</MonoText>
      <Text>Get all your generated audiobooks</Text>
    </View>
  );
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});