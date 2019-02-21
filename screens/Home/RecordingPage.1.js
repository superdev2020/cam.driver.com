import React from 'react';
import {
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  View,
  Button,
  CameraRoll,
  Dimensions,
  PermissionsAndroid,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';


import { Camera, Permissions, FileSystem, ScreenOrientation } from 'expo';
import shortid from 'shortid';
const win = Dimensions.get('window');

import styles from '../../constants/Style';

const ENDPOINT = 'http://192.168.2.30/video/index.php';

const ensureDirAsync = async (dir, intermediates) => {
  const props =  await FileSystem.getInfoAsync(dir)
  if( props.exist && props.isDirectory){
     return props;
  }
  await FileSystem.makeDirectoryAsync(dir, intermediates);
  return await ensureDirAsync(dir, intermediates)
}

export default class RecordingPage extends React.Component {
  camera = null;
	state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    ratio: '1:1',
    recording: false,
    completed: true
	};
	
	async componentDidMount() {
    const { status: cameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
    const { status: audioStatus } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    const { status: cameraRollStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const { status: externalReadStatus } = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    const { status: externalWriteStatus } = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    this.setState({ hasCameraPermission: cameraStatus === 'granted' && audioStatus === 'granted' });
	}
	
  constructor(props) {
		super(props);
	}
  
  async registerRecord() {
    const { recording, duration } = this.state;

    if (recording) {
      await delay(1000);
      this.setState(state => ({
        ...state,
        duration: state.duration + 1
      }));
      this.registerRecord();
    }
  }

  async startRecordVideo() {

    if(this.state.recording == false) {
      await this.setState(state => ({ ...state, recording: true }));

      const { uri, codec = "mp4" } = await this.camera.recordAsync({ quality: Camera.Constants.VideoQuality['480p'], mute: true });
      const type = `video/${codec}`;
      const data = new FormData();
      console.log(uri);
      const videoId = shortid.generate();
      data.append("video", {
        name: `${videoId}.${codec}`,
        type,
        uri
      });
      try {
        let result = await fetch(ENDPOINT, {
          method: "post",
          body: data
        });
        console.log('result', result);
      } catch (e) {
        console.error(e);
      }

      // this.camera.recordAsync({ quality: Camera.Constants.VideoQuality['480p'], mute: true })
      //   .then(async (file) => {
      //     alert('recordAsync', file.uri);
      //     this.setState({ fileUrl: file.uri });
      //     console.log(file);

      //     const data = new FormData();
      //     data.append("video", {
      //       name: "mobile-video-upload",
      //       type: 'video/mp4',
      //       'uri': file.uri
      //       // 'fileToUpload': file.uri
      //     });

      //     try {
      //       await fetch(ENDPOINT, {
      //         method: "post",
      //         body: data
      //       });
            
      //       console.log('done---------');
      //     } catch (e) {
      //       console.error(e);
      //     }
      //     // CameraRoll.saveToCameraRoll(file.uri, 'video').then(dddd => {
      //     //   console.log('ddddd', dddd);

      //     //   //const new_folder_info = await Expo.FileSystem.getInfoAsync(dddd);
      //     //   // const debug = `checkAndCreateFolder11111111111555: ${
      //     //   //   error.message
      //     //   // } old:${JSON.stringify(folder_info)} new:${JSON.stringify(
      //     //   //   new_folder_info
      //     //   // )}`;
      //     //   // console.log(debug);

      //     // }).catch(eee => {
      //     //   console.log('eeeee', eee);
      //     // })
      //     // const videoId = shortid.generate();
      //     // console.log('videoId', `${FileSystem.cacheDirectory}expo-image-cache`);

      //     // const folder_path = `${FileSystem.cacheDirectory}expo-image-cache`;
      //     // const folder_info = await Expo.FileSystem.getInfoAsync(folder_path);
      //     // if (!Boolean(folder_info.exists)) {
      //     //   // Create folder
      //     //   console.log("checkAndCreateFolder: Making " + folder_path);
      //     //   try {
      //     //     await FileSystem.makeDirectoryAsync(folder_path, {
      //     //       intermediates: true
      //     //     });
      //     //   } catch (error) {
      //     //     // Report folder creation error, include the folder existence before and now
      //     //     const new_folder_info = await Expo.FileSystem.getInfoAsync(folder_path);
      //     //     const debug = `checkAndCreateFolder: ${
      //     //       error.message
      //     //     } old:${JSON.stringify(folder_info)} new:${JSON.stringify(
      //     //       new_folder_info
      //     //     )}`;
      //     //     console.log(debug);
      //     //   }
      //     // }

      //     // const moveAsync = await FileSystem.moveAsync({
      //     //   from: file.uri,
      //     //   to: `${folder_path}/demo_${videoId}.mov`
      //     // });


      //     // await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}videos/`, {
      //     //   intermediates: true
      //     // });
      //     // FileSystem.makeDirectoryAsync(`file:///data/user/0/host.exp.exponent/cache/expo-image-cache/`, {
      //     //   intermediates: true
      //     // }).then(data => {
      //     //   console.log('data', data);
      //     // }).catch(error => {
      //     //   console.log('error', error);
      //     // });
      //     // console.log('makeDir+++++++++++++', dir);
      //     // const moveAsync = await FileSystem.moveAsync({
      //     //   from: file.uri,
      //     //   to: `file:///data/user/0/host.exp.exponent/demo_${videoId}.mov`
      //     // });
      //     // console.log('moveAsync-----------------', moveAsync);
      //     // console.log(`${FileSystem.documentDirectory}videos/demo_${videoId}.mov`);

      //   });
    }
  }

  async stopRecordVideo() {
    if(this.state.recording) {
      await this.setState(state => ({ ...state, recording: false, completed: false }));

      this.camera.stopRecording();

    }
  }

  fullScreen() {
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.LANDSCAPE);
  }

	render() {
    const ratio = 105 / win.width;
    const recordBtnRatio = 105 / win.width;
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.8, shadowColor: '#000', backgroundColor: '#ffffff',
        shadowRadius: 10,
        elevation: 3}}>
          {/* <View style={[{zIndex: 100}]}>
            <ActivityIndicator style={styles.middle} size={100} color="#0000ff" />
          </View> */}
          <Camera 
            ref={ref => (this.camera = ref)}
            style={{ width: win.width, height: win.width * 0.6}}
            ratio={this.state.ratio}
            type={this.state.type}>
            <View
              style={{
                flex: 1,
								flexDirection: 'row',
								justifyContent: 'flex-end'
              }}>
              <TouchableOpacity
                style={{
									alignSelf: 'flex-start',
									alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Text
                  style={{ marginTop: 8, padding: 4, paddingLeft: 10, paddingRight: 10, backgroundColor: '#ff0000', 
                    fontSize: 10, marginBottom: 10, color: 'white', justifyContent: 'flex-end', borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }}>
                  04:20
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 30, paddingBottom: 20}}>
            <View style={{width: '33%', justifyContent: 'center', alignContent: 'center', alignItems: "center"}}>
              <TouchableOpacity onPress={() => this.fullScreen()}>
                <Image source={require('../../assets/images/btn-fullscreen.png')} style={{width: 105 * ratio, height: 86 * ratio, marginBottom: 8}}/>
              </TouchableOpacity>
              <Text style={{color: '#989898', fontSize: 11}}>Full screen</Text>
            </View>
            <View style={{flex: 1, width: '33%', justifyContent: 'flex-start', alignItems: "center", alignContent: 'flex-start'}}>
              <TouchableOpacity onPress={() => this.startRecordVideo()}>
                <Image source={require('../../assets/images/btn-video-record-red.png')} style={{width: 160 * recordBtnRatio, height: 160 * recordBtnRatio, marginBottom: 8}}/>
              </TouchableOpacity>
              <Text style={{color: 'red', fontSize: 13, fontWeight: 'bold'}}>04:20</Text>
              <TouchableOpacity onPress={() => this.stopRecordVideo()} style={{shadowColor: '#000', marginTop: 6, shadowOffset: { width: 20, height: 20 }, shadowOpacity: 0.8, shadowRadius: 60, elevation: 50}}>
                <Text style={{borderWidth: 1, borderColor: 'red', padding: 6, borderRadius: 6, color: 'red', fontSize: 10}}>Stop Recording</Text>
              </TouchableOpacity>
            </View>
            <View style={{width: '33%', justifyContent: 'center', alignContent: 'center', alignItems: "center"}}>
              <TouchableOpacity>
                <Image source={require('../../assets/images/btn-screenshot.png')} style={{width: 105 * ratio, height: 86 * ratio, marginBottom: 8}}/>
              </TouchableOpacity>
              <Text style={{color: '#989898', fontSize: 11}}>Take Screenshot</Text>
            </View>
          </View>
        </View>
      );
    }
  }
}