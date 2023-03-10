import { test, expect } from 'vitest'
import { tokenizer, TokenTypes } from './tokenizer'

test('tokenizer', () => {
  const code = `(add 2 (subtract 4 2))`
  const tokens = [
    { type: TokenTypes.Paren, value: '(' },
    { type: TokenTypes.Name, value: 'add' },
    { type: TokenTypes.Number, value: '2' },
    { type: TokenTypes.Paren, value: '(' },
    { type: TokenTypes.Name, value: 'subtract' },
    { type: TokenTypes.Number, value: '4' },
    { type: TokenTypes.Number, value: '2' },
    { type: TokenTypes.Paren, value: ')' },
    { type: TokenTypes.Paren, value: ')' },
  ]

  expect(tokenizer(code)).toEqual(tokens)
})
