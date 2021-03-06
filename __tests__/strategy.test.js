const {
  isEqSolutions,
  findBestSolution
} = require('../strategy')
const { Figure } = require('../figure')
const { rotateGlass, addFigure } = require('../glass')

describe('strategy', () => {
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
