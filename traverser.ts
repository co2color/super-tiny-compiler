import { ChildNode, NodeTypes, RootNode, CallExpressionNode } from './ast'

type ParentNode = RootNode | CallExpressionNode | undefined
type MethodFn = (node: RootNode | ChildNode, parent: ParentNode) => void
interface VisitorOption {
  enter: MethodFn
  exit?: MethodFn
}
export interface Visitor {
  Program?: VisitorOption
  NumberLiteral?: VisitorOption
  CallExpression?: VisitorOption
  StringLiteral?: VisitorOption
}
export function traverser(rootNode: RootNode, visitor: Visitor) {

  // 遍历树 深度优先搜索
  function traverArray(array: ChildNode[], parent: ParentNode) {
    array.forEach((node) => {
      traverNode(node, parent)
    })
  }

  function traverNode(node: RootNode | ChildNode, parent?: ParentNode) {

    // enter
    const methods = visitor[node.type]
    if (methods) {
      methods.enter(node, parent)
    }

    switch (node.type) {
      case NodeTypes.Program:
        traverArray(node.body, node)
        break
      case NodeTypes.CallExpression:
        traverArray(node.params, node)
        break
      case NodeTypes.NumberLiteral:
        break
      default:
        break
    }

    // exit
    if (methods && methods.exit) {
      methods.exit(node, parent)
    }

  }
  
  traverNode(rootNode)
  
}




// 下面给个深度优先遍历的最简例子
const tree = {
  value: 'A',
  children: [
    {
      value: 'B',
      children: [
        {
          value: 'D',
          children: [],
        },
        {
          value: 'E',
          children: [],
        },
      ],
    },
    {
      value: 'C',
      children: [
        {
          value: 'F',
          children: [],
        },
        {
          value: 'G',
          children: [],
        },
      ],
    },
  ],
}

function depthFirstTraversal(node) {
  console.log(node.value);
  node.children.forEach(child => {
    depthFirstTraversal(child);
  });
}
/*
下面我们以输入 depthFirstTraversal(tree) 为例，来详细讲解一下递归流程：

首先遍历根节点 A，打印它的值
对于根节点的第一个子节点 B，递归调用 depthFirstTraversal 函数，进入下一层递归流程
在第二层递归中，首先遍历节点 B，打印它的值
对于节点 B 的第一个子节点 D，递归调用 depthFirstTraversal 函数，进入下一层递归流程
在第三层递归中，首先遍历节点 D，打印它的值
节点 D 没有子节点，递归流程结束，返回到第二层递归
对于节点 B 的第二个子节点 E，递归调用 depthFirstTraversal 函数，进入下一层递归流程
在第三层递归中，首先遍历节点 E，打印它的值
节点 E 没有子节点，递归流程结束，返回到第二层递归
第二层递归结束，返回到第一层递归
对于根节点的第二个子节点 C，递归调用 depthFirstTraversal 函数，进入下一层递归流程
在第二层递归中，首先遍历节点 C，打印它的值
对于节点 C 的第一个子节点 F，递归调用 depthFirstTraversal 函数，进入下一层递归流程
在第三层递归中，首先遍历节点 F，打印它的值
节点 F 没有子节点，递归流程结束，返回到第二层递归
对于节点 C 的第二个子节点 G，递归调用 depthFirstTraversal 函数，进入下一层递归流程
在第三层递归中，首先遍历节点 G，打印它
*/

