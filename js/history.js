import UI from './view.js'
import API from './api.js'
import COOKIE from './cookie.js'
import { getTime } from './time.js'
import { COOKIE_KEY } from './app.js'
import { createMessageNode } from './message.js'


async function getHistory(url) {
  const response = await API.sendRequest({
    url: url,
    method: 'GET',
  }, COOKIE.get(COOKIE_KEY.TOKEN));

  return response.json();
}

function renderHistory(history, insertionType) {
  history.forEach(item => {
    UI.CHAT.WINDOW[insertionType](createMessageNode(item.text, getTime(item.updatedAt), item.user.name, item.user.email, UI.MESSAGE.TEMPLATE, COOKIE.get(COOKIE_KEY.MAIL)));
  });
  if (history.length === 0 && !UI.CHAT.WINDOW.contains(UI.CHAT.WINDOW.querySelector('.history_loaded'))) {
    renderEndHistory();
  }
}

function renderEndHistory() {
  UI.CHAT.WINDOW.prepend(document.getElementById('history_loaded_template').content.cloneNode('deep'));
}


export { getHistory, renderHistory }