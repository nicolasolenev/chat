export default {
  KEY_CODE: 'chat_code',
  saveInCookie(key, value) {
    document.cookie = `${key}=${value}`;
  },
  getFromCookie(key) {
    const cookieObj = Object.fromEntries(document.cookie.split('; ').map(item => item.split('=')));
    return cookieObj[key];
  }
};