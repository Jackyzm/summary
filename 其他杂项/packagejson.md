# scripts中设置环境变量
    例："start": "ENV_NAME=uat yarn start"
    在mac上可以直接这样写，但是windows上会报错
    兼容写法：引入cross-env库  通过 cross-env 添加环境变量：
    "start": "cross-env ENV_NAME=uat yarn start"