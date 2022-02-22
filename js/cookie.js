export default {
  KEY_CODE: 'chat_code',

  set(key, value) {
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  },

  get(key) {
    const cookieObj = Object.fromEntries(document.cookie.split('; ').map(item => item.split('=')));
    return decodeURIComponent(cookieObj[key]);
  }
};