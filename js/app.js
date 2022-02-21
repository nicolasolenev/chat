import UI from './view.js';
import { downloadMessages, renderMessage, renderPopup, POPUP } from './main.js';

downloadMessages();

UI.MESSAGE.FORM.addEventListener('submit', function () {
  renderMessage(UI.MESSAGE.INPUT.value, new Date(), 'Я');
  this.reset();
});

UI.CHAT.SETTINGS_BTN.addEventListener('click', () => renderPopup(POPUP.SETTINGS));

UI.CHAT.EXIT_BTN.addEventListener('click', () => renderPopup(POPUP.AUTHORIZATION));