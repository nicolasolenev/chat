import UI from './view.js';
import COOKIE from './cookie.js';
import API from './api.js';

export const MAIN = {

  URL: 'https://chat1-341409.oa.r.appspot.com',
  SETTINGS: 'SETTINGS',
  AUTHORIZATION: 'AUTHORIZATION',
  VERIFICATION: 'VERIFICATION',
  REQUEST_PATH: '/api/user',
  REQUEST_PATH_ME: '/api/user/me',
  REQUEST_MESSAGE: '/api/messages/',

  scrollChatWindowToBottom() {
    UI.CHAT_WINDOW.scrollTop = UI.CHAT_WINDOW.scrollHeight;
  },

  getTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
  },

  getInputValue() {
    return document.querySelector('.popup__input').value;
  },

  removePopup() {
    document.querySelector('.popup_wrapper').remove();
  },

  downloadMessages() {
    API.sendRequest({
      url: MAIN.URL + MAIN.REQUEST_MESSAGE, method: API.method.GET, onSuccess: function (data) {
        data.messages.forEach(item => {
          const [userName, message, time] = [item.username, item.message, item.updatedAt];
          MAIN.renderMessage(message, new Date(time), userName);
        })
      }, onError: console.log
    })
  },

  renderMessage(text, date, userName) {
    if (!text) return
    const message = UI.MESSAGE_TEMPLATE.content.cloneNode('deep');
    message.querySelector('.message').innerText = userName + ': ' + text;
    message.querySelector('.time').innerText = this.getTime(date);
    console.log(message);
    if (userName !== 'Я') message.querySelector('.chat__message').classList.add('any_message');
    UI.CHAT_WINDOW.append(message);
    this.scrollChatWindowToBottom();
  },

  renderPopup(type) {
    const popup = UI.POPUP_TEMPLATE[type].content.cloneNode('deep');
    popup.querySelector('.popup__exit').addEventListener('click', function () {
      this.closest('.popup_wrapper').remove();
    });

    switch (type) {
      case this.SETTINGS:
        popup.querySelector('.popup__main').classList.add('popup__settings');
        popup.querySelector('.chat__btn').addEventListener('click', this.settingsHendler);
        break;
      case this.AUTHORIZATION:
        popup.querySelector('.chat__btn').addEventListener('click', this.authorizationHendler);
        break;
      case this.VERIFICATION:
        popup.querySelector('.chat__btn').addEventListener('click', this.verificationHendler);
        break;
    }

    UI.CHAT.append(popup);
  },

  authorizationHendler() {
    const userMail = this.getInputValue();
    if (!userMail) return
    API.sendRequest({
      url: this.URL + this.REQUEST_PATH, method: API.method.POST, bodyObj: { email: userMail }, onSuccess: console.log, onError: console.log
    });
    this.removePopup();
    this.renderPopup(this.VERIFICATION);
  },

  verificationHendler() {
    const code = this.getInputValue();
    if (!code) return

    API.sendRequest({
      url: MAIN.URL + MAIN.REQUEST_PATH_ME, method: API.method.GET, onSuccess: () => {
        COOKIE.saveInCookie(COOKIE.KEY_CODE, code);
        this.removePopup();
      }, onError: console.log
    })

  },

  settingsHendler() {
    const userName = this.getInputValue();
    if (!userName) return
    API.sendRequest({ url: this.URL + this.REQUEST_PATH, method: API.method.PATCH, bodyObj: { name: userName }, onSuccess: console.log, onError: console.log });
    this.removePopup();
  },

}

for (let key in MAIN) {
  if (typeof MAIN[key] == 'function') {
    MAIN[key] = MAIN[key].bind(MAIN);
  }
}