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
  Alert,
} from 'react-native';

import RoundButton from './../components/RoundButton';
import FormInput from './../components/FormInput';
import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";
import Messages from '../constants/Messages';
import { NavigationActions, StackActions } from 'react-navigation';

const win = Dimensions.get('window');

@inject("userStore")
@observer

export default class ChangePasswordScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {state} = navigation;
    return {
      title: 'Change Password',
    }
  };
  constructor(props) {
    super(props)

    this.state = {
      user_id: null,
      forgot: false,
      password: '',
      new_password: '',
      confirm_new_password: '',
      is_loading: false,
      error_message: null,
    }
  }

  onPressOk() {
    if (this.state.forgot) {
      const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Login' })],
      });
      this.props.navigation.dispatch(resetAction);
    }
  }

  componentDidMount() {
    this.disposes = [
      reaction(
        () => this.props.userStore.changePasswordState,
        (changePasswordState) => {
          console.log("changePasswordState = ", changePasswordState);          
          if (changePasswordState.isSuccessful()) {
            this.setState({is_loading: false}, () => {
                Alert.alert(
                  '',
                  'Password has been changed successfully!',
                  [
                    {text: 'OK', onPress: () => this.onPressOk()},
                  ],
                  { cancelable: false }
                )

            });
          }
          else if(changePasswordState.isNetworkProblems()) {
            this.setState({is_loading: false, error_message: Messages.network_error_message});
          }
          else {
            this.setState({is_loading: false, show_error: true, error_message: changePasswordState.error}); 
          }
        }),
    ];

    const user_id = this.props.navigation.getParam("user_id");
    if (user_id) {
      this.setState({user_id: user_id, forgot: true});  
    } else {
      this.setState({user_id: this.props.userStore.currentUser.user_id, forgot: false});  
    }    
  }

  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
  }

  updatePassword() {
    if (this.state.is_loading) return;

    if (this.state.forgot != true && (this.state.password == null || this.state.password == "")) {
      this.setState({ error_message: Messages.invalid_password_message });
      return;
    }

    if (this.state.new_password == null || this.state.new_password == "" || this.state.confirm_new_password == null || this.state.confirm_new_password == "" || this.state.new_password != this.state.confirm_new_password) {
      this.setState({ error_message: Messages.invalid_new_password_message });
      return;
    }

    this.setState({ is_loading: true});
    this.props.userStore.changePassword(this.state.user_id, this.state.password, this.state.new_password, this.state.forgot);
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
          <View style={[styles.formInput, {marginTop: 30}]}>
            {
              this.state.forgot
              ? null
              : <FormInput type="password" style={{marginBottom: 15}} hasIcon={false} placeholder="Password" onChangeText={(text) => this.setState({password: text, error_message: null})} />
            }
            
            <FormInput type="password" style={{marginBottom: 15}} hasIcon={false} placeholder="New Password" onChangeText={(text) => this.setState({new_password: text, error_message: null})} />
            <FormInput type="password" style={{marginBottom: 15}} hasIcon={false} placeholder="Confirm Password" onChangeText={(text) => this.setState({confirm_new_password: text, error_message: null})} />
          </View>

          <RoundButton style={styles.resetButton} title="Update" isLoading={this.state.is_loading} onPress={() => this.updatePassword()}></RoundButton>
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
    paddingTop: 20,
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
