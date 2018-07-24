const { replaceWith } = require('../string')

describe('string', () => {
  describe('#replaceWith', () => {
    it('should replace string correctly', () => {
      expect(replaceWith('1234', 'aa', 0, 2)).toBe('aa34')
      expect(replaceWith('1234', 'aa', 1, 2)).toBe('1aa4')
      expect(replaceWith('1234', 'aa', 2, 2)).toBe('12aa')
    })

    it('should use replacement length by default', () => {
      expect(replaceWith('1234', 'aa', 0)).toBe('aa34')
      expect(replaceWith('1234', 'aa', 1)).toBe('1aa4')
      expect(replaceWith('1234', 'aa', 2)).toBe('12aa')
    })
  })
})
