const {
  Figure,
  hasGlassCollision,
  hasFiguresCollision,
  canDrop
} = require('../strategy')

describe('strategy', () => {
  let center = { x: 4, y: 9 }

  describe('#hasGlassCollision', () => {
    Object.keys(Figure).forEach(figure => {
      describe(`figure "${figure}"`, () => {
        let hasFigureGlassCollision = hasGlassCollision(figure)

        it('should return false if all figure cells fits the glass', () =>
          expect(hasFigureGlassCollision({ ...center, rotation: 0 })).toBe(
            false
          ))

        it('should detect collisions in bottom left corner', () =>
          expect(hasFigureGlassCollision({ x: 0, y: 0, rotation: 0 })).toBe(
            true
          ))

        it('should detect collisions in bottom right corner', () =>
          expect(hasFigureGlassCollision({ x: 9, y: 0, rotation: 0 })).toBe(
            true
          ))

        if (figure !== Figure.O) {
          it('should detect collisions in top left corner', () =>
            expect(
              hasGlassCollision(figure, { x: 0, y: 19, rotation: 0 })
            ).toBe(true))
        }

        it('should detect collisions in top right corner', () =>
          expect(hasGlassCollision(figure, { x: 9, y: 19, rotation: 0 })).toBe(
            true
          ))
      })
    })
  })

  describe('#hasFiguresCollision', () => {
    let glassWithBorderAndOInCenter = `
**********
*        *
*        *
*        *
*        *
*        *
*        *
*        *
*        *
*   **   *
*   **   *
*        *
*        *
*        *
*        *
*        *
*        *
*        *
*        *
**********
`
      .replace(/\r?\n|\r/g, '')
      .split('')
      .reverse()
      .join('')
    let hasCollisionWithBordersOrO = hasFiguresCollision(
      glassWithBorderAndOInCenter
    )

    Object.keys(Figure).forEach(figure => {
      let hasFigureCollisions = hasCollisionWithBordersOrO(figure)

      describe(`figure "${figure}"`, () => {
        it('should detect collisions in bottom left border corner', () =>
          expect(hasFigureCollisions({ x: 1, y: 1, rotation: 0 })).toBe(true))

        it('should detect collisions in bottom right border corner', () =>
          expect(hasFigureCollisions({ x: 8, y: 1, rotation: 0 })).toBe(true))

        if (figure !== Figure.O) {
          it('should detect collisions in top left border corner', () =>
            expect(hasFigureCollisions({ x: 1, y: 18, rotation: 0 })).toBe(
              true
            ))
        }

        it('should detect collisions in top right border corner', () =>
          expect(hasFigureCollisions({ x: 8, y: 18, rotation: 0 })).toBe(true))

        it('should detect collision with O', () =>
          expect(
            hasCollisionWithBordersOrO(figure, { ...center, rotation: 0 })
          ).toBe(true))
      })
    })
  })
})
