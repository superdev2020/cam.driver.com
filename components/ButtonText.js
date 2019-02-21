import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default class ButtonText extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, styles.mainText]} />;
  }
}

const styles = StyleSheet.create({
  mainText: {
    fontFamily: 'opensans-semibold',
    color: 'black',
  },
});