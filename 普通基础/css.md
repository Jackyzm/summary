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