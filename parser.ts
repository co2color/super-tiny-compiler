import { Token, TokenTypes } from './tokenizer'

export enum NodeTypes {
  Root,
  Number,
  CallExpression,
}

interface Node {
  type: NodeTypes
}

type ChildNode = NumberNode | CallExpressionNode

interface RootNode extends Node {
  body: ChildNode[]
}

interface NumberNode extends Node {
  value: string
}
interface CallExpressionNode extends Node {
  name: string
  params: ChildNode[]
}

function createRootNode(): RootNode {
  return {
    type: NodeTypes.Root,
    body: [],
  }
}

function createNumberNode(value: string): NumberNode {
  return {
    type: NodeTypes.Number,
    value,
  }
}
function createCallExpressionNode(name: string): CallExpressionNode {
  return {
    type: NodeTypes.CallExpression,
    name,
    params: [],
  }
}

// tokens => ast
export function parser(tokens: Token[]) {
  let current = 0
  const rootNode = createRootNode()

  function walk() {
    let token = tokens[current]

    if (token.type === TokenTypes.Number) {
      current++
      return createNumberNode(token.value)
    }

    if (token.type === TokenTypes.Paren && token.value === '(') {
      token = tokens[++current]
      const node = createCallExpressionNode(token.value)// add
      token = tokens[++current]
      while (!(token.type === TokenTypes.Paren && token.value === ')')) {
        //如果是数字、左括号等等，就会继续递归，
        // 直到遇到右括号，那么就会返回一个CallExpressionNode，return这个node，把这个node挂载到root上
        const walkNode = walk()
        node.params.push(walkNode)
        token = tokens[current]
      }
      current++
      return node
    }

    throw new Error("I don't know what this token is: " + token)
  }

  rootNode.body.push(walk())

  while (current < tokens.length) {
    const outWalkNode = walk()
    rootNode.body.push(outWalkNode)
  }

  return rootNode
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
