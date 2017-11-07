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