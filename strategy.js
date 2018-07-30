const R = require('ramda')
const { shapes } = require('./figure')
const {
  GLASS_HEIGHT,
  GLASS_WIDTH,
  GlassState,
  hasBordersCollision,
  canDrop,
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
 * Массив все возможных положений фигуры вида: [{ x: 1, y: 2, rotation: 3 }...]
 *
 * Где x и y это координаты центра фигуры (оси вращения),
 * а rotation позиция фигуры (0-3).
 *
 */
let allPossibleSolutions = (maxY = GLASS_HEIGHT) =>
  R.chain(
    x =>
      R.chain(
        y =>
          R.chain(
            rotation => ({
              x,
              y,
              rotation
            }),
            rotations
          ),
        R.range(0, maxY)
      ),
    R.range(0, GLASS_WIDTH)
  )

let isEqSolutions = figure =>
  R.pipe(
    (
      { x: x1, y: y1, rotation: rotation1 },
      { x: x2, y: y2, rotation: rotation2 }
    ) =>
      R.differenceWith(
        ([rX1, rY1], [rX2, rY2]) =>
          x1 + rX1 === x2 + rX2 && y1 + rY1 === y2 + rY2,
        shapes[figure][rotation1],
        shapes[figure][rotation2]
      ),
    R.isEmpty
  )

let findBestSolution = (figure, glass, [next, ...rest]) =>
  R.pipe(
    // выбрасываем пересечения со стаканом и фигурами в нём
    R.filter(
      R.allPass([
        R.complement(hasBordersCollision(figure)),
        canDrop(glass, figure)
      ])
    ),
    // выбрасываем решения отличающиеся только по y'ку (мы всё-равно бросаем фигурки вниз)
    R.uniqWith(R.both(R.eqProps('x'), R.eqProps('rotation'))),

    // удаляем одинаковые решения (те, которые займут такие же клеточки)
    // например если квадрат повернуть и стдвинуть по x, он замёт то же положение
    R.uniqWith(isEqSolutions(figure)),
    R.map(p => {
      let glassWithNewFigure = addFigure(glass, figure, p)
      let nextGlass = removeLines(glassWithNewFigure)
      let removedLines = linesWillBeRemoved(glassWithNewFigure)

      if (next) {
        let bs = findBestSolution(next, nextGlass, [])
        removedLines += bs.removedLines
        nextGlass = bs.nextGlass
      }

      return {
        ...p,
        removedLines,
        nextGlass
      }
    }),
    R.sortWith([
      // чем больше линий будет удалено, тем лучше
      R.descend(R.prop('removedLines')),
      // чем меньше дыр будет создано, тем лучше
      R.ascend(
        R.memoizeWith(
          JSON.stringify,
          R.pipe(R.prop('nextGlass'), closedCellsCount)
        )
      ),
      // чем ниже и левее мы бросим фигурку тем лучше
      R.ascend(R.prop('y')),
      R.ascend(R.prop('x'))
    ]),
    R.head
  )(allPossibleSolutions(glass.lastIndexOf(GlassState.BUSY) / GLASS_WIDTH + 1))

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
  let bestSolution = findBestSolution(
    figure,
    glass,
    next.substr(0, 2).split('')
  )

  return `rotate=${bestSolution.rotation}, left=${currentX -
    bestSolution.x}, drop`
}

module.exports = {
  strategy,
  findBestSolution,
  canDrop,
  isEqSolutions
}
