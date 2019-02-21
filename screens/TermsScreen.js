import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

export default class ForgotScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {state} = navigation;
    return {
      title: 'Terms & Conditions',
    }
  };
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
