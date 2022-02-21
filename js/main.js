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

  scrollChatWindowToBottom() {
    UI.CHAT_WINDOW.scrollTop = UI.CHAT_WINDOW.scrollHeight;
  },

  getTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
  },

  getInputValue() {
    return document.querySelector('.popup__input').value;
  },

  renderMessage(text) {
    if (!text) return
    const message = UI.MESSAGE_TEMPLATE.content.cloneNode('deep');
    message.querySelector('.message').innerText = 'Я: ' + text;
    message.querySelector('.time').innerText = getTime();
    UI.CHAT_WINDOW.append(message);
    scrollChatWindowToBottom();
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
    document.querySelector('.popup_wrapper').remove();
    this.renderPopup(this.VERIFICATION);
  },

  verificationHendler() {
    const code = this.getInputValue();
    if (!code) return
    COOKIE.saveInCookie(COOKIE.KEY_CODE, code);
    document.querySelector('.popup_wrapper').remove();
  },

  settingsHendler() {
    const userName = this.getInputValue();
    if (!userName) return
    API.sendRequest({ url: this.URL + this.REQUEST_PATH, method: API.method.PATCH, bodyObj: { name: userName }, onSuccess: console.log, onError: console.log });
    document.querySelector('.popup_wrapper').remove();
  },

}

for (let key in MAIN) {
  if (typeof MAIN[key] == 'function') {
    MAIN[key] = MAIN[key].bind(MAIN);
  }
}


// const URL = 'https://chat1-341409.oa.r.appspot.com';
// const [SETTINGS, AUTHORIZATION, VERIFICATION] = ['SETTINGS', 'AUTHORIZATION', 'VERIFICATION'];

// function scrollChatWindowToBottom() {
//   UI.CHAT_WINDOW.scrollTop = UI.CHAT_WINDOW.scrollHeight;
// }

// function getTime() {
//   const now = new Date();
//   const hours = now.getHours();
//   const minutes = now.getMinutes();
//   return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
// }

// function renderMessage(text) {
//   if (!text) return
//   const message = UI.MESSAGE_TEMPLATE.content.cloneNode('deep');
//   message.querySelector('.message').innerText = 'Я: ' + text;
//   message.querySelector('.time').innerText = getTime();
//   UI.CHAT_WINDOW.append(message);
//   scrollChatWindowToBottom();
// }

// function renderPopup(type) {
//   const popup = UI.POPUP_TEMPLATE[type].content.cloneNode('deep');
//   popup.querySelector('.popup__exit').addEventListener('click', function () {
//     this.closest('.popup_wrapper').remove();
//   });

//   switch (type) {
//     case SETTINGS:
//       popup.querySelector('.popup__main').classList.add('popup__settings');
//       popup.querySelector('.chat__btn').addEventListener('click', settingsHendler);
//       break;
//     case AUTHORIZATION:
//       popup.querySelector('.chat__btn').addEventListener('click', authorizationHendler);
//       break;
//     case VERIFICATION:
//       popup.querySelector('.chat__btn').addEventListener('click', verificationHendler);
//       break;
//   }

//   UI.CHAT.append(popup);
// }


// function authorizationHendler() {
//   const userMail = this.previousElementSibling.value;
//   if (!userMail) return
//   API.sendRequest({ url: URL + '/api/user', method: API.method.POST, bodyObj: { email: userMail }, onSuccess: console.log, onError: console.log });
//   document.querySelector('.popup_wrapper').remove();
//   renderPopup(VERIFICATION);
// }

// function verificationHendler() {
//   const code = this.previousElementSibling.value;
//   if (!code) return
//   COOKIE.saveInCookie(COOKIE.KEY_CODE, code);
//   document.querySelector('.popup_wrapper').remove();
// }

// function settingsHendler() {
//   const userName = this.previousElementSibling.value;
//   if (!userName) return
//   const token = COOKIE.getFromCookie(COOKIE.KEY_CODE);
//   API.sendRequest({ url: URL + '/api/user', method: API.method.PATCH, bodyObj: { name: userName }, onSuccess: console.log, onError: console.log });
//   document.querySelector('.popup_wrapper').remove();
// }


// sendRequest({ url: URL + '/api/user/me', method: method.GET, onSuccess: console.log, onError: console.log });

// export { SETTINGS, AUTHORIZATION, renderMessage, renderPopup, scrollChatWindowToBottom }