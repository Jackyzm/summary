# file-loader 与 url-loader

    file-loader
    file-loader 返回的是图片的url

    url-loader
    url-loader 可以通过limit属性对图片分情况处理，当图片小于limit（单位：byte）大小时转base64，大于limit时调用file-loader对图片进行处理。

    相同点：都是在webpack中处理图片、字体图标等文件。

    关系：url-loader封装了file-loader，但url-loader并不依赖于file-loader。

# webpack 优化

    优化构建大小
        1、开启production
        2、开启压缩
        3、分模块打包
        4、删除console等 不必要的代码
        5、静态资源cdn加速
        6、多页面应用提取公共部分
    优化构建速度
        1、开启cache
        2、抽离静态依赖 如react、react-dom
        3、resolve字段告诉webpack怎么去搜索文件

    分析工具 webpack-bundle-analyzer

## 写个 babel

```sh
const babel = require('@babel/core');
const types = require('@babel/types');
const fs = require('fs');

const result = babel.transformFileSync('conversion.js', {
    plugins: [
        {
            visitor: {
                // 变量声明
                // https://github.com/benjamn/ast-types/blob/master/gen/namedTypes.ts
                Declaration(path, state) {
                    // console.log(path.node.kind);
                    path.node.kind = 'var';
                },
                ImportDeclaration(path, state) {
                    // console.log(path.node);
                    if (path.node.source.value !== 'lodash') return;
                    let node = path.node;
                    let { specifiers } = node; // 导入的包的说明符 是个数组集合
                    // 如果使用全量引入 则不管
                    if (specifiers[0].type !== 'ImportDefaultSpecifier') {
                        const newImports = specifiers.map((item) => {
                            // console.log(item);
                            // 创建一个import AST树
                            // https://babeljs.io/docs/en/babel-types#importdeclaration
                            // types.importDeclaration(specifiers, source);
                            // specifiers: Array
                            // source: StringLiteral (required)
                            // StringLiteral: AST Node StringLiteral shape:
                            return types.importDeclaration([types.ImportDefaultSpecifier(item.local)], types.stringLiteral(`lodash/${item.imported.name}`))
                        });
                        // 将原有语句写法替换掉
                        path.replaceWithMultiple(newImports);
                    }
                }
            }
        }
    ]
});
fs.writeFileSync('./build.js', result.code);
```
