import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  View,
} from 'react-native';

export default class SettingsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        geoLocation: false,
        notificaiton: false,
    }
  }

  onChangeGeoLocation(value) {
    this.setState({geoLocation: value});
  }

  onChangeNotification(value) {
    this.setState({notificaiton: value});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.cardView}>
          <TouchableOpacity style={styles.rowView} onPress={() => this.props.onEditProfile()}>
            <Text style={styles.titleText}>Edit Profile</Text>
            {/* <Image 
              style={{width: 10, height: 19}}
              source={require('./../../assets/images/right_arrow_icon.png')}
            /> */}
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowView} onPress={() => this.props.onChangePassword()}>
            <Text style={styles.titleText}>Change Password</Text>
            {/* <Image 
              style={{width: 10, height: 19}}
              source={require('./../../assets/images/right_arrow_icon.png')}
            /> */}
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowView}>
            <Text style={styles.titleText}>Geo Location</Text>
            <Switch
             onValueChange = {(value) => this.onChangeGeoLocation(value)}
             value = {this.state.geoLocation}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowView}>
            <Text style={styles.titleText}>Notification</Text>
            <Switch
             onValueChange = {(value) => this.onChangeNotification(value)}
             value = {this.state.notificaiton}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowView} onPress={() => this.props.onLogout()}>
            <Text style={styles.redTitleText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  cardView: {
    margin: 10,
    borderRadius: 5,
    borderColor: '#e1e1e1',
    borderWidth: 1,
    shadowColor: '#888',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
    backgroundColor: 'white',    
  },

  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 55,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },

  titleText: {
    fontFamily: 'opensans-regular',
    fontSize: 16,
    color: 'black',
  },

  redTitleText: {
    fontFamily: 'opensans-regular',
    fontSize: 16,
    color: '#e12246',
  },

});
