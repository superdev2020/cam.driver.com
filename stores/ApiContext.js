
/**
 * Api context
 * We will check session in this module
 */


import {BASE_URL} from '../constants/API';

export default class ApiContext {

	async callApi(endpoint, args) {
		let url = args && args.fullPath ? endpoint : (BASE_URL + endpoint);
    const method = args && args.method || 'GET';
    const headers = {};
    let body = null;

    if (args && args.params) {
      Object.keys(args.params).forEach((key, index) => {
        url += (index === 0 ? '?' : '&') + key + '=' + encodeURIComponent(args.params[key]);
      });
    }

    console.log('args=', args);
    if (args && args.body && args.type === 'multipart') {
      headers['Content-Type'] = 'multipart/form-data';
      body = args.body;
    } else {
      headers['Accept'] = 'application/json';
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(args.body);
    }
    if (args && args.auth) {
      headers['Authorization'] = this.authHeader;
    }

    console.log(method + ' ' + url);
    console.log("body = ", body);

    const response = await fetch(url, {
      method,
      headers,
      body,
      credentials: 'omit',
    });

    // if (args && args.auth && response.status === 401) {
    //   console.log('token expired. logging out')
    //   // if (this.stores)
    //   //   await this.stores.authStore.logout(false);
    //   return response;
    // }
    return response;
	} 
}