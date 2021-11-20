// 功能：执行模块构建、文件输出
const { getAST, getDependencies, transform } = require('./parser')
const path = require('path')
const fs = require('fs')

module.exports = class Compiler {
  constructor(options) {
    const { entry, output } = options
    this.entry = entry
    this.output = output
    this.modules = []
  }
  // 执行入口
  run () {
    const entryModule = this.buildModule(this.entry, true)
    this.modules.push(entryModule)
    this.modules.map((_module) => {
      _module.dependencies.map((dependency) => {
        this.modules.push(this.buildModule(dependency))
      })
    })
    this.emitFiles();
    // console.log(this.modules)
  }
  // 构建模块
  buildModule (filename, isEntry) {
    let ast;
    if (isEntry) {
      ast = getAST(filename)
    } else {
      // 处理相对路径为绝对路径
      const absolutePath = path.resolve(process.cwd(), './src', filename)
      ast = getAST(absolutePath)
    }
    return {
      filename,
      dependencies: getDependencies(ast),
      source: transform(ast)
    }
  }
  // 输出文件
  emitFiles () {
    const outputPath = path.join(this.output.path, this.output.filename);
    let modules = '';
    this.modules.map((_module) => {
      modules += `'${_module.filename}': function (require, module, exports) { ${_module.transformCode} },`
    });

    const bundle = `
        (function(modules) {
            function require(fileName) {
                const fn = modules[fileName];

                const module = { exports : {} };

                fn(require, module, module.exports);

                return module.exports;
            }

            require('${this.entry}');
        })({${modules}})
    `;

    fs.writeFileSync(outputPath, bundle, 'utf-8');
  }
}