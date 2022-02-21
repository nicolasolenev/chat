import UI from './view.js';
import { MAIN } from './main.js';

MAIN.scrollChatWindowToBottom();

UI.MESSAGE_FORM.addEventListener('submit', function () {
  MAIN.renderMessage(UI.MESSAGE_INPUT.value, new Date(), 'Я');
  this.reset();
});

UI.SETTINGS_BTN.addEventListener('click', () => MAIN.renderPopup(MAIN.SETTINGS));

UI.EXIT_BTN.addEventListener('click', () => MAIN.renderPopup(MAIN.AUTHORIZATION));