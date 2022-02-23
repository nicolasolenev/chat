import COOKIE from './cookie.js'
import { URL, KEY } from './app.js'

export default {

  METHOD: {
    GET: 'GET',
    POST: 'POST',
    PATCH: 'PATCH',
  },

  sendRequest(options) {
    const fetchBody = {
      method: options.method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    }

    if (options.method !== this.METHOD.POST)
      fetchBody.headers.Authorization = `Bearer ${COOKIE.get(KEY.CODE)}`;

    if (options.bodyObj) fetchBody.body = JSON.stringify(options.bodyObj);

    return fetch(options.url, fetchBody)
  },

  async checkAccount() {
    const response = await this.sendRequest({
      url: URL.ME,
      method: this.METHOD.GET,
    });
    return response.ok;
  },
}