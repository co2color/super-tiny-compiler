import {
  createRootNode,
  createStringLiteralNode,
  createNumberLiteralNode,
  createCallExpression,
} from './ast'
import { Token, TokenTypes } from './tokenizer'

export function parser(tokens: Token[]) {
  const root = createRootNode()

  let current = 0

  function walk() {
    let token = tokens[current]

    if (token.type === TokenTypes.Number) {
      current++

      return createNumberLiteralNode(token.value)
    }

    if (token.type === TokenTypes.String) {
      current++

      return createStringLiteralNode(token.value)
    }

    if (token.type === TokenTypes.Paren && token.value === '(') {
      token = tokens[++current]

      let node = createCallExpression(token.value)

      // 上一个 token 已经使用完了  所以我们还需要在移动下位置
      token = tokens[++current]
      // params
      while (
        // token.type !== TokenType.paren ||
        // (token.type === TokenType.paren && token.value !== ")")
        !(token.type === TokenTypes.Paren && token.value === ')')
      ) {
        node.params.push(walk())
        token = tokens[current]
      }

      // 跳过 )
      current++

      return node
    }

    throw new Error(`识别不了的 token: ${token}`)
  }

  while (current < tokens.length) {
    root.body.push(walk())
  }

  return root
}

/*
  其实如果你的递归水平不错， 就不需要看下面的分析了，直接看上面代码就行了，下面的内容就是讲述这个递归思路的。
  对于这个测试用例tokens:
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
  首先执行rootNode.body.push(walk())，我们把这个walk叫做walk1
  执行walk1，里面创建一个createCallExpressionNode('add')，我们叫他AddNode
  AddNode的params会push一个NumberNode('2')，此时AddNode.params长度为1；
  然后继续while，继续while的话，因为紧接着就是左括号（token[3]），所以又会创建一个walk叫做walk2
  这个walk2的返回结果要被push到AddNode.params里面，也就是被push到NumberNode('2')后面，使AddNode.params长度为2
  
  因此我们要看看walk2到底返回什么东西后，才能push到AddNode.params里面，使得其长度为2:
    walk2中，会创建一个新的createCallExpressionNode('subtract')，我们叫他SubtractNode
    SubtractNode的params会push一个NumberNode('4')和一个NumberNode('2')
    所以walk2就返回SubtractNode(NumberNode(4),NumberNode(2))，把结果push到AddNode.params里面
因此walk1就返回AddNode(NumberNode(2),SubtractNode(NumberNode(4),NumberNode(2)))，然后walk1就结束了
用表达式就是：( 2 + ( 4 - 2 ) )
然后解释一下最下面的while（可参考test中的'two callExpression'）:
  while (current < tokens.length) {
    const outWalkNode = walk()
    rootNode.body.push(outWalkNode)
  }
这段代码是为了处理多个表达式的情况，比如：
( ( 2 + 4 ) (3 + 5 ) )
如果遇到了，就重复上面的过程，把结果push到rootNode.body里面，最后返回rootNode
*/

