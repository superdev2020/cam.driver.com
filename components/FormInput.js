import React, { Component } from 'react';
import PropTypes from "prop-types"
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, Dimensions } from 'react-native';

const win = Dimensions.get('window');

class FormInput extends Component {
	static propTypes = {
		value: PropTypes.string,
		placeholder: PropTypes.string,
		type: PropTypes.string.isRequired,
		hasIcon: PropTypes.bool,
		floatSize: PropTypes.bool,
		error: PropTypes.bool,
		inputStyle: PropTypes.object
	}
	static defaultProps = {
		error: false,
	}

	constructor(props) {
		super(props)

		this.state = {
			showPassword: false,
		}
	}

	onShowPassword() {
		this.setState({ showPassword: !this.state.showPassword });
	}

	render() {
		return (
			<View style={[{ width: this.props.floatSize ? 'auto' : (this.props.hasIcon ? (win.width - 85) : (win.width - 45)) }, this.props.style, styles.container, this.props.error ? styles.containerError : null]}>
				{
					(this.props.type === "text")
						? <TextInput
							style={[styles.textInput, this.props.inputStyle]}
							underlineColorAndroid='transparent'
							onChangeText={this.props.onChangeText}
							value={this.props.value}
							placeholder={this.props.placeholder}
						/>
						: null
				}

				{
					(this.props.type === "email")
						? <TextInput
							autoCapitalize='none'
							autoCorrect={false}
							style={[styles.textInput, this.props.inputStyle]}
							underlineColorAndroid='transparent'
							onChangeText={this.props.onChangeText}
							value={this.props.value}
							placeholder={this.props.placeholder}
						/>
						: null
				}

				{
					(this.props.type === "password")
						? <View style={styles.formField}>
							<TextInput
								secureTextEntry={!this.state.showPassword}
								autoCapitalize='none'
								autoCorrect={false}
								style={[styles.textInput, { width: this.props.hasIcon ? (win.width - 107) : (win.width - 67) }]}
								underlineColorAndroid='transparent'
								onChangeText={this.props.onChangeText}
								value={this.props.value}
								placeholder={this.props.placeholder}
							/>
							<TouchableOpacity onPress={() => this.onShowPassword()}>
								<Image style={styles.eye_icon} source={require('./../assets/images/eye_icon.png')} />
							</TouchableOpacity>
						</View>
						: null
				}
			</View>
		);
	}
}

export default FormInput;

const styles = StyleSheet.create({
	container: {
		borderBottomWidth: 1,
		borderBottomColor: '#e5e5e5',
		height: 38,
	},
	containerError: {
		borderBottomColor: '#ed0a3f',
	},

	textInput: {
		color: '#474747',
		paddingTop: 5,
		paddingBottom: 5,
		fontSize: 16,
		fontFamily: 'opensans-regular',
		height: '100%',
	},

	formField: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},

	eye_icon: {
		width: 22,
		height: 14,
	},
});