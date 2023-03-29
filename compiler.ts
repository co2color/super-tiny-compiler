import { tokenizer } from './tokenizer'
import { parser } from './parser'
import { transformer } from './transformer'
import { codeGenerator } from './codeGenerator'
export function compiler(code: string) {
  const tokens = tokenizer(code)
  const ast = parser(tokens)
  const transformedAst = transformer(ast)
  return codeGenerator(transformedAst)
}
