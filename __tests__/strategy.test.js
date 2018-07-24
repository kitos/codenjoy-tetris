const {
  Figure,
  hasGlassCollision,
  hasFiguresCollision,
  canDrop,
  strategy
} = require('../strategy')

let rotateGlass = glassString =>
  glassString
    .replace(/\r?\n|\r/g, '')
    .match(/.{1,10}/g)
    .reverse()
    .join('')

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
    let glassWithBorderAndOInCenter = rotateGlass(`
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
`)
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

  describe('#strategy', () => {
    describe('obvious solutions', () => {
      it('J', () => {
        let emptyGlass = rotateGlass(`
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
 *********
 *********
`)

        expect(strategy('J', 0, 19, emptyGlass, '')).toBe(
          'rotate=2, left=0, drop'
        )
      })

      it('L', () => {
        let emptyGlass = rotateGlass(`
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
********* 
********* 
`)

        expect(strategy('L', 9, 19, emptyGlass, '')).toBe(
          'rotate=2, left=0, drop'
        )
      })
    })
  })
})
