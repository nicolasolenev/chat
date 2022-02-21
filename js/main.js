import UI from './view.js';
import COOKIE from './cookie.js';
import API from './api.js';

const URL = {
  DOMAIN: 'https://chat1-341409.oa.r.appspot.com',
  PATH: {
    USER: '/api/user',
    ME: '/api/user/me',
    MESSAGES: '/api/messages/',
  },
};

const POPUP = {
  SETTINGS: 'SETTINGS',
  AUTHORIZATION: 'AUTHORIZATION',
  VERIFICATION: 'VERIFICATION',
};



function scrollChatWindowToBottom() {
  UI.CHAT_WINDOW.scrollTop = UI.CHAT_WINDOW.scrollHeight;
}



function getTime(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
}



function getInputValue() {
  return document.querySelector('.popup__input').value;
}



function removePopup() {
  document.querySelector('.popup_wrapper').remove();
}



function downloadMessages() {

  API.sendRequest({
    url: URL.DOMAIN + URL.PATH.MESSAGES,
    method: API.method.GET,

    onSuccess: function (data) {
      data.messages.forEach(item => renderMessage(item.message, new Date(item.updatedAt), item.username))
    },

    onError: console.log
  })

}



function renderMessage(text, date, userName) {

  if (!text) return

  const message = UI.MESSAGE_TEMPLATE.content.cloneNode('deep');
  message.querySelector('.message').innerText = userName + ': ' + text;
  message.querySelector('.time').innerText = getTime(date);

  if (userName !== 'Я')
    message.querySelector('.chat__message').classList.add('any_message');

  UI.CHAT_WINDOW.append(message);
  scrollChatWindowToBottom();

}



function renderPopup(type) {

  const popup = UI.POPUP_TEMPLATE[type].content.cloneNode('deep');
  popup.querySelector('.popup__exit').addEventListener('click', () => removePopup());

  switch (type) {

    case POPUP.SETTINGS:
      popup.querySelector('.popup__main').classList.add('popup__settings');
      popup.querySelector('.chat__btn').addEventListener('click', settingsHendler);
      break;

    case POPUP.AUTHORIZATION:
      popup.querySelector('.chat__btn').addEventListener('click', authorizationHendler);
      break;

    case POPUP.VERIFICATION:
      popup.querySelector('.chat__btn').addEventListener('click', verificationHendler);
      break;

  }

  UI.CHAT.append(popup);

}



function authorizationHendler() {

  const userMail = getInputValue();

  if (!userMail) return

  API.sendRequest({
    url: URL.DOMAIN + URL.PATH.USER,
    method: API.method.POST,
    bodyObj: { email: userMail },

    onSuccess: console.log,

    onError: console.log
  });

  removePopup();
  renderPopup(POPUP.VERIFICATION);

}



function verificationHendler() {

  const code = getInputValue();

  if (!code) return

  API.sendRequest({
    url: URL.DOMAIN + URL.PATH.ME,
    method: API.method.GET,

    onSuccess: function () {
      COOKIE.saveInCookie(COOKIE.KEY_CODE, code);
      removePopup();
    },

    onError: console.log
  });

}



function settingsHendler() {

  const userName = getInputValue();

  if (!userName) return

  API.sendRequest({
    url: URL.DOMAIN + URL.PATH.USER,
    method: API.method.PATCH,
    bodyObj: { name: userName },

    onSuccess: console.log,

    onError: console.log
  });

  removePopup();

}



export { downloadMessages, renderMessage, renderPopup, POPUP }