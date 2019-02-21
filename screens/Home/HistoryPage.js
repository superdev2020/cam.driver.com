import React from 'react';
import {
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native';


import { Video } from 'expo';
import { win, commonStyle } from '../../Style';
import { reaction } from "mobx";
import { observer, inject } from 'mobx-react';
import { BASE_URL}  from '../../constants/API';


@inject('mediaStore')
@inject('userStore')
@observer
export default class HistoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    this.disposes = [
      reaction(
        () => this.props.mediaStore.getMediaListState,
        (getMediaListState) => {
          if (getMediaListState.isSuccessful()) {
            this.setState({data: this.props.mediaStore.lists});
          }
        }
      )
    ];
    this.props.mediaStore.loadMediaList(this.props.userStore.currentUser.user_id);
  }

  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
  }

  getMediaUrl(path) {
    return `${BASE_URL}/${path}`;
  }

  render() {
    return (
      <View style={commonStyle.container}>
        {/* <VideoPreview
                  source={{ uri: 'https://www.w3schools.com/html/mov_bbb.mp4' }} // Can be a URL or a local file.
                  style={styles.video_thumb}
                  resizeMode="contain" /> */}

        <FlatList
          style={{ paddingTop: 20, marginBottom: 60 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          data={this.state.data}
          extraData={this.state}
          keyExtractor={item => item.media_id}
          renderItem={({ item, index }) =>
            <View style={styles.video_item}>
              {
                console.log('url', this.getMediaUrl(item.media_thumbnail))
              }
              <TouchableOpacity onPress={() => { this.props.navigation.push('Video', { video: item }) }}>
                <Image style={styles.video_thumb} source={{ uri: this.getMediaUrl(item.media_thumbnail) }} />
                {/* <Video source={{ uri: this.getMediaUrl(item.media_path) }}  style={[styles.video_thumb]}
                  rate={1.0}
                  volume={1.0}
                  shouldPlay={false}
                  resizeMode={Video.RESIZE_MODE_CONTAIN}
                  useNativeControls={false}
                /> */}
              </TouchableOpacity>
              <View>
                <Text style={[styles.text, styles.bold, styles.video_title]}>{item.title}</Text>
                <Text style={styles.video_time} numberOfLines={2} ellipsizeMode='tail'>{item.created_at}</Text>
              </View>
            </View>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ///////////////// History /////////////////
  video_item: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },

  video_thumb: {
    width: 100,
    height: 80,
    margin: 10,
    borderRadius: 5
  },
  activityNameText: {
    color: 'black',
    fontFamily: 'opensans-regular',
    fontSize: 16,
    textTransform: 'uppercase',
  },

  ndaText: {
    marginTop: 5,
    color: 'black',
    fontFamily: 'opensans-regular',
    fontSize: 13,
  },

  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },

  overlay: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: 'grey'
  },
  middle: {
    position: 'absolute',
    left: win.width / 2 - 50,
    top: '50%'
  },
});