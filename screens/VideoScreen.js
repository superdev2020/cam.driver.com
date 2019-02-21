import React from 'react';
import {
  Dimensions,
  View,
} from 'react-native';

import { Video } from 'expo';

import {commonStyle} from '../Style';
import { BASE_URL}  from '../constants/API';
const win = Dimensions.get('window');

/**
 * Home Screen
 */
export default class VideoScreen extends React.Component {


  /**
   * Navigation Header
   */
  static navigationOptions = {
    header: null,
  };

  /**
   * Constructor
   * @param {*} props 
   */
  constructor(props) {
		super(props);
		const video = this.props.navigation.getParam("video");
		this.state = {
			video: video
		};
	}
  
  
  getMediaUrl(path) {
    return `${BASE_URL}/${path}`;
  }

  /**
   * Render View
   */
  render() {
    return (
      <View style={commonStyle.container}>
        <Video
					//source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
					source={{ uri: this.getMediaUrl(this.state.video.media_path) }}
					rate={1.0}
					volume={1.0}
					isMuted={false}
					resizeMode="cover"
					shouldPlay
          isLooping={false}
          useNativeControls={true}
					style={{ width: win.width, height: win.height }}
				/>
      </View>
    );
  }
}
