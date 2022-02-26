function createMessageNode(text, time, userName, userMail, template, myMail) {
  if (!text) return;

  const message = template.content.cloneNode('deep');
  message.querySelector('.message').innerText = userName + ': ' + text;
  message.querySelector('.time').innerText = time;

  if (userMail !== myMail)
    message.querySelector('.chat__message').classList.add('any_message');

  return message;
}


function sendMessage(messageText, socket) {
  if (!messageText.trim()) return;

  socket.send(JSON.stringify({
    text: messageText,
  }).trim());
}

export { createMessageNode, sendMessage }