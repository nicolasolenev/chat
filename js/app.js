import UI from './view.js'
import API from './api.js'
import COOKIE from './cookie.js'
import renderPopup from './popup.js'
import { renderMessage, sendMessage, downloadMessages } from './message.js'

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

const KEY = {
  CODE: 'chat_code',
  MAIL: 'my_mail',
}

let socket;


startChat();

UI.MESSAGE.FORM.addEventListener('submit', function () {
  sendMessage(UI.MESSAGE.INPUT.value);
  this.reset();
});

UI.CHAT.SETTINGS_BTN.addEventListener('click', () => renderPopup(POPUP.SETTINGS));

UI.CHAT.EXIT_BTN.addEventListener('click', () => {
  if (socket) {
    socket.close(1000, "работа закончена");
    COOKIE.set(KEY.CODE, '');
    COOKIE.set(KEY.MAIL, '');
  }
  renderPopup(POPUP.AUTHORIZATION);
});



async function startChat() {
  if (await API.checkAccount()) {
    setSocket();
    downloadMessages();
  }
  else {
    renderPopup(POPUP.AUTHORIZATION);
  }
}

function setSocket() {
  socket = new WebSocket(`ws://chat1-341409.oa.r.appspot.com/websockets?${COOKIE.get(KEY.CODE)}`);

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    renderMessage(data.text, data.createdAt, data.user.name, data);
  };
}


export { POPUP, URL, KEY, socket, setSocket }