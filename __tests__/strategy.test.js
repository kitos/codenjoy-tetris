const {
  hasGlassCollision,
  hasFiguresCollision,
  isEqSolutions,
  findBestSolution
} = require('../strategy')
const { Figure } = require('../figure')
const { rotateGlass, addFigure } = require('../glass')

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

  describe('#isEqSolutions', () => {
    it('should return if solutions are equal', () => {
      expect(
        isEqSolutions('O')(
          { x: 0, y: 0, rotation: 0 },
          { x: 1, y: 0, rotation: 1 }
        )
      ).toBe(true)

      expect(
        isEqSolutions('O')(
          { x: 0, y: 0, rotation: 0 },
          { x: 1, y: -1, rotation: 2 }
        )
      ).toBe(true)

      expect(
        isEqSolutions('O')(
          { x: 0, y: 0, rotation: 0 },
          { x: 0, y: -1, rotation: 3 }
        )
      ).toBe(true)
    })
  })

  describe('#findBestSolution', () => {
    describe('obvious solutions', () => {
      let figure
      let nextFigures = []
      let before
      let expected

      afterEach(() => {
        console.time('TIME')
        let bestSolution = findBestSolution(figure, before, nextFigures)
        console.timeEnd('TIME')

        let actual = addFigure(
          before,
          figure,
          bestSolution
        )

        console.log('bestSolution')
        console.log(bestSolution)
        console.log('BEFORE')
        console.log(rotateGlass(before).match(/.{1,10}/g))
        console.log('ACTUAL')
        console.log(rotateGlass(actual).match(/.{1,10}/g))

        expect(actual).toEqual(expected)
      })

      it('J', () => {
        figure = 'J'
        before = rotateGlass(`
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
 *********
 *********
`)
        expected = rotateGlass(`
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
**        
**********
**********
`)
      })

      it('L', () => {
        figure = 'L'
        before = rotateGlass(`
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
********* 
********* 
`)
        expected = rotateGlass(`
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
        **
**********
**********
`)
      })

      it('LJ', () => {
        figure = 'L'
        nextFigures = ['J',]
        before = rotateGlass(`
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
 ******** 
 ******** 
 ******** 
`)
        expected = rotateGlass(`
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
        **
 *********
 *********
 ******** 
`)
      })
    })
  })
})
