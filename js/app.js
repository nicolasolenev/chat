import UI from './view.js'
import API from './api.js'
import COOKIE from './cookie.js'
import renderPopup from './popup.js'
import { getTime, getDay, getMonth } from './time.js'
import { renderMessage, sendMessage, downloadMessages } from './message.js'

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
}

const me = {
  url: URL.ME,
  method: 'GET',
};

let history;

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
    COOKIE.delete(COOKIE_KEY.TOKEN);
    COOKIE.delete(COOKIE_KEY.MAIL);
  }
  renderPopup(POPUP.AUTHORIZATION);
});


async function startChat() {
  try {
    const response = await API.sendRequest(me, COOKIE.get(COOKIE_KEY.TOKEN));
    const isValidAccount = await response.ok;
    if (isValidAccount) {
      setSocket();
      history = await downloadMessages();
      history = history.messages;
      let day;
      let month;
      history.forEach((item, index) => {
        if (getDay(item.updatedAt) !== day) {
          day = getDay(item.updatedAt);
          month = getMonth(item.updatedAt);
          history.splice(index, 0, [day, month]);
          lastDate.push([day, month]);
        }
      });

      history.splice(-20, 20).forEach(item => {
        if (item.text) {
          UI.CHAT.WINDOW.append(renderMessage(item.text, item.updatedAt, item.user.name, item));
        } else {
          UI.CHAT.WINDOW.prepend(createDateNode(item[0], item[1]));
        }
      });
      scrollChatWindowToBottom();
    }
    else {
      renderPopup(POPUP.AUTHORIZATION);
    }
    console.log(lastDate);
    dateNode.querySelector('.content').textContent = lastDate.reverse()[0].join(' ');
  } catch (e) {
    renderPopup(POPUP.AUTHORIZATION);
  }
}

function setSocket() {
  socket = new WebSocket(WS_URL + COOKIE.get(COOKIE_KEY.TOKEN));

  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    UI.CHAT.WINDOW.append(renderMessage(data.text, data.createdAt, data.user.name, data));
    scrollChatWindowToBottom();
    // if (data.user.email !== COOKIE.get(KEY.MAIL)) {
    //   sendMessage('тестовый ответ (бот)');
    // }
  };
}



UI.CHAT.WINDOW.addEventListener('scroll', function () {
  if (this.scrollTop < 530) {
    history.splice(-20, 20).reverse().forEach(item => {
      if (item.text) {
        UI.CHAT.WINDOW.prepend((renderMessage(item.text, item.updatedAt, item.user.name, item)));
      } else {
        // const dateNode = UI.DATE.content.cloneNode('deep');
        // dateNode.querySelector('.content').innerText = item[1] + ' ' + item[0];
        UI.CHAT.WINDOW.prepend(createDateNode(item[0], item[1]));
      }
    });

    if (history.length === 0 && !UI.CHAT.WINDOW.contains(UI.CHAT.WINDOW.querySelector('.history_loaded'))) {
      UI.CHAT.WINDOW.prepend(document.getElementById('history_loaded_template').content.cloneNode('deep'));
    }
  }
});

function createDateNode(month, day) {
  const date = UI.DATE.content.cloneNode('deep');
  date.querySelector('.content').innerText = day + ' ' + month;
  return date;
}

let lastScroll = Infinity;
let lastDate = [];
const dateNode = document.getElementById('test');

UI.CHAT.WINDOW.addEventListener('scroll', function () {
  // dateNode.querySelector('.content').textContent = UI.CHAT.WINDOW.querySelectorAll('.date')[0].textContent;

  if (this.scrollTop < lastScroll) {
    lastScroll = this.scrollTop;
    dateNode.style.top = '-5px';
  } else {
    lastScroll = this.scrollTop;
    dateNode.style.top = '-30px';
  }
});

function scrollChatWindowToBottom() {
  UI.CHAT.WINDOW.scrollTop = UI.CHAT.WINDOW.scrollHeight;
}


export { POPUP, URL, COOKIE_KEY, socket, setSocket, me, startChat }