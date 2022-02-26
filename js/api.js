export default {

  sendRequest(options, token) {
    const fetchBody = {
      method: options.method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    }

    if (options.method !== 'POST') {
      fetchBody.headers.Authorization = `Bearer ${token}`;
    }

    if (options.body) {
      fetchBody.body = JSON.stringify(options.body);
    }

    return fetch(options.url, fetchBody);
  },
}