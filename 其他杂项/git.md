# Git如何切换远程仓库地址
    git 仓库修改

## 一、修改命令
    git remote set-url origin url

## 二、先删后加
    git remote rm origin
    git remote add origin git@github.com:demo.git

# 使用husky进行代码提交前的eslint检测
    在package.json中添加以下代码：
        ...
        "husky": {
            "hooks": {
                "pre-commit": "eslint . --fix"
            }
        },
        ...


# git 文件名大小写不敏感 

    仅更改当前项目
        git config core.ignorecase false

    全局更改
        git config --global core.ignorecase true
