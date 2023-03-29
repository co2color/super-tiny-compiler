export function codeGenerator(node) {
  switch (node.type) {
    case 'Program':
      return node.body.map(codeGenerator).join('')
    case 'ExpressionStatement':
      return codeGenerator(node.expression) + ';'
    case 'NumberLiteral':
      return node.value
    case 'CallExpression':
      return (
        node.callee.name +
        '(' +
        node.arguments.map(codeGenerator).join(', ') +
        ')'
      )
  }
}
