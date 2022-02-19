import { UI } from './view.js';

const URL = 'https://chat1-341409.oa.r.appspot.com/api/user';

const authorization = {
  title: 'Авторизация',
  form_name: 'Почта:',
  placeholder: '',
  btn_name: 'Получить код',
};

const settings = {
  title: 'Настройки',
  form_name: 'Имя в чате',
  placeholder: 'имя',
  btn_name: '->',
};

const verification = {
  title: 'Подтверждение',
  form_name: 'Код:',
  placeholder: '',
  btn_name: 'Войти',
};

scrollChatWindowToBottom();

UI.MESSAGE_FORM.addEventListener('submit', function () {
  if (!UI.MESSAGE_INPUT.value) return
  const message = UI.MESSAGE_TEMPLATE.content.cloneNode('deep');
  message.querySelector('.message').innerText = 'Я: ' + UI.MESSAGE_INPUT.value;
  this.reset();
  message.querySelector('.time').innerText = getTime();
  UI.CHAT_WINDOW.append(message);
  scrollChatWindowToBottom();
});


UI.SETTINGS_BTN.addEventListener('click', function () {
  getPopup(settings);
});

UI.EXIT_BTN.addEventListener('click', function () {
  getPopup(authorization);
});


// <-- F U N C T I O N S -->

function scrollChatWindowToBottom() {
  UI.CHAT_WINDOW.scrollTop = UI.CHAT_WINDOW.scrollHeight;
}

function getTime() {
  const now = new Date();
  let hours = now.getHours();
  hours = hours < 10 ? '0' + hours : hours;
  let minutes = now.getMinutes();
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutes;
}

function getPopup(obj) {
  const popup = UI.POPUP_TEMPLATE.content.cloneNode('deep');
  popup.querySelector('.popup_title').innerText = obj.title;
  popup.querySelector('.popup__main_title').innerText = obj.form_name;
  popup.querySelector('.popup__input').setAttribute('placeholder', obj.placeholder);
  popup.querySelector('.chat__btn').innerText = obj.btn_name;
  popup.querySelector('.popup__exit').addEventListener('click', function () {
    this.closest('.popup_wrapper').remove();
  });

  switch (obj.title) {
    case settings.title:
      popup.querySelector('.popup__main').classList.add('popup__settings');
      popup.querySelector('.chat__btn').addEventListener('click', settingsHendler);
      break;
    case authorization.title:
      popup.querySelector('.chat__btn').addEventListener('click', authorizationHendler);
      break;
    case verification.title:
      popup.querySelector('.chat__btn').addEventListener('click', verificationHendler);
      break;
  }

  UI.CHAT.append(popup);
}


function authorizationHendler() {
  const mailField = this.previousElementSibling;
  if (!mailField.value) return
  fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({ email: this.previousElementSibling.value })
  })
    .then(response => response.json())
    .then(function () {
      document.querySelector('.popup_wrapper').remove();
      getPopup(verification);
    });
}

function verificationHendler() {
  const codeField = this.previousElementSibling;
  if (!codeField.value) return
  saveInCookie('chat_code', codeField.value);
  document.querySelector('.popup_wrapper').remove();
}

function settingsHendler() {
  const newName = this.previousElementSibling.value;
  if (!newName) return
  const token = getFromCookie('chat_code');
  fetch(URL, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify({ name: newName }),
  })
    .then(response => response.json())
    .then(function () {
      document.querySelector('.popup_wrapper').remove();
      fetch('https://chat1-341409.oa.r.appspot.com/api/user/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Bearer ${token}`
        },
      })
        .then(response => response.json())
        .then(function (data) {
          console.log('Проверка, что на сервере имя изменилось:', data);
        })
    });
}

function saveInCookie(key, value) {
  document.cookie = `${key}=${value}`;
}

function getFromCookie(key) {
  const cookieObj = Object.fromEntries(document.cookie.split('; ').map(item => item.split('=')));
  return cookieObj[key];
}