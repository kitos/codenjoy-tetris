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

let shapes = {
  I: [
    [[0, 1], [0, 0], [0, -1], [0, -2]],
    [[1, 0], [0, 0], [-1, 0], [-2, 0]],
    [[0, 1], [0, 0], [0, -1], [0, 2]],
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

let hasGlassCollision = curry((figure, { x, y, rotation }) =>
  shapes[figure][rotation].some(
    ([cellRelativeX, cellRelativeY]) =>
      x + cellRelativeX < 0 ||
      x + cellRelativeX >= GLASS_WIDTH ||
      y + cellRelativeY < 0 ||
      y + cellRelativeY >= GLASS_HEIGHT
  )
)

let hasFiguresCollision = curry((glassString, figure, { x, y, rotation }) =>
  shapes[figure][rotation].some(
    ([cellRelativeX, cellRelativeY]) =>
      glassString.charAt(
        x + cellRelativeX + GLASS_WIDTH * (y + cellRelativeY)
      ) === GlassState.BUSY
  )
)

let canDrop = curry((glassString, figure, { y, ...position }) =>
  range(y, GLASS_HEIGHT - 1).every(
    y => !hasFiguresCollision(glassString)(figure, { ...position, y })
  )
)

let buildCollision = glass =>
  allPass([complement(hasGlassCollision), canDrop(glass)])

// метод, говорящий что делать той или иной фигурке figure с координарами x,y в стакане glass. next - очередь следущих фигурок
let strategy = (figure, currentX, currentY, glass, next) => {
  // add "drop" to response when you need to drop a figure
  // for details please check http://codenjoy.com/portal/?p=170#commands
  let steps = []

  for (let x = 0; x < GLASS_WIDTH; x++) {
    for (let y = 0; y < GLASS_HEIGHT; y++) {
      for (let rotation = 0; rotation < 4; rotation++) {
        steps.push({
          x,
          y,
          rotation
        })
      }
    }
  }

  let collision = buildCollision(glass)

  let orderedSolutions = pipe(
    filter(step => collision(figure, step)),
    sortWith([
      ascend(prop('y')),
      ascend(({ rotation }) =>
        Math.min(...shapes[figure][rotation].map(([x, y]) => y))
      ),
      ascend(prop('x'))
    ])
  )(steps)

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
