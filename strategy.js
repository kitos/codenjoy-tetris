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
  head
} = require('ramda')
const { replaceWith } = require('./string')

let GlassState = {
  // из этих символов состоит строка glass
  EMPTY: ' ', // так выглядит свободное место в стакане
  BUSY: '*' // а тут уже занято
}

const GLASS_WIDTH = 10
const GLASS_HEIGHT = 20

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

let Figure = {
  I: 'I',
  O: 'O',
  J: 'J',
  L: 'L',
  S: 'S',
  Z: 'Z',
  T: 'T'
}

// карта фигур
// содержит координаты точек фигуры относительно оси вращения для всех положений
let shapes = {
  I: [
    [[0, 1], [0, 0], [0, -1], [0, -2]], // нулевое вращение
    [[1, 0], [0, 0], [-1, 0], [-2, 0]], // 90 градусов по часовой
    [[0, 1], [0, 0], [0, -1], [0, 2]], // ...
    [[1, 0], [0, 0], [-1, 0], [2, 0]]
  ],
  O: [
    [[0, 0], [1, 0], [1, -1], [0, -1]],
    [[0, 0], [0, -1], [-1, -1], [-1, 0]],
    [[0, 0], [-1, 0], [-1, 1], [0, 1]],
    [[0, 0], [0, 1], [1, 1], [1, 0]]
  ],
  J: [
    [[0, 0], [0, 1], [0, -1], [-1, -1]],
    [[0, 0], [-1, 1], [-1, 0], [1, 0]],
    [[0, 0], [0, 1], [1, 1], [0, -1]],
    [[0, 0], [-1, 0], [1, 0], [1, -1]]
  ],
  L: [
    [[0, 0], [0, 1], [0, -1], [1, -1]],
    [[0, 0], [-1, -1], [-1, 0], [1, 0]],
    [[0, 0], [0, 1], [-1, 1], [0, -1]],
    [[0, 0], [-1, 0], [1, 0], [1, 1]]
  ],
  S: [
    [[0, 0], [-1, 0], [0, 1], [1, 1]],
    [[0, 0], [0, 1], [1, 0], [1, -1]],
    [[0, 0], [-1, -1], [0, -1], [1, 0]],
    [[0, 0], [1, 1], [-1, 0], [0, -1]]
  ],
  Z: [
    [[0, 0], [-1, 1], [0, 1], [1, 0]],
    [[0, 0], [1, 1], [1, 0], [0, -1]],
    [[0, 0], [-1, 0], [0, -1], [1, -1]],
    [[0, 0], [0, 1], [-1, 0], [-1, -1]]
  ],
  T: [
    [[0, 0], [-1, 0], [0, 1], [1, 0]],
    [[0, 0], [0, 1], [1, 0], [0, -1]],
    [[0, 0], [-1, 0], [1, 0], [0, -1]],
    [[0, 0], [-1, 0], [0, 1], [0, -1]]
  ]
}

let toOneDimensional = (x, y) => x + GLASS_WIDTH * y

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
 * Добавляет фигуру в стакан по указанной позиции, возвращает новый стакан.
 */
let addFigure = curry((glassString, figure, { x, y, rotation }) =>
  shapes[figure][rotation].reduce(
    (result, [cellRelativeX, cellRelativeY]) =>
      replaceWith(
        result,
        '*',
        toOneDimensional(x + cellRelativeX, y + cellRelativeY)
      ),
    glassString
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
  Figure,
  strategy,
  hasGlassCollision,
  hasFiguresCollision,
  canDrop,
  addFigure
}
