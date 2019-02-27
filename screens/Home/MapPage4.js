import React, {Component} from 'react';
import { Constants } from 'expo';
import { View, TouchableOpacity, Image } from 'react-native';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const homePlace = {
  description: 'Home',
  geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
};
const workPlace = {
  description: 'Work',
  geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
};



export default class MapPage4 extends Component {

  _renderRow() {

  }

  _renderRightButton() {
    return (
      <TouchableOpacity style={[]} onPress={() => { this.existFullScreen() }}>
        <Image source={require('../../assets/images/btn-save-location.png')} style={{width: 60, height: 60}} resizeMode="contain"/>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={{ paddingTop: Constants.statusBarHeight, flex: 1 }}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          listViewDisplayed="auto" // true/false/undefined
          fetchDetails={true}
          renderRightButton = {this._renderRightButton}
          renderDescription={row => {
            console.log('row=', row);
            return row.description;
          }} // custom description render
          onPress={(data, details = null) => {
            console.log('DATA = ', data);
            console.log('Details = ', details);
          }}
          getDefaultValue={() => {
            return ''; // text input default value
          }}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: 'BAUAIzaSyC9k_UrdiBPL9-pWM8TNv-Q3IfNIZ8kzKQ',
            language: 'en', // language of the results
            types: 'address', // default: 'geocode'
          }}
          styles={{
            description: {
              fontWeight: 'bold',
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
            container: {
              borderWidth: 3,
              borderColor: 'blue'
            }, 
            textInputContainer: {
              backgroundColor: 'transparent',
              borderWidth: 0,
              paddingTop: 0,
              paddingBottom: 0,
              marginTop: 0,
              height: 80,
              borderBottomWidth: 0,
              borderTopWidth: 0
            },
            textInput: {
              backgroundColor: 'yellow',
              borderWidth: 2,
              borderRadius: 20,
              height: 60,
              marginTop: 0,
              marginBottom: 0
            },
            suppressDefaultStyles: {
              
            },
            listView: {
              borderTop: 0
            }
          }}
          currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
          currentLocationLabel="Current location"
          nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          // GoogleReverseGeocodingQuery={{
          //   // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          // }}
          // GooglePlacesSearchQuery={{
          //   // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          //   rankby: 'distance',
          //   types: [],
          // }}
          filterReverseGeocodingByTypes={[
            'locality',
            'administrative_area_level_3',
          ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          predefinedPlaces={[homePlace, workPlace]}
          debounce={200}
          
        />
      </View>
    );
  }
}
