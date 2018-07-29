const R = require('ramda')
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

let emptyLine = R.join('', R.repeat(GlassState.EMPTY, 10))
let busyLine = R.join('', R.repeat(GlassState.BUSY, 10))

let splitGlass = R.splitEvery(10)

let rotateGlass = R.pipe(
  R.replace(/\r?\n|\r/g, ''),
  splitGlass,
  R.reverse,
  R.join('')
)

/**
 * Добавляет фигуру в стакан по указанной позиции, возвращает новый стакан.
 */
let addFigure = R.curry((glassString, figure, { x, y, rotation }) =>
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

let isEmpty = (glassString, { x, y }) =>
  glassString.charAt(toOneDimensional(x, y)) === GlassState.EMPTY

/**
 * Возвращает количество закрытых ячеек.
 * Закрытой является свободная ячейка, над которой есть хотя бы одна занятая.
 *
 * @param glassString стакан
 * @returns {number} количесво закрытых ячеек
 */
let closedCellsCount = glassString =>
  R.pipe(
    R.map(x =>
      R.pipe(
        R.map(y => glassString.charAt(toOneDimensional(x, y))),
        R.dropLastWhile(R.equals(GlassState.EMPTY)),
        R.map(R.equals(GlassState.EMPTY)),
        R.sum
      )(R.range(0, GLASS_HEIGHT))
    ),
    R.sum
  )(R.range(0, GLASS_WIDTH))

let linesWillBeRemoved = R.pipe(
  splitGlass,
  R.pipe(R.map(R.equals(busyLine)), R.sum)
)

let removeLines = R.pipe(
  splitGlass,
  R.reverse,
  R.reduce(
    R.useWith(R.flip(R.call), [
      R.identity,
      R.ifElse(
        R.equals(busyLine),
        R.always(R.prepend(emptyLine)),
        R.unary(R.append)
      )
    ]),
    []
  ),
  R.reverse,
  R.join('')
)

module.exports = {
  GLASS_HEIGHT,
  GLASS_WIDTH,
  GlassState,
  addFigure,
  toOneDimensional,
  rotateGlass,
  closedCellsCount,
  linesWillBeRemoved,
  removeLines
}
