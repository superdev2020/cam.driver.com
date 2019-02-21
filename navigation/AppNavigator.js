import { createStackNavigator } from 'react-navigation';
import Home from '../screens/HomeScreen';
import Video from '../screens/VideoScreen';
import Login from '../screens/LoginScreen';
import SignUp from '../screens/SignUpScreen';
import Forgot from '../screens/ForgotScreen';
import ResetPassword from '../screens/ResetPasswordScreen';
import ChangePassword from '../screens/ChangePasswordScreen';
import Terms from '../screens/TermsScreen';
import EditProfile from '../screens/EditProfileScreen';

const AppNavigator = createStackNavigator({
  Login: { screen: Login },
  SignUp: { screen: SignUp },
  Forgot: { screen: Forgot },
  ResetPassword: { screen: ResetPassword},
  ChangePassword: { screen: ChangePassword},
  Terms: { screen: Terms },
  Home: {screen: Home}, 
  Home_noTransition: { screen: Home },
  Video: { screen: Video },
  EditProfile: {screen: EditProfile}
}, {
    initialRouteName: 'Login',
    navigationOptions: {
      headerTintColor: '#a0a0a0',
      headerStyle: {
      	elevation: 0,
      	shadowOpacity: 0,
      	borderBottomWidth: 0,
      },
      headerTitleStyle: {
        fontFamily: 'opensans-regular',
        fontSize: 17,
        color: 'black',
        textAlign: 'center',
      },
    },

    transitionConfig: (sceneProps) => ({
      transitionSpec: {
        duration: sceneProps.scene.route.routeName.endsWith('_noTransition') ? 0 : 260,
      },
    }),
  });
  // Now AppContainer is the main component for React to render
  
  export default AppNavigator;