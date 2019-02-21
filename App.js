import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import { createAppContainer } from 'react-navigation';
import FlashMessage from "react-native-flash-message";
import { Provider } from 'mobx-react';
import AppNavigator from './navigation/AppNavigator';
import stores from './stores';

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <Provider {...stores}>
            <AppContainer
              ref={nav => {
                this.navigator = nav;
              }}
            />
          </Provider>
          <FlashMessage position="top" />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
        require('./assets/images/left_arrow_icon.png'),
        require('./assets/images/bottom_bar.png')
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        'opensans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
        'opensans-bolditalic': require('./assets/fonts/OpenSans-BoldItalic.ttf'),
        'opensans-extrabold': require('./assets/fonts/OpenSans-ExtraBold.ttf'),
        'opensans-extrabolditalic': require('./assets/fonts/OpenSans-ExtraBoldItalic.ttf'),
        'opensans-italic': require('./assets/fonts/OpenSans-Italic.ttf'),
        'opensans-light': require('./assets/fonts/OpenSans-Light.ttf'),
        'opensans-lightitalic': require('./assets/fonts/OpenSans-LightItalic.ttf'),
        'opensans-regular': require('./assets/fonts/OpenSans-Regular.ttf'),
        'opensans-semibold': require('./assets/fonts/OpenSans-Semibold.ttf'),
        'opensans-semibolditalic': require('./assets/fonts/OpenSans-SemiboldItalic.ttf')
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
