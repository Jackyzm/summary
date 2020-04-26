# react ssr 
## react + antd 
### 坑1: babel

    {
        "presets": [
            "next/babel"
        ],
        "plugins": [
            [
                "import",
                {
                    "libraryName": "antd",
                    "style": "less"
                }
            ]
        ]
    }

### 坑2: less 配置

    见 next.config 与 antd.config