// 功能：解析ES6-->ast--->生成ES5代码
const fs = require('fs')
const babylon = require('babylon')
const traverse = require('babel-traverse').default
const { transformFromAst } = require('babel-core')
module.exports = {
  // 解析es6为ast
  getAST: (path) => {
    const source = fs.readFileSync(path, 'utf-8')
    return babylon.parse(source, {
      sourceType: 'module'
    })
  },
  // 分析依赖
  getDependencies: (ast) => {
    const dependencies = []
    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        dependencies.push(node.source.value)
      }
    })
    return dependencies
  },
  // 将ast转换为源码
  transform: (ast) => {
    const {code } = transformFromAst(ast, null, {
      presets: ['env']
    })
    return code
  }
}