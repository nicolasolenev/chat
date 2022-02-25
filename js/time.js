function getTime(iso) {
  const date = iso ? new Date(iso) : new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
}

function getDay(iso) {
  const date = new Date(iso);
  return date.getDate();
}

function getMonth(iso) {
  const months = [
    ['January', 'Jan.'],
    ['February', 'Feb.'],
    ['March', 'Mar.'],
    ['April', 'Apr.'],
    ['May', 'May'],
    ['June', 'Jun.'],
    ['July', 'Jul.'],
    ['August', 'Aug.'],
    ['September', 'Sep.'],
    ['October', 'Oct.'],
    ['November', 'Nov.'],
    ['December', 'Dec.'],
  ];
  const date = new Date(iso);
  const month = date.getMonth();
  return months[month][1];
}

export { getDay, getTime, getMonth }