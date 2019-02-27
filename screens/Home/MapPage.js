import React, { Component } from 'react';
import { View, Dimensions, StyleSheet, Alert, TouchableOpacity, Image, Text } from 'react-native';
import { Constants, MapView, Permissions, Location } from 'expo';
import { Entypo } from '@expo/vector-icons';
import { inject, observer } from 'mobx-react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-popup-dialog';

import MapViewDirections from './../MapViewDirections';
import FormInput from '../../components/FormInput';
import commonStyle, { win } from '../../Style';
const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = 'AIzaSyCYvMpmVhFc0ydILEuXGJNYNGFnBoKPCL8';

const homePlace = {
	alias: 'Home',
	description: '235 Peatch Street, GA, USA',
	geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
	saved: true
};
const workPlace = {
	alias: '1 Martin Place',
	description: '305 Peatch Street, GA, USA',
	geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
	saved: true
};


@inject("settingStore")
@inject("mediaStore")
@inject("locationStore")
@observer

export default class MapPage extends Component {

	constructor(props) {
		super(props);

		this.state = {
			alias: '',
			targetAddress: '',
			subscription: null,
			showSaveDialog: false, // Location save dialog
			// currentLocation: {
			// 	latitude: LATITUDE,
			// 	longitude: LONGITUDE,
			// },
			currentLocation: null,
			targetLocation: null
		};

		this.mapView = null;
	}

	componentDidMount() {
		
		Location.startLocationUpdatesAsync("MyLocation").then(() => {
			//this._startWatchingHeading();
			this._findSingleLocation();
			setTimeout(() => {
				this._startWatchingLocation();
			}, 10000)
		})
	}

	componentWillUnmount() {
		Location.stopLocationUpdatesAsync("MyLocation");
		// this._stopWatchingHeading();
		this._stopWatchingLocation();
	}

	onMapPress = async (e) => {
		const coodinate = e.nativeEvent.coordinate;
		console.log('coodinate', coodinate);
		Location.reverseGeocodeAsync(e.nativeEvent.coordinate).then((addressWithGeocode) => {
			let address = '';
			if(addressWithGeocode.length > 0) {
				const data = addressWithGeocode[0];
				if(data.postalCode != null && data.postalCode != '') {
					address += data.postalCode;
				}
		
				if(data.name != null && data.name != '') {
					address += ' ' + data.name;
				}
		
				if(data.street != null && data.street != '') {
					address += ' ' + data.street + ',';
				}
		
				if(data.city != null && data.city != '') {
					address += ' ' + data.city + ',';
				}
		
				if(data.region != null && data.region != '') {
					address += ' ' + data.region + ',';
				}
				if(data.country != null && data.country != '') {
					address += ' ' + data.country + ',';
				}
		
				console.log('address', address);
			}
			let targetLocation = {description: address, ...coodinate};
			this.autoComplete.setState({text: address});
		});
		this.setState({targetLocation: e.nativeEvent.coordinate});
	}

	onReady = (result) => {
		this.mapView.fitToCoordinates(result.coordinates, {
			edgePadding: {
				right: (width / 20),
				bottom: (height / 20),
				left: (width / 20),
				top: (height / 20),
			}
		});
	}

	onError = (errorMessage) => {
		Alert.alert(errorMessage);
	}


	_saveLocation() {

	}
	_renderRow() {

  }

  _renderRightButton() {
    return (
			<TouchableOpacity style={[]} 
				onPress={() => {
					this.setState({ showSaveDialog: true });
				}}>
       <Image source={require('../../assets/images/btn-save-location.png')} style={{width: 60, height: 60}} resizeMode="contain"/>
      </TouchableOpacity>
    );
	}
	
	_renderModalDialog() {
		return (
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
								this._saveLocation();
							}}
							key="button-2"
						/>
					</DialogFooter>
					}
				>
				<DialogContent style={commonStyle.dialogContent}>
					<Image source={require('../../assets/images/record-purple-icon.png')} resizeMode="contain" style={{width: 62}}/>
					<Text style={[commonStyle.text, commonStyle.textCenter]}>Do you wish to save the location?</Text>
					<FormInput hasIcon={true} placeholder="Location name" type="text" value={this.state.title} style={{marginTop: 20}} 
						inputStyle={{textAlign: "center"}} onChangeText={(text) => this.setState({title: text, error_message: null})}/>
				</DialogContent>
			</Dialog>
		)
	}

	_renderAutoComplete() {
		let textInputPaddingTop = 26;
		if(this.state.alias == '') {
			textInputPaddingTop = 0;
		}
		return (
			<GooglePlacesAutocomplete
					ref={(ref) => this.autoComplete = ref }
					placeholder="Search"
					enablePoweredByContainer={false}
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          listViewDisplayed="false" // true/false/undefined
          fetchDetails={true}
          renderRightButton = {this._renderRightButton.bind(this)}
          renderDescription={row => {
						if(row.isCurrentLocation) {
							return row.description;
						}
						if(row.isPredefinedPlace) {
							return row.alias
						}
            return row.description;
					}} // custom description render
					textInputProps={{
						onFocus: () => {this._stopWatchingHeading();}
					}}
          onPress={(data, details = null) => {
            if(details.saved) {
							this.autoComplete.setState({text: details.description});
							this.setState({alias: data.alias});
						} else {
							this.setState({alias: ''});
						}
						// currentLocation: {
						// 	latitude: 37.3317876,
						// 	longitude: -122.0054812,
						// },
						this.setState({targetLocation: {
							latitude: details.geometry.location.lat,
							longitude: details.geometry.location.lng,
							description: data.description
						}})
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
							fontWeight: 'normal',
							color: '#494949'
            },
            predefinedPlacesDescription: {
              color: '#494949',
            },
            container: {
              borderWidth: 0,
							borderColor: 'blue',
							width: win.width,
							// height: win.height - 200,
							position: 'absolute',
							top: 10,
							zIndex: 10000,
							paddingLeft: 10,
							paddingRight: 10,
            }, 
            textInputContainer: {
              backgroundColor: 'transparent',
              borderWidth: 0,
              paddingTop: 0,
              paddingBottom: 0,
              marginTop: 0,
              height: 70,
              borderBottomWidth: 0,
              borderTopWidth: 0
            },
            textInput: {
              backgroundColor: 'white',
							borderWidth: 2,
							borderColor: 'white',
              borderRadius: 40,
              height: 60,
              marginTop: 0,
							marginBottom: 0,
							paddingLeft: 42,
							fontSize: 14,
							fontWeight: 'normal',
							paddingTop: textInputPaddingTop,
							color: '#adacac'
						},
						listView: {
							backgroundColor: 'white', 
							borderRadius: 20,
							marginLeft: 10,
							marginRight: 10
						}
          }}
          currentLocation={false}
          currentLocationLabel="Current location"
          nearbyPlacesAPI="GooglePlacesSearch"
          filterReverseGeocodingByTypes={[
            'locality',
            'administrative_area_level_3',
          ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          predefinedPlaces={[homePlace, workPlace]}
          debounce={200}
          >
					<Entypo style={{ position: 'absolute', top: 16, left: 30}} name="location-pin" size={26} color="#d4d4d4" />
					<Text style={{ position: 'absolute', top: 8, left: 60}}>{this.state.alias}</Text>
				</GooglePlacesAutocomplete>
		)
	}

	_findSingleLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      return;
    }

    try {
      this.setState({ searching: true });
      let result = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
			});
			
			console.log('singleLocation', result);

			this.setState({ currentLocation: result.coords});

			this.mapView.animateToCoordinate(result.coords);
    } finally {
      this.setState({ searching: false });
    }
	};
	
	_startWatchingLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      return;
		}
		
    let subscription = await Location.watchPositionAsync(
      {
        enableHighAccuracy: true,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      location => {

        console.log(`Got location: ${JSON.stringify(location)}`);
        this.setState({ currentLocation: location.coords });
      }
		);
		
		console.log('subscription', subscription)

		this.setState({ subscription });
  };

  _stopWatchingLocation = async () => {
		if(this.state.subscription) {
			this.state.subscription.remove();
    	this.setState({ subscription: null, watchLocation: null });
		}
    
	};
	
	_startWatchingHeading = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      return;
    }

    let subscription = await Location.watchHeadingAsync(heading => {
			this.setState({ watchHeading: heading });
    });
    this.setState({ headingSubscription: subscription });
	};

	_stopWatchingHeading = async () => {
		if(this.state.headingSubscription) {
			this.state.headingSubscription.remove();
    	await this.setState({ headingSubscription: null, watchHeading: null });
		}
  };
	
	
	render() {
		
	  return (
		
		  <View style={[styles.container, {position: 'relative'}]}>
				{this._renderAutoComplete()}
				<MapView
					ref={(ref) => {this.mapView = ref}}
  				initialRegion={{
  					latitude: LATITUDE,
  					longitude: LONGITUDE,
  					latitudeDelta: LATITUDE_DELTA,
  					longitudeDelta: LONGITUDE_DELTA,
  				}}
  				style={[StyleSheet.absoluteFill, {zIndex: -1}]}
  				ref={c => this.mapView = c} // eslint-disable-line react/jsx-no-bind
  				onPress={this.onMapPress}
  				loadingEnabled={true}
  			>
					{
						(this.state.currentLocation != null)
						? <MapView.Marker key={`coordinate_current`}
							rotation={this.state.currentLocation.heading}
							image={require('../../assets/images/location_current_bk.png')} coordinate={this.state.currentLocation} 
							anchor={{x: 0.5, y: 0.5}} />
						: null
					}
					{
						this.state.targetLocation 
						? <MapView.Marker key={`coordinate_target`} 
							coordinate={this.state.targetLocation} 
							image={require('../../assets/images/location_target_bk.png')} 
							anchor={{x: 0.5, y: 0.9}} />
						: null
					}
  				{(this.state.currentLocation && this.state.targetLocation) && (
  					<MapViewDirections
  						origin={this.state.currentLocation}
  						destination={this.state.targetLocation}
  						apikey={GOOGLE_MAPS_APIKEY}
  						strokeWidth={8}
  						strokeColor="hotpink"
  						onReady={this.onReady}
  						onError={this.onError}
  					/>
  				)}
  			</MapView>
				{this._renderModalDialog()}
			</View>
		);
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
});