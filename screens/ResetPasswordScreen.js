import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  View,
} from 'react-native';

import RoundButton from './../components/RoundButton';
import FormInput from './../components/FormInput';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";
import Messages from '../constants/Messages';

const win = Dimensions.get('window');

@inject("userStore")
@observer

export default class ResetPasswordScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {state} = navigation;
    return {
      title: 'Reset Password',
    }
  };

  constructor(props) {
    super(props)

    this.state = {
      pin: '',
      email: '',
      is_loading: false,
      error_message: null,
    }
  }

  componentDidMount() {
    this.disposes = [
      reaction(
        () => this.props.userStore.confirmPinState,
        (confirmPinState) => {
          if (confirmPinState.isSuccessful()) {
            const user_id = confirmPinState.value.user_id;
            console.log("user_id = ", user_id);

            this.setState({
                is_loading: false
            }, () => {
                this.props.navigation.navigate('ChangePassword', {
                  user_id: user_id
                });
            });
          }
          else if(confirmPinState.isNetworkProblems()) {
            this.setState({is_loading: false, error_message: Messages.network_error_message});
          }
          else {
            this.setState({is_loading: false, show_error: true, error_message: confirmPinState.error}); 
          }
        }),
    ];

    const email = this.props.navigation.getParam("email");
    this.setState({email: email});
  }

  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
  }

  verify() {
    if (this.state.is_loading) return;

    if (this.state.pin == null || this.state.pin.length != 4) {
      this.setState({ error_message: Messages.invalid_pin_message });
      return;
    }

    this.setState({ is_loading: true});
    this.props.userStore.confirmPin(this.state.email, this.state.pin);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage}
          source={require('./../assets/images/background_overlay.png')}
        /> 

        <View style={styles.form}>
          <Text style={styles.titleText}>Enter Code</Text>

          <View style={{justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
            <SmoothPinCodeInput
              ref={this.pinInput}
              value={this.state.pin}
              onTextChange={code => this.setState({ pin: code })}
              cellSpacing={12}
              autoFocus={true}
              textStyle={{fontFamily: 'opensans-regular', color: '#1e1e1e', fontSize: 28}}
           />
          </View>
          

          <Text style={styles.descriptionText}>Confirm your mms number to update your password</Text>
          <RoundButton style={styles.resetButton} title="Verify" isLoading={this.state.is_loading} onPress={() => this.verify()}></RoundButton>
          {
            this.state.error_message
            ? <Text style={styles.errorMessage}>{this.state.error_message}</Text>
            : null
          }
        </View>
      </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    width: win.width,
    height: win.width,
  },

  form: {
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 60,
  },

  titleText: {
    textAlign: 'center',
    fontFamily: 'opensans-regular',
    color: '#242424',
    fontSize: 20,
    marginBottom: 15,
  },

  descriptionText: {
    textAlign: 'center',
    fontFamily: 'opensans-regular',
    color: '#242424',
  },

  verifyTextBox: {
    fontFamily: 'opensans-regular',
    color: '#1e1e1e',
    fontSize: 28,
    borderRadius: 5,
    borderColor: '#cccccc',
    borderWidth: 1,
    width: 55,
    height: 55,
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center',
  },

  errorMessage: {
    color: 'red',
    fontFamily: 'opensans-regular',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },

  resetButton: {
    marginTop: 50,
  }
});
