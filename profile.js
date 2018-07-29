const { rotateGlass } = require('./glass')
const { findBestSolution } = require('./strategy')

let figure = 'L'
let nextFigures = ['I', 'I']
let glass = rotateGlass(`
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
 ******** 
 ******** 
 ******** 
`)

console.time('TOTAL')
let bs = findBestSolution(figure, glass, nextFigures)
console.timeEnd('TOTAL')


console.log(bs)
