import UI from './view.js'
import API from './api.js'
import COOKIE from './cookie.js'
import { POPUP, URL, COOKIE_KEY, me_request, startChat } from './app.js'


function renderPopup(type) {
  const popup_node = UI.POPUP_TEMPLATE[type].content.cloneNode('deep');

  const popup = {
    confirm_btn: popup_node.querySelector('.chat__btn'),
    exit_btn: popup_node.querySelector('.popup__exit'),
    main: popup_node.querySelector('.popup__main'),
  }

  popup.exit_btn.addEventListener('click', async function () {
    removePopup();

    const response = await API.sendRequest(me_request, COOKIE.get(COOKIE_KEY.TOKEN));

    if (!response.ok) {
      renderPopup(POPUP.AUTHORIZATION);
    }
  });

  switch (type) {
    case POPUP.SETTINGS:
      popup.main.classList.add('popup__settings');
      popup.confirm_btn.addEventListener('click', settingsHandler);
      break;

    case POPUP.AUTHORIZATION:
      popup.exit_btn.remove();
      popup.confirm_btn.addEventListener('click', authorizationHandler);
      break;

    case POPUP.VERIFICATION:
      popup.confirm_btn.addEventListener('click', verificationHandler);
      break;
  }

  UI.APP.append(popup_node);
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
    if (response.ok) {
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
    alert(e.message);
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
  if (response.ok) {
    location.reload();
  } else {
    alert('Возникла ошибка, попробуйте изменить имя позже.');
  }
}


function getInputValue() {
  return document.querySelector('.popup__input').value;
}

export default renderPopup