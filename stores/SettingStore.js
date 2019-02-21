/**
 * User's settings and global state variables
 */

import {observable} from 'mobx';

 export default class SettingStore {

	/**
	 * ApiContext instance
	 */
	apiContext = null;

	constructor(apiContext) {
		this.apiContext = apiContext;
	}

	/**
	 * User's setting full screen enabled
	 */
	@observable fullScreenEnabled = false;



	/**
	 * Current Recording page's full screen state
	 */
	@observable fullScreen = false;


	@observable homeScreenPage = 'record';


	@observable currentRecordingScreen = 'video';



 }
