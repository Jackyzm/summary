# 超出部分省略号
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    // 两行或多行
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;（行数）
    -webkit-box-orient: vertical;

# calc +/- 左右必须有空格
    width: calc(100% - 10px);
    
    
# table-layout

    https://developer.mozilla.org/zh-CN/docs/Web/CSS/table-layout
    fixed
        表格和列的宽度通过表格的宽度来设置，某一列的宽度仅由该列首行的单元格决定。在当前列中，该单元格所在行之后的行并不会影响整个列宽。

        使用 “fixed” 布局方式时，整个表格可以在其首行被下载后就被解析和渲染。这样对于 “automatic” 自动布局方式来说可以加速渲染，但是其后的单元格内容并不会自适应当前列宽。任何一个包含溢出内容的单元格可以使用 overflow  属性控制是否允许内容溢出。
