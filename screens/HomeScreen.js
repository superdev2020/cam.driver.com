
/**
 * Home Screen
 */

import React from 'react';
import {
  Text,
  View,
  StatusBar,

} from 'react-native';
import { WebBrowser, Constants, TaskManager } from 'expo';
import HistoryPage from './Home/HistoryPage';
import RecordingPage from './Home/RecordingPage';
import SettingsPage from './Home/SettingsPage';
import MapPage from './Home/MapPage';
import commonStyle from '../Style';
import Header from '../components/Header';
import Footer from '../components/Footer';


import { observer, inject } from 'mobx-react';

@inject("settingStore")
@observer
export default class HomeScreen extends React.Component {

  /**
   * Navigation Header
   */
  static navigationOptions = {
    header: null
  };

  /**
   * Constructor
   * @param {*} props 
   */
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //StatusBar.setHidden(true);
  }

  changePage(page) {
    this.setState({page: page});
  }

  

  editProfile() {
    // this.props.navigation.navigate('EditProfile');
  }

  changePassword() {
    // this.props.navigation.navigate('ChangePassword'); 
  }

  logout() {
    // this.props.userStore.logout();
    
    // const resetAction = StackActions.reset({
    //     index: 0,
    //     actions: [NavigationActions.navigate({ routeName: 'Login' })],
    // });
    // this.props.navigation.dispatch(resetAction);
  }  

  

  /**
   * Render View
   */
  render() {
    return (
      <View style={[commonStyle.container]}>
        <Header title="DashCamp App"/>
        {
          this.props.settingStore.homeScreenPage === 'history'
          ? <HistoryPage navigation={this.props.navigation}></HistoryPage>
          : null
        }
        {
          this.props.settingStore.homeScreenPage === 'record' && this.props.settingStore.currentRecordingScreen == 'video'
          ? <RecordingPage navigation={this.props.navigation}></RecordingPage>
          : null
        }
        {
          this.props.settingStore.homeScreenPage === 'record' && this.props.settingStore.currentRecordingScreen == 'map'
          ? <MapPage navigation={this.props.navigation}></MapPage>
          : null
        }
        {/* {
          this.props.settingStore.homeScreenPage === 'map'
          ? <MapPage3 navigation={this.props.navigation}></MapPage3>
          : null
        } */}
        {
          this.props.settingStore.homeScreenPage == 'settings'
          ? <SettingsPage onLogout={() => this.logout()} onEditProfile={() => this.editProfile()} onChangePassword={() => this.changePassword()} />
          : null
        }
        <Footer/>
      </View>
    );
  }
  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}
