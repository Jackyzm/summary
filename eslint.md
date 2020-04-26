# 规则 "linebreak-style": ["error", "unix"]
    window 系统中 git 在 checkout 文件时会把换行符 LF 转换为 CRLF， 但在提交时，会把换行符保存为 LF。如果配置了了 "unix" 设置，这将导致 linebreak-style 规则报告错误，因为 ESLint 检测到的是 CRLF。

## 解决办法
    1、使用eslint --fix 可以修复（不推荐，再次提交又会有这个问题）
    2、在跟目录下添加文件 .gitattributes 内容 *.js text eol=lf