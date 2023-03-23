import { RootNode } from './ast'

export function transformer(node: RootNode) {
  const visitor = {
    NumberLiteral: {
      enter(node: any) {
        return {
          type: 'NumberLiteral',
          value: node.value,
        }
      },
    },
    StringLiteral: {
      enter(node: any) {
        return {
          type: 'StringLiteral',
          value: node.value,
        }
      },
    },
    CallExpression: {
      enter(node: any) {
        return {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: node.name,
          },
          arguments: node.params.map((param: any) => {
            return visitor[param.type].enter(param)
          }),
        }
      },
    },
    Program: {
      enter(node: any) {
        return {
          type: 'Program',
          body: node.body.map((bodyNode: any) => {
            return visitor[bodyNode.type].enter(bodyNode)
          }),
        }
      },
    },
  }
  return visitor[node.type].enter(node)
}
