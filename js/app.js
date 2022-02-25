import UI from './view.js'
import API from './api.js'
import COOKIE from './cookie.js'
import renderPopup from './popup.js'
import { getTime, getDay, getMonth } from './time.js'
import { createMessageNode, sendMessage, createDateNode } from './message.js'

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
const me = {
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
  if (socket) {
    socket.close(1000, 'работа закончена');
    COOKIE.delete(COOKIE_KEY.TOKEN);
    COOKIE.delete(COOKIE_KEY.MAIL);
  }
  renderPopup(POPUP.AUTHORIZATION);
});

UI.CHAT.WINDOW.addEventListener('scroll', function () {
  if (this.scrollTop < 530) {
    history.splice(-20, 20).reverse().forEach(item => {
      if (item.text) {
        UI.CHAT.WINDOW.prepend((createMessageNode(item.text, getTime(item.updatedAt), item.user.name, item, UI.MESSAGE.TEMPLATE, COOKIE.get(COOKIE_KEY.MAIL))));
      } else {
        UI.CHAT.WINDOW.prepend(createDateNode(UI.DATE_TEMPLATE, item[1], item[0]));
      }
    });

    if (history.length === 0 && !UI.CHAT.WINDOW.contains(UI.CHAT.WINDOW.querySelector('.history_loaded'))) {
      UI.CHAT.WINDOW.prepend(document.getElementById('history_loaded_template').content.cloneNode('deep'));
    }
  }
});


async function startChat() {
  try {
    const response = await API.sendRequest(me, COOKIE.get(COOKIE_KEY.TOKEN));
    const isValidAccount = await response.ok;
    if (isValidAccount) {
      setSocket();
      history = await API.getHistory(URL.MESSAGES, COOKIE.get(COOKIE_KEY.TOKEN));
      history = history.messages;
      let day;
      let month;
      history.forEach((item, index) => {
        if (getDay(item.updatedAt) !== day) {
          day = getDay(item.updatedAt);
          month = getMonth(item.updatedAt);
          history.splice(index, 0, [day, month]);
        }
      });

      history.splice(-20, 20).forEach(item => {
        if (item.text) {
          UI.CHAT.WINDOW.append(createMessageNode(item.text, getTime(item.updatedAt), item.user.name, item, UI.MESSAGE.TEMPLATE, COOKIE.get(COOKIE_KEY.MAIL)));
        } else {
          UI.CHAT.WINDOW.prepend(createDateNode(UI.DATE_TEMPLATE, item[1], item[0]));
        }
      });
      scrollChatWindowToBottom();
    }
    else {
      renderPopup(POPUP.AUTHORIZATION);
    }
  } catch (e) {
    console.log(e);
    renderPopup(POPUP.AUTHORIZATION);
  }
}

function setSocket() {
  socket = new WebSocket(WS_URL + COOKIE.get(COOKIE_KEY.TOKEN));

  socket.addEventListener('message', function () {
    const data = JSON.parse(event.data);
    UI.CHAT.WINDOW.append(createMessageNode(data.text, getTime(data.createdAt), data.user.name, data, UI.MESSAGE.TEMPLATE, COOKIE.get(COOKIE_KEY.MAIL)));
    scrollChatWindowToBottom();
  })
}

function scrollChatWindowToBottom() {
  console.log('call scrollChatWindowToBottom');
  console.log(UI.CHAT.WINDOW.scrollTop, UI.CHAT.WINDOW.scrollHeight);
  if (UI.CHAT.WINDOW.scrollTop > UI.CHAT.WINDOW.scrollHeight - 600 || UI.CHAT.WINDOW.scrollTop === 0) {
    UI.CHAT.WINDOW.scrollTop = UI.CHAT.WINDOW.scrollHeight;
  }
}


export { POPUP, URL, COOKIE_KEY, socket, setSocket, me, startChat }