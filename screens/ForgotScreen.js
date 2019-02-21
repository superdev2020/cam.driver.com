import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  View,
} from 'react-native';

import RoundButton from './../components/RoundButton';
import FormInput from './../components/FormInput';

import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";
import Messages from '../constants/Messages';

const win = Dimensions.get('window');

@inject("userStore")
@observer

export default class ForgotScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {state} = navigation;
    return {
      title: 'Forgot Password',
    }
  };

  constructor(props) {
    super(props)

    this.state = {
      email: '',
      is_loading: false,
      error_message: null,
    }
  }

  componentDidMount() {
    this.disposes = [
      reaction(
        () => this.props.userStore.forgotPasswordState,
        (forgotPasswordState) => {
          if (forgotPasswordState.isSuccessful()) {
            this.setState({
                is_loading: false
            }, () => {
                this.props.navigation.navigate('ResetPassword', {
                  email: this.state.email
                });
            });
          }
          else if(forgotPasswordState.isNetworkProblems()) {
            this.setState({is_loading: false, error_message: Messages.network_error_message});
          }
          else {
            this.setState({is_loading: false, show_error: true, error_message: forgotPasswordState.error}); 
          }
        }),
    ];
  }

  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
  }

  resetPassword() {
    if (this.state.is_loading) return;

    if (this.state.email == null || this.state.email == "") {
      this.setState({ error_message: Messages.invalid_email_message });
      return;
    }

    this.setState({ is_loading: true, error_message: null});
    this.props.userStore.forgotPassword(this.state.email);
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
          <Text style={styles.descriptionText}>We just need your registered email address to send you password reset.</Text>
          <View style={[styles.formInput, {marginTop: 30}]}>
            <FormInput type="email" hasIcon={false} placeholder="Email" onChangeText={(text) => this.setState({email: text, error_message: null})} />
          </View>

          <RoundButton style={styles.resetButton} title="Reset" isLoading={this.state.is_loading} onPress={() => this.resetPassword()}></RoundButton>
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

  logoImage: {
    width: 100,
    height: 92,
    marginBottom: 30,
  },

  prefixIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },

  form: {
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 50,
  },

  descriptionText: {
  	textAlign: 'center',
  	fontFamily: 'opensans-regular',
  	color: '#242424',
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
