import {
  StyleSheet,
  Dimensions,
} from 'react-native';

export const win = Dimensions.get('window');
export const commonStyle = StyleSheet.create({
  /////////////////// Common Style /////////////////////
	container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  text: {
    fontFamily: 'opensans-semibold',
    fontSize: 16
  },

  textCenter: {
    textAlign: 'center'
  },

  bold: {
    fontWeight: 'bold'
  },

  hidden: {
    display: 'none',
    position: 'relative'
  },

  dialogContent: {
    backgroundColor: 'white',
    padding: 30,
    paddingTop: 10,
    justifyContent: 'center', alignItems: 'center'
  }
});

export default commonStyle;
  