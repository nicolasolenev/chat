import COOKIE from './cookie.js';

export default {

  method: { GET: 'GET', POST: 'POST', PATCH: 'PATCH', },

  sendRequest(options) {
    const fetchBody = {
      method: options.method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    }
    if (options.method !== this.method.POST) fetchBody.headers.Authorization = `Bearer ${COOKIE.getFromCookie(COOKIE.KEY_CODE)}`;
    if (options.bodyObj) fetchBody.body = JSON.stringify(options.bodyObj);
    fetch(options.url, fetchBody)
      .then(response => response.json())
      .then(options.onSuccess)
      .catch(options.onError)
  },

}