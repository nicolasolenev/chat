import UI from './view.js'
import API from './api.js'
import COOKIE from './cookie.js'
import { POPUP, URL, setSocket, COOKIE_KEY, me, startChat } from './app.js'

function renderPopup(type) {
  const popup = UI.POPUP_TEMPLATE[type].content.cloneNode('deep');

  popup.querySelector('.popup__exit').addEventListener('click', async function () {
    removePopup();

    const response = await API.sendRequest(me, COOKIE.get(COOKIE_KEY.TOKEN));
    const isValidAccount = await response.ok;

    if (!isValidAccount) {
      renderPopup(POPUP.AUTHORIZATION);
    }
  });

  switch (type) {
    case POPUP.SETTINGS:
      popup.querySelector('.popup__main').classList.add('popup__settings');
      popup.querySelector('.chat__btn').addEventListener('click', settingsHandler);
      break;

    case POPUP.AUTHORIZATION:
      popup.querySelector('.popup__exit').remove();
      popup.querySelector('.chat__btn').addEventListener('click', authorizationHandler);
      break;

    case POPUP.VERIFICATION:
      popup.querySelector('.chat__btn').addEventListener('click', verificationHandler);
      break;
  }

  UI.APP.append(popup);
}


function removePopup() {
  document.querySelector('.popup_wrapper').remove();
}


async function authorizationHandler() {
  const userMail = getInputValue();

  if (!userMail) return;

  const response = await API.sendRequest({
    url: URL.USER,
    method: 'POST',
    body: { email: userMail },
  });

  if (response.ok) {
    removePopup();
    renderPopup(POPUP.VERIFICATION);
  } else {
    alert('Введите корректный адрес эл.почты.');
  }
}


async function verificationHandler() {
  const code = getInputValue();

  if (!code) return;

  COOKIE.set(COOKIE_KEY.TOKEN, code);
  try {
    const response = await API.sendRequest(me, COOKIE.get(COOKIE_KEY.TOKEN));
    const isValidAccount = await response.ok;
    if (isValidAccount) {
      const user = await response.json();
      COOKIE.set(COOKIE_KEY.MAIL, user.email);
      removePopup();
      startChat();
    }
    else {
      document.querySelector('.popup__input').value = '';
      alert('Вы ввели недействительный код.');
    }
  } catch (e) {
    document.querySelector('.popup__input').value = '';
    alert('Вы ввели недействительный код.');
  }

}


async function settingsHandler() {
  const userName = getInputValue();

  if (!userName) return;

  const response = await API.sendRequest({
    url: URL.USER,
    method: 'PATCH',
    body: { name: userName },
  }, COOKIE.get(COOKIE_KEY.TOKEN));

  if (await response.ok) {
    location.reload();
  } else {
    alert('Возникла ошибка, попробуйте изменить имя позже.');
  }
}

function getInputValue() {
  return document.querySelector('.popup__input').value;
}

export default renderPopup