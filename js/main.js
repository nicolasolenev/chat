import { UI } from './view.js'

scrollChatWindowToBottom();

UI.MESSAGE_FORM.addEventListener('submit', function () {
  if (!UI.TEXT_FIELD.value) return
  const message = UI.MESSAGE_TEMPLATE.content.cloneNode('deep');
  message.querySelector('.message').innerText = 'Я: ' + UI.TEXT_FIELD.value;
  this.reset();
  message.querySelector('.time').innerText = getTime();
  UI.CHAT_WINDOW.append(message);
  scrollChatWindowToBottom();
});

UI.SETTINGS_BTN.addEventListener('click', function () {
  UI.SETTINGS_MENU.classList.add('visible');
});

UI.SETTINGS_EXIT.addEventListener('click', function () {
  UI.SETTINGS_MENU.classList.remove('visible');
});





// <-- F U N C T I O N S -->

function getTime() {
  const now = new Date();
  let hours = now.getHours();
  hours = hours < 10 ? '0' + hours : hours;
  let minutes = now.getMinutes();
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutes;
}

function scrollChatWindowToBottom() {
  UI.CHAT_WINDOW.scrollTop = UI.CHAT_WINDOW.scrollHeight;
}