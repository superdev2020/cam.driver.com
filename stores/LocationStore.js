import { observable, action } from 'mobx';
import { AsyncState } from '../models';
import { AsyncStorage } from 'react-native';

export default class LocationStore {
	@observable restoreLocationListState = new AsyncState();
	@observable postLocationState = new AsyncState();
	@observable getLocationListState = new AsyncState();

	constructor(ctx) {
		this.ctx = ctx;
		this.lists = [];
	}

	@action
	async restoreLocationList() {
		const lists = await AsyncStorage.getItem('__locationLists__');
		if (lists) {
			const interlists = JSON.parse(lists);
			this.lists = lists;
		}
		this.restoreLocationListState = new AsyncState('SUCCESS', { ...this.lists });
	}

	@action
	async postLocation(user_id, geolocation) {
		this.postLocationState = new AsyncState('IN_PROGRESS');
		try {
			const response = await this.ctx.callApi('locations/post.php', {
				method: 'POST',
				type: 'multipart',
				body: {
					user_id,
					geolocation
				}
			});


			console.log('response = ', response);
			const data = await response.json();
			console.log("post Location result = ", data);

			if (data.status) {
				const location = data.geolocation;
				this.lists.push(location);
				await AsyncStorage.setItem('__locationLists__', JSON.stringify(this.lists));

				this.postLocationState = new AsyncState('SUCCESS', { ...location });
			}
			else {
				this.postLocationState = new AsyncState('API_ERROR', null, data.message);
			}
		} catch (error) {
			console.log("error33333 = ", error);
			this.postLocationState = new AsyncState('NETWORK_PROBLEMS');
		}
	}

	@action
	async loadLocationList(user_id) {
		this.getLocationListState = new AsyncState('IN_PROGRESS');
		try {
			const response = await this.ctx.callApi('locations/get_list_by_user.php', {
				method: 'POST',
				body: {
					user_id: user_id,
				}
			});

			console.log('response = ', response);
			const data = await response.json();
			if (data.status) {
				const list = data.list;
				console.log("list = ", list);
				this.lists = list;
				await AsyncStorage.setItem('__locationLists__', JSON.stringify(this.lists));
				this.getLocationListState = new AsyncState('SUCCESS', { ...list });
			}
			else {
				this.getLocationListState = new AsyncState('API_ERROR', null, data.message);
			}
		} catch (error) {
			console.log("error = ", error);
			this.getLocationListState = new AsyncState('NETWORK_PROBLEMS');
		}
	}

}