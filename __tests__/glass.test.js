const { rotateGlass, addFigure } = require('../glass')

describe('glass', () => {
  describe('#addFigure', () => {
    let emptyGlass = rotateGlass(`
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
`)

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
})
