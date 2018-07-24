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
  tap
} = require('ramda')
const { shapes } = require('./figure')
const {
  GLASS_HEIGHT,
  GLASS_WIDTH,
  GlassState,
  toOneDimensional
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
 * Возвращает массив все возможных положений фигуры вида: [{ x: 1, y: 2, rotation: 3 }...]
 *
 * Где x и y это координаты центра фигуры (оси вращения),
 * а rotation позиция фигуры (0-3).
 *
 */
let generateAllPossibleSolutions = () =>
  chain(
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
  // add "drop" to response when you need to drop a figure
  // for details please check http://codenjoy.com/portal/?p=170#commands
  let solutions = generateAllPossibleSolutions()

  let bestSolution = pipe(
    filter(
      allPass([complement(hasGlassCollision(figure)), canDrop(glass, figure)])
    ),
    sortWith([ascend(prop('y')), ascend(prop('x'))]),
    head
  )(solutions)

  return `rotate=${bestSolution.rotation}, left=${currentX -
    bestSolution.x}, drop`
}

module.exports = {
  strategy,
  hasGlassCollision,
  hasFiguresCollision,
  canDrop
}
