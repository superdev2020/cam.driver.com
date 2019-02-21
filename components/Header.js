/**
 * Header Navigation
 */
import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
	View,
	StyleSheet
} from 'react-native';
import { observer, inject } from 'mobx-react';
import { commonStyle } from '../Style';

@inject("settingStore")
@observer

export default class Header extends React.Component {

	constructor(props) {
    super(props);
	}

	/**
	 * Back Button Handler
	 */
	onBack() {

	}

	render() {
		const fullScreen = this.props.settingStore.fullScreen ? commonStyle.hidden : null;
		return (
			<View style={[styles.headerView, fullScreen]}>
				<Text style={styles.heading}>{this.props.title}</Text>
				{ 
					this.props.onBack
					? <TouchableOpacity style={styles.backButton} onPress={() => this.onBack()}>
							<Image
								style={styles.backButtonIcon}
								source={require('../assets/images/left_arrow_icon.png')}
							/>
						</TouchableOpacity>
					:
						null
				}
			</View>
		);
	}
}


const styles = StyleSheet.create({
  
  headerView: {
    backgroundColor: '#fff',
    width: '100%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
    alignItems: 'center',
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,    
		zIndex: 2
	},
	
	heading: {
		fontSize: 22,
		fontWeight: 'bold',
		color: '#272727',
		fontFamily: 'opensans-semibold'
	},

	backButton: {
  	position: 'absolute',
  	left: 20,
  	top: 40,
	},
	
	backButtonIcon: {
  	width: 18,
  	height: 20,
  },

  headerIcon: {
    width: 54,
    height: 50,
  },
});

