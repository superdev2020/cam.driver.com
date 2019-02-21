import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  CameraRoll,
  PermissionsAndroid,
  StyleSheet,
  BackHandler
} from 'react-native';

import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-popup-dialog';

import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { Camera, Permissions, ScreenOrientation } from 'expo';
import { inject, observer } from 'mobx-react';
import FormInput from '../../components/FormInput';
import shortid from 'shortid';
import delay from 'delay';
import {commonStyle, win } from '../../Style';
import { showMessage } from 'react-native-flash-message';
import { reaction } from "mobx";

@inject("settingStore")
@inject("mediaStore")
@inject("userStore")
@observer
export default class RecordingPage extends React.Component {
  camera = null;
  uri = null;
  state = {
    hasCameraPermission: null, // camera permission check
    type: Camera.Constants.Type.back, // camera type
    ratio: '1:1', // camera aspect ratio
    recording: false, // is recording now?
    completed: true, // all things completed?
    fullscreen: false, // current oriantiation status
    flash: 'off',
    muted: true,
    duration: 0,
    showStopDialog: false,
    showSaveDialog: false
  };

  async componentDidMount() {

    console.log('componentDidMount')
    const { status: cameraStatus } = await Permissions.askAsync(Permissions.CAMERA);
    const { status: audioStatus } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    const { status: cameraRollStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const { status: externalReadStatus } = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    const { status: externalWriteStatus } = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    this.setState({ hasCameraPermission: cameraStatus === 'granted' && audioStatus === 'granted' });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    this.disposes = [
      reaction(
        () => this.props.mediaStore.postMediaState,
        (postMediaState) => {
          if (postMediaState.isSuccessful()) {
            showMessage({message: 'Media is uploaded successfully', type: 'success'});
          } else if (postMediaState.isFailed()) {
            showMessage({message: 'Media is not uploaded', type: 'danger'});
          } 
        }
      ),

      reaction(
        () => this.props.userStore.loginState,
        (loginState) => {
          console.log("login success = ", loginState);          
          if (loginState.isSuccessful()) {
            this.setState({
                is_loading: false, remember: false, email: '', password: ''
            }, () => {
                this.props.navigation.navigate('Home', {
                  navigation_name: 'Home',
                });
            });
          }
          else if(loginState.isNetworkProblems()) {
            this.setState({is_loading: false, error_message: Messages.network_error_message});
          }
          else {
            this.setState({is_loading: false, show_error: true, error_message: loginState.error}); 
          }
        }),
    ];
  }

  handleBackPress = () => {
    return true;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  constructor(props) {
    super(props)
  }

  printChronometer = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remseconds = seconds % 60;
    return '' + (minutes < 10 ? '0' : '') + minutes + ':' + (remseconds < 10 ? '0' : '') + remseconds;
  };

  /**
   * Recording time
   */
  async registerRecord() {
    const { recording, duration } = this.state;
    if (recording) {
      await delay(1000);
      this.setState(state => ({ ...state, duration: state.duration + 1}));
      this.registerRecord();
    }
  }

  /**
   * Start recording.
   */
  async startRecordVideo() {
    if (this.state.recording == false) {
      await this.setState({ recording: true, duration: 0 });
      this.registerRecord();
      this.camera.recordAsync({ quality: Camera.Constants.VideoQuality['480p'], mute: this.state.muted }).then((file) => {
        this.uri = file.uri;
      });
    }
  }

  savePhoto() {
    if (this.state.title == null || this.state.title == "") {
      showMessage({message: "Please input the photo title", type: "danger"});
      return;
    }

    this.setState({showSaveDialog: false});
    console.log(this.uri);
    const type = `image/jpg`;
    const videoId = shortid.generate();
    const name =  `${videoId}.jpg`;
    this.props.mediaStore.postMedia(this.props.userStore.currentUser.user_id, this.state.title, {uri: this.uri, name, type}, 'photo');

  }
  saveVideo() {
    const codec = 'mp4';
      //console.log('finished');
      // CameraRoll.saveToCameraRoll(uri, 'video').then(content => {
      //   console.log('content data', content);
      // }).catch(eee => {
      //   console.log('eeeee', eee);
      // })

      if (this.state.title == null || this.state.title == "") {
        showMessage({message: "Please input a video title", type: "danger"});
        return;
      }

      this.setState({showSaveDialog: false});
      if(this.state.duration < 5) {
        showMessage({
          message: "We can't save video in less 5s",
          type: "warning",
        });
      } else {
        const type = `video/${codec}`;
        const videoId = shortid.generate();
        const name =  `${videoId}.${codec}`;
        this.props.mediaStore.postMedia(this.props.userStore.currentUser.user_id, this.state.title, {uri: this.uri, name, type}, 'video');
      }
  }
  async _stopRecordVideo() {
    await this.setState(state => ({ ...state, recording: false, completed: false }));
    this.camera.stopRecording();
  }

  stopRecordVideo() {
    if (this.state.recording) {
      this.setState({showStopDialog: true});
    }
  }

  /**
   * Enter full screen
   */
  async fullScreen() {
    this.props.settingStore.fullScreen = true;
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.LANDSCAPE);
  }

  /**
   * Exist full screen
   */
  async existFullScreen() {
    this.props.settingStore.fullScreen = false;
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT);
  }

  /**
   * Change flash mode
   */
  changeFlashMode() {
    (this.state.flash == 'off') ? this.setState({flash: 'on'}) : this.setState({flash: 'off'});
  }

  /**
   * Start and Stop record
   */
  toggleStartStopRecord() {
    if(this.state.recording) {
      this.stopRecordVideo();
    } else {
      this.startRecordVideo();
    }
  }

  async takePhoto() {
    let photo = await this.camera.takePictureAsync();
    this.uri = photo.uri;

    await this.setState({showSaveDialog: true, mediaType: 'photo'});
    // console.log(photo);
    // CameraRoll.saveToCameraRoll(photo.uri, 'photo').then(content => {
    //   console.log('content data', content);
    // }).catch(eee => {
    //   console.log('eeeee', eee);
    // })
  }

  render() {
    const ratio = 105 / win.width;
    const recordBtnRatio = 105 / win.width;
    const { hasCameraPermission } = this.state;

    const cameraFullScreen = this.props.settingStore.fullScreen ? styles.cameraFullScreen : null;
    const container = this.props.settingStore.fullScreen ? commonStyle.container : null;
    const normalScreen = this.props.settingStore.fullScreen ? commonStyle.hidden : null;
    const fullScreen = this.props.settingStore.fullScreen ? null : commonStyle.hidden;
    

    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={[styles.container, container]}>
          <Camera ref={ref => (this.camera = ref)} style={[styles.camera, cameraFullScreen]}  useCamera2Api={true} onMountError={(error) => {
            console.log('camera error', error)
          }}
            ratio={this.state.ratio} type={this.state.type} flashMode={this.state.flash}>
            {/* The recording time */}
            <View style={[styles.rightWrapper, normalScreen]}>
              <View style={[styles.transparentBackgroundRight]}></View>
              <MaterialCommunityIcons style={{ marginTop: 8, marginLeft: 10 }} name="checkbox-blank-circle" size={14} color="red" />
              <Text style={styles.time}>{this.printChronometer(this.state.duration)}</Text>
            </View>
            <View style={[styles.leftWrapper, fullScreen]}>
              <View style={[styles.transparentBackgroundLeft]}></View>
              <Text style={styles.time}>{this.printChronometer(this.state.duration)}</Text>
              <MaterialCommunityIcons style={{ marginTop: 8, marginRight: 10 }} name="checkbox-blank-circle" size={14} color="red" />
            </View>
            {/* Close button */}
            <TouchableOpacity style={[styles.rightWrapper, fullScreen]} onPress={() => { this.existFullScreen() }}>
              <View style={[styles.transparentBackgroundRight]}></View>
              <AntDesign style={{ marginTop: 8, marginLeft: 10, fontWeight: 'bold' }} name="close" size={14} color="white" />
              <Text style={[styles.time, { color: 'white' }]}>CLOSE</Text>
            </TouchableOpacity>
            {/* Fullscreen Controls */}
            <View style={[styles.fullScreenControlsWrapper, fullScreen, {textAlign: 'center'}]}>
              <View style={[styles.fullScreenControls]}>
                <View style={[styles.transparentBackgroundFullScreen]}></View>
                <TouchableOpacity onPress={() => this.changeFlashMode()}>
                {
                  this.state.flash == 'on' 
                  ? <Image source={require('../../assets/images/btn-flash-white.png')} style={{height: 40}} resizeMode="contain"/>
                  : <Image source={require('../../assets/images/btn-flash-white-disabled.png')} style={{height: 40}} resizeMode="contain"/>
                }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({muted: !this.state.muted})} disabled={this.state.recording}>
                { 
                  this.state.muted
                  ? <Image source={require('../../assets/images/btn-audio-disable-white.png')} style={{height: 40}} resizeMode="contain"/>
                  : <Image source={require('../../assets/images/btn-audio-enable-white.png')} style={{height: 40}} resizeMode="contain"/>
                }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.toggleStartStopRecord()}>
                {
                  this.state.recording
                  ? <Image source={require('../../assets/images/btn-rec-white-stoped.png')} style={{height: 40}} resizeMode="contain"/>
                  : <Image source={require('../../assets/images/btn-rec-white.png')} style={{height: 40}} resizeMode="contain"/>
                }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.fullScreen()}>
                  <Image source={require('../../assets/images/btn-settings-white.png')} style={{height: 40}} resizeMode="contain"/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.fullScreen()}>
                  <Image source={require('../../assets/images/btn-video-map-white.png')} style={{height: 40}} resizeMode="contain"/>
                </TouchableOpacity>
              </View>
            </View>
          </Camera>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', justifyContent: 'center', paddingTop: 30, paddingBottom: 20 }}>
            <View style={styles.control}>
              <TouchableOpacity  style={{alignItems: "center"}} onPress={() => this.fullScreen()}>
                <Image source={require('../../assets/images/btn-fullscreen.png')} style={{ width: 105 * ratio, height: 86 * ratio, marginBottom: 8 }} />
                <Text style={styles.controlLabel}>Full screen</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.control}>
              <TouchableOpacity onPress={() => this.startRecordVideo()}>
                <Image source={require('../../assets/images/btn-video-record-red.png')} style={{ width: 160 * recordBtnRatio, height: 160 * recordBtnRatio, marginBottom: 8 }} />
              </TouchableOpacity>
              <Text style={{ color: 'red', fontSize: 13, fontWeight: 'bold' }}>{this.printChronometer(this.state.duration)}</Text>
              <TouchableOpacity onPress={() => this.stopRecordVideo()} style={{ shadowColor: '#000', marginTop: 6, shadowOffset: { width: 20, height: 20 }, shadowOpacity: 0.8, shadowRadius: 60, elevation: 50 }}>
                <Text style={{ borderWidth: 1, borderColor: 'red', padding: 6, borderRadius: 6, color: 'red', fontSize: 10 }}>Stop Recording</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.control}>
              <TouchableOpacity onPress={() => this.takePhoto()} style={{alignItems: "center"}}>
                <Image source={require('../../assets/images/btn-screenshot.png')} style={{ width: 105 * ratio, height: 86 * ratio, marginBottom: 8 }} />
                <Text style={styles.controlLabel}>Take Screenshot</Text>                
              </TouchableOpacity>
            </View>
          </View>
          {/* Stop Dialog */}
          <Dialog onDismiss={() => {this.setState({ showStopDialog: false });}}
            width={0.9}
            dialogStyle={{maxWidth: 300}}
            visible={this.state.showStopDialog}
            rounded
            dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
            actionsBordered
            footer={
              <DialogFooter>
                <DialogButton
                  text="NO"
                  bordered
                  style={{borderTopColor: '#e6e6e6', borderTopWidth: 1}}
                  textStyle={{color: '#a7a7a7', fontSize: 16, fontWeight: '100'}}
                  onPress={() => {
                    this._stopRecordVideo();
                    this.setState({ showStopDialog: false, title: '' });
                    if(this.state.duration < 5) {
                      return;
                    }
                    this.setState({ showSaveDialog: true, mediaType: 'video' });
                    
                  }}
                  key="button-1"
                />
                <DialogButton
                  text="YES"
                  bordered
                  style={{borderTopColor: '#e6e6e6', borderTopWidth: 1}}
                  textStyle={{color: '#7226a0', fontSize: 16, fontWeight: '100'}}
                  onPress={() => {
                    this.setState({recording: true, showStopDialog: false});
                  }}
                  key="button-2"
                />
              </DialogFooter>
            }
          >
            <DialogContent style={commonStyle.dialogContent}>
              <Image source={require('../../assets/images/record-purple-icon.png')} resizeMode="contain" style={{width: 62}}/>
              <Text style={[commonStyle.text, commonStyle.textCenter]}>Do you wish to continue recording?</Text>
            </DialogContent>
          </Dialog>

          {/* Save Dialog */}
          <Dialog onDismiss={() => {this.setState({ showSaveDialog: false });}}
            width={0.9}
            dialogStyle={{maxWidth: 300}}
            visible={this.state.showSaveDialog}
            rounded
            dialogAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
            actionsBordered
            footer={
              <DialogFooter>
                <DialogButton
                  text="NO"
                  bordered
                  style={{borderTopColor: '#e6e6e6', borderTopWidth: 1}}
                  textStyle={{color: '#a7a7a7', fontSize: 16, fontWeight: '100'}}
                  onPress={() => {
                    this.setState({ showSaveDialog: false });
                  }}
                  key="button-1"
                />
                <DialogButton
                  text="YES"
                  bordered
                  style={{borderTopColor: '#e6e6e6', borderTopWidth: 1}}
                  textStyle={{color: '#7226a0', fontSize: 16, fontWeight: '100'}}
                  onPress={() => {

                    if(this.state.mediaType == 'video') {
                      this.saveVideo();
                    } else {
                      this.savePhoto();
                    }
                    
                  }}
                  key="button-2"
                />
              </DialogFooter>
            }
          >
            <DialogContent style={commonStyle.dialogContent}>
              <Image source={require('../../assets/images/record-purple-icon.png')} resizeMode="contain" style={{width: 62}}/>
              <Text style={[commonStyle.text, commonStyle.textCenter]}>Do you wish to save media?</Text>
              <FormInput hasIcon={true} placeholder="Title" type="text" value={this.state.title} style={{marginTop: 20}} 
                inputStyle={{textAlign: "center"}} onChangeText={(text) => this.setState({title: text, error_message: null})}/>
            </DialogContent>
          </Dialog>

        </View>
      );
    }
  }
}

const styles = StyleSheet.create({

  container: {
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8, shadowColor: '#000', backgroundColor: '#ffffff',
    shadowRadius: 10,
    elevation: 3
  },

  camera: {
    width: win.width, height: win.width * 0.6
  },

  rightWrapper: {
    position: 'absolute',
    right: 0,
    top: 16,
    flex: 1, flexDirection: 'row',
    zIndex: 1000,
  },

  leftWrapper: {
    position: 'absolute',
    left: 0,
    top: 16,
    flex: 1, flexDirection: 'row',
    zIndex: 1000,
  },

  fullScreenControlsWrapper: {
    top: win.width * 4 / 6 + 20,
    width: '100%',
    textAlign: 'center',
    alignItems: 'center',
    position: 'absolute'
  },

  fullScreenControls: {
    flex: 1,
    flexDirection: 'row', justifyContent: 'space-around',
    width: '70%',
    paddingTop: 10, paddingBottom: 10
  },

  transparentBackgroundFullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
    opacity: 0.4,
    borderRadius: 40
  },

  transparentBackgroundRight: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
    opacity: 0.4,
    borderTopLeftRadius: 20, borderBottomLeftRadius: 20,
  },

  transparentBackgroundLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
    opacity: 0.4,
    borderTopRightRadius: 20, borderBottomRightRadius: 20,
  },

  time: {
    padding: 4, paddingLeft: 10, paddingRight: 10,
    fontSize: 14,
    color: 'red',
    fontWeight: 'bold'
  },

  closeButton: {
    color: 'white'
  },

  cameraFullScreen: {
    width: '100%',
    height: win.height
  },

  control: { width: '33%', justifyContent: 'center', alignItems: "center" },
  controlLabel: {
    color: '#989898', fontSize: 11
  }


});


