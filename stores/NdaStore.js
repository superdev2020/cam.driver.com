import { observable, action } from 'mobx';
import { AsyncState } from '../models';
import { AsyncStorage } from 'react-native';

export default class NdaStore {
    @observable restoreNDAListState = new AsyncState();
    @observable restoreHistoryState = new AsyncState();
    @observable postNDAState = new AsyncState();
    @observable getNDAListState = new AsyncState();
	@observable getHistoryState = new AsyncState();

    constructor(ctx) {
        this.ctx = ctx;
        this.lists = [];
        this.historyList = [];
    }

    @action
    async restoreNDAList() {
        const lists = await AsyncStorage.getItem('__ndaLists__');
        if (lists) {
            const interlists = JSON.parse(lists);
            this.lists = lists; 
        } 
        this.restoreNDAListState = new AsyncState('SUCCESS', {...this.lists });
    }

    @action
    async restoreHistoryList() {
        const history = await AsyncStorage.getItem('__ndaHistory__');
        if (history) {
            const interHistory = JSON.parse(history);
            this.historyList = interHistory; 
        } 
        this.restoreHistoryState = new AsyncState('SUCCESS', {...this.historyList });
    }

    @action
    async postNDA(user_id, activity_name, nda, phone_number, signature) {
        this.postNDAState = new AsyncState('IN_PROGRESS');
        try {
            const response = await this.ctx.callApi('ndas/post.php', {
                method: 'POST',
                body: {
                    user_id: user_id,
                    activity_name: activity_name,
                    nda: nda,
                    phone_number: phone_number,
                    signature: signature,
                }
            });

            const data = await response.json();
            console.log("post NDA result = ", data);

            if (data.status) {
                const nda = data.nda;
                this.lists.push(nda);
                await AsyncStorage.setItem('__ndaLists__', JSON.stringify(this.lists));

                this.postNDAState = new AsyncState('SUCCESS', {...nda});    
            }
            else {
                this.postNDAState = new AsyncState('API_ERROR', null, data.message);    
            }
        } catch (error) {
            console.log("error = ", error);
            this.postNDAState = new AsyncState('NETWORK_PROBLEMS');
        }
    }

    @action 
    async loadNDAList(user_id) {
        this.getNDAListState = new AsyncState('IN_PROGRESS');
        try {
            const response = await this.ctx.callApi('ndas/get_list_by_user.php', {
                method: 'POST',
                body: {             
                    user_id: user_id,
                }
            });

            const data = await response.json();
            if (data.status) {
                const list = data.list;
                console.log("list = ", list);
                this.lists = list;
                await AsyncStorage.setItem('__ndaLists__', JSON.stringify(this.lists));
                this.getNDAListState = new AsyncState('SUCCESS', {...list});    
            }
            else {
                this.getNDAListState = new AsyncState('API_ERROR', null, data.message);    
            }
        } catch (error) {
            console.log("error = ", error);
            this.getNDAListState = new AsyncState('NETWORK_PROBLEMS');
        }
    }


    @action 
    async loadNDAHistory(user_id) {
        this.getHistoryState = new AsyncState('IN_PROGRESS');
        try {
            const response = await this.ctx.callApi('ndas/get_history_by_user.php', {
                method: 'POST',
                body: {             
                    user_id: user_id,
                }
            });

            const data = await response.json();
            if (data.status) {
                const list = data.list;
                this.historyList = list;
                await AsyncStorage.setItem('__ndaHistory__', JSON.stringify(this.historyList));
                this.getHistoryState = new AsyncState('SUCCESS', {...list});    
            }
            else {
                this.getHistoryState = new AsyncState('API_ERROR', null, data.message);    
            }
        } catch (error) {
            console.log("error = ", error);
            this.getHistoryState = new AsyncState('NETWORK_PROBLEMS');
        }
    }
}