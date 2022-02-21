import UI from './view.js';
import { downloadMessages, renderMessage, renderPopup, POPUP } from './main.js';

downloadMessages();

UI.MESSAGE_FORM.addEventListener('submit', function () {
  renderMessage(UI.MESSAGE_INPUT.value, new Date(), 'Я');
  this.reset();
});

UI.SETTINGS_BTN.addEventListener('click', () => renderPopup(POPUP.SETTINGS));

UI.EXIT_BTN.addEventListener('click', () => renderPopup(POPUP.AUTHORIZATION));