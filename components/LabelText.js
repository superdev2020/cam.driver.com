import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default class LabelText extends React.Component {
  render() {
    return <Text {...this.props} style={[this.props.style, styles.mainText]} />;
  }
}

const styles = StyleSheet.create({
  mainText: {
    fontFamily: 'opensans-regular',
    color: '#494949',
  },
});