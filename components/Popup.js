import React from 'react';
import { StyleSheet, View } from 'react-native';
import { commonStyle } from '../Style';

export default class Popup extends React.Component {
  render() {
    return (
	    <View style={styles.popup_wrapper}>
	    	<View style={styles.popup_background}></View>
				<View style={styles.popup_content}>
						{this.props.children}
				</View>
	    </View>
    );
  }
}

const styles = StyleSheet.create({
	popup_wrapper: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 80,
		paddingRight: 80,
	},

	popup_background: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		backgroundColor: '#888',
		zIndex: -1,
		opacity: 0.4
	},

	popup_background: {
		borderRadius: 24,
		backgroundColor: 'white'
	}
});