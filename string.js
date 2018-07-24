let replaceWith = (target, str, from, length = str.length) =>
  target.substr(0, from) + str + target.substr(from + length)

module.exports = {
  replaceWith
}
