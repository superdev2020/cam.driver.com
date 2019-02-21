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

import LabelText from './../components/LabelText';
import ButtonText from './../components/ButtonText';
import RoundButton from './../components/RoundButton';
import FormInput from './../components/FormInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";
import Messages from '../constants/Messages';

const win = Dimensions.get('window');

@inject("userStore")
@observer

export default class SignUpScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {state} = navigation;
    return {
      title: 'Sign Up',
    }
  };

  constructor(props) {
    super(props)

    this.state = {
    	first_name: '',
    	last_name: '',
    	email: '',
    	password: '',
    	confirm_password: '',
      is_loading: false,
      error_message: null,
    }
  }

  componentDidMount() {
    this.disposes = [
      reaction(
        () => this.props.userStore.signUpState,
        (signUpState) => {
          console.log("signupState = ", signUpState);          
          if (signUpState.isSuccessful()) {
            this.setState({
                is_loading: false, first_name: '', last_name: '', password: '', email: '', confirm_password: ''
            }, () => {
                this.props.navigation.navigate('Home', {
                  navigation_name: 'Home',
                });
            });
          }
          else if(signUpState.isNetworkProblems()) {
            this.setState({is_loading: false, error_message: Messages.network_error_message});
          }
          else {
            this.setState({is_loading: false, show_error: true, error_message: signUpState.error}); 
          }
        }),
    ];
  }

  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
  }

  onTerms() {
    this.props.navigation.navigate('Terms'); 
  }

  onSignUp() {
    if (this.state.is_loading) return;

    if (this.state.first_name == null || this.state.first_name == "") {
      this.setState({ error_message: Messages.invalid_first_name_message });
      return;
    }

    if (this.state.last_name == null || this.state.last_name == "") {
      this.setState({ error_message: Messages.invalid_last_name_message });
      return;
    }

    if (this.state.email == null || this.state.email == "") {
      this.setState({ error_message: Messages.invalid_email_message });
      return;
    }

    if (this.state.password == null || this.state.password == "" || this.state.confirm_password == null || this.state.confirm_password == "" || this.state.password != this.state.confirm_password) {
      this.setState({ error_message: Messages.invalid_password_message });
      return;
    }

    this.setState({ is_loading: true, error_message: null});
    this.props.userStore.signUp(this.state.first_name, this.state.last_name, this.state.email, this.state.password);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      	<KeyboardAwareScrollView style={{backgroundColor: 'white'}}>
      		<View style={styles.container}>
		        <Image
		          style={styles.backgroundImage}
		          source={require('./../assets/images/background_overlay.png')}
		        /> 

		        <View style={styles.form}>
		          <Image
		            style={styles.logoImage} resizeMode="contain"
		            source={require('./../assets/images/logo.png')}
		          />

		          <View style={{flexDirection: 'row', height: 38, justifyContent: 'space-between', width: '100%', marginBottom: 15}}>
		            <FormInput type="text" style={{width: win.width/2 - 30}} hasIcon={false} floatSize={true} placeholder="First Name" value={this.state.first_name} onChangeText={(text) => this.setState({first_name: text, error_message: null})} />
		            <FormInput type="text" style={{width: win.width/2 - 30}} hasIcon={false} floatSize={true} placeholder="Last Name" value={this.state.last_name} onChangeText={(text) => this.setState({last_name: text, error_message: null})} />
		          </View>
		          
		          <FormInput type="email" style={{marginBottom: 15}} hasIcon={false} placeholder="Email" value={this.state.email} onChangeText={(text) => this.setState({email: text, error_message: null})} />
		          <FormInput type="password" style={{marginBottom: 15}} hasIcon={false} placeholder="Password" value={this.state.password} onChangeText={(text) => this.setState({password: text, error_message: null})} />
		          <FormInput type="password" hasIcon={false} placeholder="Confirm Password" value={this.state.confirm_password} onChangeText={(text) => this.setState({confirm_password: text, error_message: null})} />

		          <RoundButton style={styles.signButton} title="Sign Up" isLoading={this.state.is_loading} onPress={() => this.onSignUp()}></RoundButton>
		          {
		            this.state.error_message
		            ? <Text style={styles.errorMessage}>{this.state.error_message}</Text>
		            : null
		          }

		        </View>

		        <View style={styles.bottomView}>
		          <LabelText style={styles.labelText}>Clicking Register means agreeing our</LabelText>
		          <TouchableOpacity onPress={() => this.onTerms()}>
		            <ButtonText style={styles.buttonText}>Terms & Conditions</ButtonText>
		          </TouchableOpacity>
		        </View>
	      	</View>
	      </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: win.height,
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
    marginTop: 30,
    marginBottom: 30,
  },

  prefixIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },

  form: {
    flex: 1,
    alignItems: "center",
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    height: 350,
  },

  signButton: {
    marginTop: 50,
  },

  bottomView: {
    position: 'absolute',
    bottom: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },

  labelText: {
    fontSize: 10,
  },

  errorMessage: {
    color: 'red',
    fontFamily: 'opensans-regular',
    fontSize: 12,
    marginTop: 5,
  },

  buttonText: {
    fontSize: 10,
  }

});
