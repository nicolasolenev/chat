
function createMessageNode(text, time, userName, data, template, userMail) {
  if (!text) return;

  const message = template.content.cloneNode('deep');
  message.querySelector('.message').innerText = userName + ': ' + text;
  message.querySelector('.time').innerText = time;

  if (data.user.email !== userMail)
    message.querySelector('.chat__message').classList.add('any_message');

  return message;
}


function sendMessage(messageText, socket) {
  if (!messageText.trim()) return;

  socket.send(JSON.stringify({
    text: messageText,
  }).trim());
}

function createDateNode(template, day, month) {
  const date = template.content.cloneNode('deep');
  date.querySelector('.content').innerText = day + ' ' + month;
  return date;
}

export { createMessageNode, sendMessage, createDateNode }