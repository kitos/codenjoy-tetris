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
 * Определяет влазит ли указанная фигурка по данным координатам в стакан.
 *
 * Возвращает true, если хотя бы одна точка фигуры выходит за пределы стакана, иначе false.
 *
 * @param figure тип фигуры
 * @param position позиция центра фигуры (точки вращения) и положение этой фигуры
 */
let hasBordersCollision = R.curry((figure, { x, y, rotation }) =>
  shapes[figure][rotation].some(
    ([cellRelativeX, cellRelativeY]) =>
      x + cellRelativeX < 0 ||
      x + cellRelativeX >= GLASS_WIDTH ||
      y + cellRelativeY < 0 ||
      y + cellRelativeY >= GLASS_HEIGHT
  )
)

/**
 * Определяет пересечение фигуры по заданным координатам с уже лежащими фигурами в стакане.
 *
 * Возвращает true, если хотя бы одна точка фигуры пересекается с лежащими фигурами в стакане, иначе false.
 *
 * @param glass строка стакана
 * @param figure тип фигуры
 * @param position позиция центра фигуры (точки вращения) и положение этой фигуры
 */
let hasFiguresCollision = R.curry((glass, figure, { x, y, rotation }) =>
  shapes[figure][rotation].some(
    ([cellRelativeX, cellRelativeY]) =>
      glass.charAt(toOneDimensional(x + cellRelativeX, y + cellRelativeY)) ===
      GlassState.BUSY
  )
)

/**
 * Определяет можно ли опустить фигуру в заданное положение.
 *
 * Если напути (сверху вниз) хотя бы одна точка фигуры пересекается с лежащими элементами возвращает false, иначе true.
 *
 * @param glass строка стакана
 * @param figure тип фигуры
 * @param position позиция центра фигуры (точки вращения) и положение этой фигуры
 */
let canDrop = R.curry((glassString, figure, { y, ...position }) =>
  R.range(y, GLASS_HEIGHT - 1).every(
    y => !hasFiguresCollision(glassString)(figure, { ...position, y })
  )
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
  hasBordersCollision,
  hasFiguresCollision,
  canDrop,
  addFigure,
  rotateGlass,
  closedCellsCount,
  linesWillBeRemoved,
  removeLines
}
