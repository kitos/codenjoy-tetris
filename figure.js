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

module.exports = {
  Figure,
  shapes
}
