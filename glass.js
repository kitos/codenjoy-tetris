const {
  always,
  curry,
  chain,
  range,
  pipe,
  sum,
  map,
  replace,
  reverse,
  join,
  splitEvery,
  repeat,
  append,
  prepend,
  reduce,
  ifElse,
  equals,
  flip,
  call,
  unary,
  useWith,
  identity,
  countBy
} = require('ramda')
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

let emptyLine = join('', repeat(GlassState.EMPTY, 10))
let busyLine = join('', repeat(GlassState.BUSY, 10))

let splitGlass = splitEvery(10)

let rotateGlass = pipe(replace(/\r?\n|\r/g, ''), splitGlass, reverse, join(''))

let allCoordinates = chain(
  x => chain(y => ({ x, y }), range(0, GLASS_HEIGHT)),
  range(0, GLASS_WIDTH)
)

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
  pipe(
    map(coords => {
      if (isEmpty(glassString, coords)) {
        const hasBusyCellAbove = range(coords.y, GLASS_HEIGHT).some(
          y => !isEmpty(glassString, { ...coords, y })
        )

        return hasBusyCellAbove ? 1 : 0
      }

      return 0
    }),
    sum
  )(allCoordinates)

let linesWillBeRemoved = pipe(splitGlass, pipe(map(equals(busyLine)), sum))

let removeLines = pipe(
  splitGlass,
  reverse,
  reduce(
    useWith(flip(call), [
      identity,
      ifElse(equals(busyLine), always(prepend(emptyLine)), unary(append))
    ]),
    []
  ),
  reverse,
  join('')
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
