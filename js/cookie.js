export default {
  set(key, value) {
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  },

  get(key) {
    const cookie = Object.fromEntries(document.cookie.split('; ').map(item => item.split('=')));
    return decodeURIComponent(cookie[key]);
  },

  delete(key) {
    document.cookie = `${encodeURIComponent(key)}=''; max-age=-1`;
  }
}