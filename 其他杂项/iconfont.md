# iconfont 支持多色
    可通过symbol引入方式 实现多色图标引用，此方式使用svg渲染，仅支持ie9+及现代浏览器。
    https://www.iconfont.cn/help/detail?helptype=code

# 使用symbol引入方式时 修改颜色
    直接修改颜色是不可以的
    操作步骤：
        1、在iconfont上使用批量去色，将颜色去掉（这一步实际上是去掉path的fill）
        2、通过css fill去填充颜色