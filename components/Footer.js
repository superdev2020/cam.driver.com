/**
 * Footer Navigation
 */

import React from 'react';
import {
  Image,
  TouchableOpacity,
	View,
	StyleSheet
} from 'react-native';

import { observer, inject } from 'mobx-react';
import {win} from '../Style';

@inject("settingStore")
@observer
export default class Footer extends React.Component {
	
	constructor(props) {
		super(props);
  }
  
  changeVideoMap() {
    if(this.props.settingStore.homeScreenPage == 'record') {
      if (this.props.settingStore.currentRecordingScreen == 'video')
        this.props.settingStore.currentRecordingScreen = 'map';
      else
        this.props.settingStore.currentRecordingScreen = 'video';
    } else 
      this.props.settingStore.homeScreenPage = 'record';
    
  }

	render() {
    const fullScreen = this.props.settingStore.fullScreen ? {bottom: -1000} : null;
		return (
			<View style={[styles.bottomView, fullScreen]}>
          <Image
            style={styles.bottomBackgroundImage}
            source={require('../assets/images/bottom_bar.png')}/>
            <TouchableOpacity style={styles.recordButton}  onPress={() => this.changeVideoMap()}>
            {
              this.props.settingStore.currentRecordingScreen == 'video'
              ? <Image style={{width: win.width * 0.15, height: win.width * 0.15}} source={require('../assets/images/btn-video-record-purple.png')} />
              : <Image style={{width: win.width * 0.15, height: win.width * 0.15}} source={require('../assets/images/btn-video-map-purple.png')} />
            }
              
            </TouchableOpacity>
            <TouchableOpacity style={styles.historyButton} onPress={() => this.props.settingStore.homeScreenPage = 'history'}> 
            {
              this.props.settingStore.homeScreenPage == 'history'
              ?  <Image
                style={{width: win.width * 0.191, height: 36}}
                  source={require('./../assets/images/btn-recorded-videos_active.png')}
                />

              :  <Image 
              style={{width: win.width * 0.191, height: 36}}
                  source={require('./../assets/images/btn-recorded-videos.png')}
                />
            }
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsButton} onPress={() => this.props.settingStore.homeScreenPage ='settings'}> 
            {
              this.props.settingStore.homeScreenPage == 'settings' 
              ?  <Image 
              style={{width: win.width * 0.191, height: 36}}
                  source={require('./../assets/images/btn-settings_active.png')}
                />
              :  <Image 
                  style={{width: win.width * 0.191, height: 36}}
                  source={require('./../assets/images/btn-settings.png')}
                />
            }
          </TouchableOpacity>
        </View>
		);
	}
}


const styles = StyleSheet.create({
  bottomView: { 
    /*backgroundColor: '#fff',*/
    width: '100%',
    position: 'absolute',
    bottom: 0,
    // height: 500,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 2
  },

  recordButton: {
    position: 'absolute',
    bottom: win.width * 0.042,
  },

  historyButton: {
    position: 'absolute',
    left: win.width / 4 - 45,
    top: 15,
  },

  settingsButton: {
    position: 'absolute',
    left: win.width * 3 / 4,
    top: 15,
  },

  bottomBackgroundImage: {
    width: '100%',
    height: win.width * 0.16,
    opacity: 1
  },
});

