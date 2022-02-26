import UI from './view.js'
import API from './api.js'
import COOKIE from './cookie.js'
import renderPopup from './popup.js'
import { getTime } from './time.js'
import { getHistory, renderHistory } from './history.js'
import { createMessageNode, sendMessage } from './message.js'

const WS_URL = 'ws://chat1-341409.oa.r.appspot.com/websockets?';
const DOMAIN = 'https://chat1-341409.oa.r.appspot.com/api/';
const URL = {
  USER: DOMAIN + 'user',
  ME: DOMAIN + 'user/me',
  MESSAGES: DOMAIN + 'messages/',
};
const POPUP = {
  SETTINGS: 'SETTINGS',
  AUTHORIZATION: 'AUTHORIZATION',
  VERIFICATION: 'VERIFICATION',
};
const COOKIE_KEY = {
  TOKEN: 'token',
  MAIL: 'my_mail',
};
const me_request = {
  url: URL.ME,
  method: 'GET',
};
let history;
let socket;


startChat();

UI.MESSAGE.FORM.addEventListener('submit', function () {
  sendMessage(UI.MESSAGE.INPUT.value, socket);
  this.reset();
});

UI.CHAT.SETTINGS_BTN.addEventListener('click', () => renderPopup(POPUP.SETTINGS));

UI.CHAT.EXIT_BTN.addEventListener('click', function () {
  socket.close(1000, 'работа закончена');
  COOKIE.delete(COOKIE_KEY.TOKEN);
  COOKIE.delete(COOKIE_KEY.MAIL);
  renderPopup(POPUP.AUTHORIZATION);
});

UI.CHAT.WINDOW.addEventListener('scroll', function () {
  if (this.scrollTop < 530) {
    const previousScroll = UI.CHAT.WINDOW.scrollHeight - this.scrollTop;
    renderHistory(history.splice(-20, 20).reverse(), 'prepend');
    this.scrollTop = UI.CHAT.WINDOW.scrollHeight - previousScroll;
  }
});


async function startChat() {
  const response = await API.sendRequest(me_request, COOKIE.get(COOKIE_KEY.TOKEN));

  if (response.ok) {
    setSocket();

    history = await getHistory(URL.MESSAGES);
    history = history.messages;

    renderHistory(history.splice(-20, 20), 'append');
    scrollChatWindowToBottom();
  } else {
    renderPopup(POPUP.AUTHORIZATION);
  }
}


function setSocket() {
  socket = new WebSocket(WS_URL + COOKIE.get(COOKIE_KEY.TOKEN));

  socket.addEventListener('message', function () {
    const data = JSON.parse(event.data);

    UI.CHAT.WINDOW.append(createMessageNode(data.text, getTime(data.createdAt), data.user.name, data.user.email, UI.MESSAGE.TEMPLATE, COOKIE.get(COOKIE_KEY.MAIL)));
    if (UI.CHAT.WINDOW.scrollTop > UI.CHAT.WINDOW.scrollHeight - 800) {
      scrollChatWindowToBottom();
    }
  })
}


function scrollChatWindowToBottom() {
  UI.CHAT.WINDOW.scrollTop = UI.CHAT.WINDOW.scrollHeight;
}


export { POPUP, URL, COOKIE_KEY, socket, setSocket, me_request, startChat }