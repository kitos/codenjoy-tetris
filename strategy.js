const {
  pipe,
  filter,
  sortWith,
  ascend,
  prop,
  allPass,
  range,
  complement,
  curry,
  chain,
  head,
  uniqWith,
  uniqBy,
  pick,
  differenceWith,
  isEmpty,
  descend,
  map
} = require('ramda')
const { shapes } = require('./figure')
const {
  GLASS_HEIGHT,
  GLASS_WIDTH,
  GlassState,
  toOneDimensional,
  addFigure,
  closedCellsCount,
  removeLines,
  linesWillBeRemoved
} = require('./glass')

const DO_NOT_ROTATE = 0 // не вращать фигурку
const ROTATE_90_CLOCKWISE = 1 // повернуть по часовой стрелке один раз
const ROTATE_180_CLOCKWISE = 2 // повернуть по часовой стрелке два раза
const ROTATE_90_COUNTERCLOCKWISE = 3 // повернуть против часовой стрелки 1 раз (3 по часовой)

let rotations = [
  DO_NOT_ROTATE,
  ROTATE_90_CLOCKWISE,
  ROTATE_180_CLOCKWISE,
  ROTATE_90_COUNTERCLOCKWISE
]

/**
 * Определяет влазит ли указанная фигурка по данным координатам в стакан.
 *
 * Возвращает true, если хотя бы одна точка фигуры выходит за пределы стакана, иначе false.
 *
 * @param figure тип фигуры
 * @param position позиция центра фигуры (точки вращения) и положение этой фигуры
 */
let hasGlassCollision = curry((figure, { x, y, rotation }) =>
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
let hasFiguresCollision = curry((glass, figure, { x, y, rotation }) =>
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
let canDrop = curry((glassString, figure, { y, ...position }) =>
  range(y, GLASS_HEIGHT - 1).every(
    y => !hasFiguresCollision(glassString)(figure, { ...position, y })
  )
)

/**
 * Массив все возможных положений фигуры вида: [{ x: 1, y: 2, rotation: 3 }...]
 *
 * Где x и y это координаты центра фигуры (оси вращения),
 * а rotation позиция фигуры (0-3).
 *
 */
let allPossibleSolutions = chain(
  x =>
    chain(
      y =>
        chain(
          rotation => ({
            x,
            y,
            rotation
          }),
          rotations
        ),
      range(0, GLASS_HEIGHT)
    ),
  range(0, GLASS_WIDTH)
)

let isEqSolutions = figure =>
  pipe(
    (
      { x: x1, y: y1, rotation: rotation1 },
      { x: x2, y: y2, rotation: rotation2 }
    ) =>
      differenceWith(
        ([rX1, rY1], [rX2, rY2]) =>
          x1 + rX1 === x2 + rX2 && y1 + rY1 === y2 + rY2,
        shapes[figure][rotation1],
        shapes[figure][rotation2]
      ),
    isEmpty
  )

let findBestSolution = (figure, glass, next) =>
  pipe(
    // выбрасываем пересечения со стаканом и фигурами в нём
    filter(
      allPass([complement(hasGlassCollision(figure)), canDrop(glass, figure)])
    ),
    // выбрасываем решения отличающиеся только по y'ку (мы всё-равно бросаем фигурки вниз)
    uniqBy(pick(['x', 'rotation'])),
    // удаляем одинаковые решения (те, которые займут такие же клеточки)
    // например если квадрат повернуть и стдвинуть по x, он замёт то же положение
    uniqWith(isEqSolutions(figure)),
    map(p => {
      let glassWithNewFigure = addFigure(glass, figure, p)
      let nextGlass = removeLines(glassWithNewFigure)

      return {
        ...p,
        removedLines: linesWillBeRemoved(glassWithNewFigure),
        closedCells: closedCellsCount(nextGlass)
      }
    }),
    sortWith([
      // чем больше линий будет удалено, тем лучше
      descend(prop('removedLines')),
      // чем меньше дыр будет создано, тем лучше
      ascend(prop('closedCells')),
      // чем ниже и левее мы бросим фигурку тем лучше
      ascend(prop('y')),
      ascend(prop('x'))
    ]),
    head
  )(allPossibleSolutions)

/**
 * Основной метод бота, говорит что нужно делать с фигуркой.
 *
 * @param figure текущая фигурка
 * @param currentX x координата фигурки
 * @param currentY y координата фигурки
 * @param glass строка состояния стакана
 * @param next очередь следующих фигуров
 * @returns {string} команда перемещения
 */
let strategy = (figure, currentX, currentY, glass, next) => {
  let bestSolution = findBestSolution(figure, glass, next)

  return `rotate=${bestSolution.rotation}, left=${currentX -
    bestSolution.x}, drop`
}

module.exports = {
  strategy,
  findBestSolution,
  hasGlassCollision,
  hasFiguresCollision,
  canDrop,
  isEqSolutions
}
