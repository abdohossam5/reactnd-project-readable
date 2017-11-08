export const sort = (list = [], prop) => {
  if (prop) {
    return Array.prototype.sort.call(list, (a, b) => {
      if (a[prop] < b[prop]) {
        return 1
      } else if (a[prop] > b[prop]) {
        return -1
      }
      return 0
    })
  }

  return Array.prototype.sort.call(list)
};

export const getReadableDate = (timeStamp) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const date = new Date(timeStamp || ''),
    month = months[date.getMonth()],
    day = date.getDay(),
    year = date.getFullYear(),
    hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours(),
    minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

  return `${month} ${day}, ${year} ${hour}:${minutes}`

};