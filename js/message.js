import API from './api.js'
import { URL, socket, COOKIE_KEY } from './app.js'
import COOKIE from './cookie.js'
import UI from './view.js'
import { getTime, getDay, getMonth } from './time.js'

function renderMessage(text, date, userName, data) {
  if (!text) return

  const message = UI.MESSAGE.TEMPLATE.content.cloneNode('deep');
  message.querySelector('.message').innerText = userName + ': ' + text;
  message.querySelector('.time').innerText = getTime(date);

  if (data.user.email !== COOKIE.get(COOKIE_KEY.MAIL))
    message.querySelector('.chat__message').classList.add('any_message');

  // UI.CHAT.WINDOW.append(message);
  // scrollChatWindowToBottom();
  return message;
}


function sendMessage(messageText) {
  if (!messageText.trim()) return

  socket.send(JSON.stringify({
    text: messageText,
  }).trim());
}


async function downloadMessages() {
  const array = [];
  const response = await API.sendRequest({
    url: URL.MESSAGES,
    method: 'GET',
  }, COOKIE.get(COOKIE_KEY.TOKEN))
  // .then(response => response.json()).then(function (data) {
  // let day;
  // let month;
  // data.messages.forEach(item => {
  //   array.push(item);
  //   if (day !== getDay(item.updatedAt)) {
  //     renderDate(getMonth(item.updatedAt), getDay(item.updatedAt));
  //     day = getDay(item.updatedAt);
  //     month = getMonth(item.updatedAt);
  //   }
  // renderMessage(item.text, item.updatedAt, item.user.name, item);
  // })
  // console.log(array.splice(-20, 20));
  // })


  return response.json();
}

export { renderMessage, sendMessage, downloadMessages }