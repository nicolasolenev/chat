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

function getPopup(obj) {
  const popup = UI.POPUP_TEMPLATE.content.cloneNode('deep');
  popup.querySelector('.popup_title').innerText = obj.title;
  popup.querySelector('.popup__main_title').innerText = obj.form_name;
  popup.querySelector('.popup__input').setAttribute('placeholder', obj.placeholder);
  popup.querySelector('.chat__btn').innerText = obj.btn_name;
  popup.querySelector('.popup__exit').addEventListener('click', function () {
    this.closest('.popup_wrapper').remove();
  });
  if (obj.title === settings.title) {
    popup.querySelector('.popup__main').classList.add('popup__settings');
  }
  if (obj.title === authorization.title) {
    popup.querySelector('.chat__btn').addEventListener('click', authorizationHendler);
  }
  if (obj.title === verification.title) {
    popup.querySelector('.chat__btn').addEventListener('click', function () {
      setTimeout(function () {
        document.querySelector('.popup_wrapper').remove();
      }, 1000);
      setTimeout(function () {
        document.querySelector('.any_message').classList.add('visible');
      }, 4000);
      setTimeout(function () {
        const secondMessage = document.querySelector('.any_message').cloneNode('deep');
        secondMessage.querySelector('.message').innerText = 'Ты справился, молодец!';
        UI.CHAT_WINDOW.append(secondMessage);
      }, 10000);
    });
  }
  UI.CHAT.append(popup);
}


function authorizationHendler() {
  const mailField = this.previousElementSibling;
  if (!mailField.value) return
  const mail = {
    email: this.previousElementSibling.value,
  }
  fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(mail)
  })
    .then(response => response.json())
    .then(function (data) {
      console.log(data);
      document.querySelector('.popup_wrapper').remove();
    });
  setTimeout(function () {
    document.querySelector('.popup_wrapper').remove();
    getPopup(verification);
  }, 2000);

}