import { observable, action } from 'mobx';
import { AsyncState } from '../models';
import { AsyncStorage } from 'react-native';

export default class MediaStore {
	@observable restoreMediaListState = new AsyncState();
	@observable postMediaState = new AsyncState();
	@observable getMediaListState = new AsyncState();

	constructor(ctx) {
		this.ctx = ctx;
		this.lists = [];
	}

	@action
	async restoreMediaList() {
		const lists = await AsyncStorage.getItem('__mediaLists__');
		if (lists) {
			const interlists = JSON.parse(lists);
			this.lists = lists;
		}
		this.restoreMediaListState = new AsyncState('SUCCESS', { ...this.lists });
	}

	@action
	async postMedia(user_id, title, file, type) {
		this.postMediaState = new AsyncState('IN_PROGRESS');
		try {
			const formData = new FormData();

			formData.append('user_id', user_id);
			formData.append('title', title);
			formData.append('media_type', type);
			formData.append("file", {
				name: file.name,
				type: file.type,
				uri: file.uri
			});
			

			const response = await this.ctx.callApi('medias/post.php', {
				method: 'POST',
				type: 'multipart',
				body: formData
			});


			console.log('response = ', response);
			const data = await response.json();
			console.log("post Media result = ", data);

			if (data.status) {
				const media = data.media;
				this.lists.push(media);
				await AsyncStorage.setItem('__mediaLists__', JSON.stringify(this.lists));

				this.postMediaState = new AsyncState('SUCCESS', { ...media });
			}
			else {
				this.postMediaState = new AsyncState('API_ERROR', null, data.message);
			}
		} catch (error) {
			console.log("error33333 = ", error);
			this.postMediaState = new AsyncState('NETWORK_PROBLEMS');
		}
	}

	@action
	async loadMediaList(user_id) {
		this.getMediaListState = new AsyncState('IN_PROGRESS');
		try {
			const response = await this.ctx.callApi('medias/get_list_by_user.php', {
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
				await AsyncStorage.setItem('__mediaLists__', JSON.stringify(this.lists));
				this.getMediaListState = new AsyncState('SUCCESS', { ...list });
			}
			else {
				this.getMediaListState = new AsyncState('API_ERROR', null, data.message);
			}
		} catch (error) {
			console.log("error = ", error);
			this.getMediaListState = new AsyncState('NETWORK_PROBLEMS');
		}
	}

}