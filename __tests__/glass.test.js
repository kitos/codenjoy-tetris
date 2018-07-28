const {
  rotateGlass,
  addFigure,
  closedCellsCount,
  linesWillBeRemoved,
  removeLines
} = require('../glass')

describe('glass', () => {
  let emptyGlass = rotateGlass(`
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
`)

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
