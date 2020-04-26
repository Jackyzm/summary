# file-loader 与 url-loader
    file-loader
    file-loader 返回的是图片的url

    url-loader
    url-loader 可以通过limit属性对图片分情况处理，当图片小于limit（单位：byte）大小时转base64，大于limit时调用file-loader对图片进行处理。

    相同点：都是在webpack中处理图片、字体图标等文件。

    关系：url-loader封装了file-loader，但url-loader并不依赖于file-loader。
