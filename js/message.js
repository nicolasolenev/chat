import API from './api.js'
import { URL, socket, KEY } from './app.js'
import COOKIE from './cookie.js'
import UI from './view.js'
import getTime from './time.js'

function renderMessage(text, date, userName, data) {
  if (!text) return

  const message = UI.MESSAGE.TEMPLATE.content.cloneNode('deep');
  message.querySelector('.message').innerText = userName + ': ' + text;
  message.querySelector('.time').innerText = getTime(date);

  if (data.user.email !== COOKIE.get(KEY.MAIL))
    message.querySelector('.chat__message').classList.add('any_message');

  UI.CHAT.WINDOW.append(message);
  scrollChatWindowToBottom();
}


function sendMessage(messageText) {
  if (!messageText.trim()) return

  socket.send(JSON.stringify({
    text: messageText,
  }).trim());
}


function downloadMessages() {
  API.sendRequest({
    url: URL.MESSAGES,
    method: API.METHOD.GET,

    onSuccess: function (data) {
      data.messages.forEach(item => renderMessage(item.message, item.updatedAt, item.username))
    },
  })
}

function scrollChatWindowToBottom() {
  UI.CHAT.WINDOW.scrollTop = UI.CHAT.WINDOW.scrollHeight;
}

export { renderMessage, sendMessage, downloadMessages }