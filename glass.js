const { curry } = require('ramda')
const { replaceWith } = require('./string')
const { shapes } = require('./figure')

const GLASS_WIDTH = 10
const GLASS_HEIGHT = 20

let GlassState = {
  // из этих символов состоит строка glass
  EMPTY: ' ', // так выглядит свободное место в стакане
  BUSY: '*' // а тут уже занято
}

let toOneDimensional = (x, y) => x + GLASS_WIDTH * y

let rotateGlass = glassString =>
  glassString
    .replace(/\r?\n|\r/g, '')
    .match(/.{1,10}/g)
    .reverse()
    .join('')

/**
 * Добавляет фигуру в стакан по указанной позиции, возвращает новый стакан.
 */
let addFigure = curry((glassString, figure, { x, y, rotation }) =>
  shapes[figure][rotation].reduce(
    (result, [cellRelativeX, cellRelativeY]) =>
      replaceWith(
        result,
        GlassState.BUSY,
        toOneDimensional(x + cellRelativeX, y + cellRelativeY)
      ),
    glassString
  )
)

module.exports = {
  GLASS_HEIGHT,
  GLASS_WIDTH,
  GlassState,
  addFigure,
  toOneDimensional,
  rotateGlass
}
