export default {
  APP: document.getElementById('chat'),

  CHAT: {
    WINDOW: document.getElementById('chat_window'),
    SETTINGS_BTN: document.getElementById('settings_btn'),
    EXIT_BTN: document.getElementById('exit_btn'),
  },

  MESSAGE: {
    FORM: document.getElementById('send_message_form'),
    INPUT: document.getElementById('message_text'),
    TEMPLATE: document.getElementById('message_template'),
  },

  DATE_TEMPLATE: document.getElementById('date_template'),

  POPUP_TEMPLATE: {
    AUTHORIZATION: document.getElementById('popup_authorization_template'),
    VERIFICATION: document.getElementById('popup_verification_template'),
    SETTINGS: document.getElementById('popup_settings_template'),
  },
}