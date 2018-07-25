const { curry, chain, range, pipe, sum, map } = require('ramda')
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

let linesWillBeRemoved = glassString =>
  range(0, GLASS_HEIGHT).reduce((sum, y) => {
    if (range(0, GLASS_WIDTH).every(x => !isEmpty(glassString, { x, y }))) {
      return sum + 1
    }

    return sum
  }, 0)

module.exports = {
  GLASS_HEIGHT,
  GLASS_WIDTH,
  GlassState,
  addFigure,
  toOneDimensional,
  rotateGlass,
  closedCellsCount,
  linesWillBeRemoved
}
