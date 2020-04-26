# iconfont 使用
    在目录下新增react-native.config.js文件
    module.exports = { assets: ['./src/assets/fonts/']};

# android 真机调试坑
    1、在真机上 release 与 debug 只能存在一个 安装之前需要先删除另一个版本 不会自动删除 会报错
    2、gradle可能有网络问题
        在build.grable中 
            allprojects {
                repositories {
                    mavenLocal()
                    maven {
                        // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
                        url("$rootDir/../node_modules/react-native/android")
                    }
                    maven {
                        // Android JSC is installed from npm
                        url("$rootDir/../node_modules/jsc-android/dist")
                    }

                    google()
                    jcenter()
                    // maven库
                    def cn = "http://maven.aliyun.com/nexus/content/groups/public/"
                    def abroad = "http://central.maven.org/maven2/"
                    // 先从url中下载jar若没有找到，则在artifactUrls中寻找
                    maven {
                        url cn
                        artifactUrls abroad
                    }
                    // maven { url 'https://jitpack.io' }
                }
            }

# pod install 网络问题
更换清华源
https://mirrors.tuna.tsinghua.edu.cn/help/CocoaPods/


CocoaPods 镜像使用帮助
CocoaPods 是一个 Cocoa 和 Cocoa Touch 框架的依赖管理器，具体原理和 Homebrew 有点类似，都是从 GitHub 下载索引，然后根据索引下载依赖的源代码。

对于旧版的 CocoaPods 可以使用如下方法使用 tuna 的镜像：

```sh
$ pod repo remove master
$ pod repo add master https://mirrors.tuna.tsinghua.edu.cn/git/CocoaPods/Specs.git
$ pod repo update
```
新版的 CocoaPods 不允许用pod repo add直接添加master库了，但是依然可以：

```sh
$ cd ~/.cocoapods/repos 
$ pod repo remove master
$ git clone https://mirrors.tuna.tsinghua.edu.cn/git/CocoaPods/Specs.git master
```
最后进入自己的工程，在自己工程的podFile第一行加上：

source 'https://mirrors.tuna.tsinghua.edu.cn/git/CocoaPods/Specs.git'