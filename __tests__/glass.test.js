const { Figure } = require('../figure')
const {
  rotateGlass,
  hasBordersCollision,
  hasFiguresCollision,
  addFigure,
  closedCellsCount,
  linesWillBeRemoved,
  removeLines
} = require('../glass')

describe('glass', () => {
  let emptyGlass = rotateGlass(`
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
`)
  let center = { x: 4, y: 9 }

  describe('#hasBordersCollision', () => {
    Object.keys(Figure).forEach(figure => {
      describe(`figure "${figure}"`, () => {
        let hasFigureBordersCollision = hasBordersCollision(figure)

        it('should return false if all figure cells fits the glass', () =>
          expect(hasFigureBordersCollision({ ...center, rotation: 0 })).toBe(
            false
          ))

        it('should detect collisions in bottom left corner', () =>
          expect(hasFigureBordersCollision({ x: 0, y: 0, rotation: 0 })).toBe(
            true
          ))

        it('should detect collisions in bottom right corner', () =>
          expect(hasFigureBordersCollision({ x: 9, y: 0, rotation: 0 })).toBe(
            true
          ))

        if (figure !== Figure.O) {
          it('should detect collisions in top left corner', () =>
            expect(
              hasFigureBordersCollision({ x: 0, y: 19, rotation: 0 })
            ).toBe(true))
        }

        it('should detect collisions in top right corner', () =>
          expect(hasFigureBordersCollision({ x: 9, y: 19, rotation: 0 })).toBe(
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

  describe('#addFigure', () => {
    it('should add figure correctly', () => {
      let newGlass = addFigure(emptyGlass, 'O', { x: 0, y: 1, rotation: 0 })

      expect(newGlass).toBe(
        rotateGlass(`
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
**        
**        
`)
      )

      newGlass = addFigure(newGlass, 'I', { x: 3, y: 0, rotation: 3 })

      expect(newGlass).toBe(
        rotateGlass(`
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
**        
******    
`)
      )

      newGlass = addFigure(newGlass, 'J', { x: 9, y: 1, rotation: 0 })

      expect(newGlass).toBe(
        rotateGlass(`
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
         *
**       *
******  **
`)
      )
    })
  })

  describe('#closedCellsCount', () => {
    it('should return 0 for empty glass', () => {
      expect(closedCellsCount(emptyGlass)).toBe(0)
    })

    it('should count closed cells', () => {
      expect(
        closedCellsCount(
          rotateGlass(`
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
**  *  *  
  ** ** **
`)
        )
      ).toBe(4)

      expect(
        closedCellsCount(
          rotateGlass(`
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
** ****** 
 *****  * 
** *** ***
`)
        )
      ).toBe(5)
    })
  })

  describe('#linesWillBeRemoved', () => {
    it('should return 0 for empty glass', () =>
      expect(linesWillBeRemoved(emptyGlass)).toBe(0))

    it('should count lines to remove', () => {
      expect(
        linesWillBeRemoved(
          rotateGlass(`
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
**********
**********
`)
        )
      ).toBe(2)

      expect(
        linesWillBeRemoved(
          rotateGlass(`
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
**********
***  *****
**********
****** ***
`)
        )
      ).toBe(2)
    })
  })

  describe('#removeLines', () => {
    it('should leave empty glass as it was', () =>
      expect(removeLines(emptyGlass)).toBe(emptyGlass))

    it('should clear full glass', () =>
      expect(
        removeLines(
          rotateGlass(`
**********
**********
**********
**********
**********
**********
**********
**********
**********
**********
**********
**********
**********
**********
**********
**********
**********
**********
**********
**********
`)
        )
      ).toBe(emptyGlass))

    it('should remove lines correctly', () => {
      expect(
        removeLines(
          rotateGlass(`
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
         *
**********
******  **
`)
        )
      ).toBe(
        rotateGlass(`
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
         *
******  **
`)
      )
    })
  })
})
