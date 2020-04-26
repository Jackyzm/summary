# ant-design 搭配css modules
    antdTheme 可覆盖ant less变量 可不设置
    在webpack中添加
        {
            test: /\.less$/,
            exclude: /node_modules/,
            use: [
                ...,
                {
                    loader: require.resolve('css-loader'),
                    options: {
                        modules: true,
                    }
                },
                ...,
                {
                    loader: require.resolve('less-loader'),
                    options: {
                        javascriptEnabled: true,
                        modifyVars: antdTheme
                    }
                }
            ]
        },
        // less antd 避免css modules
        {
            test: /\.less$/,
            include: /node_modules/,
            use: [
                ...,
                {
                    loader: require.resolve('less-loader'),
                    options: {
                        javascriptEnabled: true,
                        modifyVars: antdTheme
                    }
                }
            ]
        },

# ant-design icons 3.9.0之后 全量svg引入导致打包太大问题
    解决办法：
    webpack config.alias 添加 '@ant-design/icons/lib/dist$': path.resolve(__dirname, '../src/icons.js')

    在src下新建icons.js文件 内容如下
        // export what you need
        export {
            default as MobileOutline
        } from '@ant-design/icons/lib/outline/MobileOutline';

        export {
            default as MessageOutline
        } from '@ant-design/icons/lib/outline/MessageOutline';

    在antd 4以后的版本将icon单独成另一个依赖包，不会存在这个问题了；