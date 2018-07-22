const {
  pipe,
  filter,
  sortWith,
  ascend,
  prop,
  allPass,
  range,
  complement,
  curry
} = require('ramda')

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

let Figure = {
  I: 'I',
  O: 'O',
  J: 'J',
  L: 'L'
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
  ]
}

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
      glass.charAt(x + cellRelativeX + GLASS_WIDTH * (y + cellRelativeY)) ===
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
  let solutions = []

  for (let x = 0; x < GLASS_WIDTH; x++) {
    for (let y = 0; y < GLASS_HEIGHT; y++) {
      for (let rotation = 0; rotation < 4; rotation++) {
        solutions.push({
          x,
          y,
          rotation
        })
      }
    }
  }

  let orderedSolutions = pipe(
    filter(
      allPass([complement(hasGlassCollision(figure)), canDrop(glass, figure)])
    ),
    sortWith([
      ascend(prop('y')),
      ascend(({ rotation }) =>
        Math.min(...shapes[figure][rotation].map(([x, y]) => y))
      ),
      ascend(prop('x'))
    ])
  )(solutions)

  let { x, rotation } = orderedSolutions[0]

  return `left=${currentX - x}, rotate=${rotation}, drop`
}

module.exports = {
  Figure,
  strategy,
  hasGlassCollision,
  hasFiguresCollision,
  canDrop
}
