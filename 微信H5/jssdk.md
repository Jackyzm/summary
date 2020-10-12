# 使用jssdk
    步骤一：绑定域名
    先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。

    ⚠️ 特别注意： 只能是域名 ip不行 ！！！
    ⚠️ 特别注意： 只能是域名 ip不行 ！！！
    ⚠️ 特别注意： 只能是域名 ip不行 ！！！

    备注：登录后可在“开发者中心”查看对应的接口权限。


    步骤二：引入JS文件
    在需要调用JS接口的页面引入如下JS文件，（支持https）：http://res.wx.qq.com/open/js/jweixin-1.6.0.js

    如需进一步提升服务稳定性，当上述资源不可访问时，可改访问：http://res2.wx.qq.com/open/js/jweixin-1.6.0.js （支持https）。

    备注：支持使用 AMD/CMD 标准模块加载方法加载


    步骤三：通过config接口注入权限验证配置
    所有需要使用JS-SDK的页面必须先注入配置信息，否则将无法调用；

    wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: '', // 必填，公众号的唯一标识
        timestamp: , // 必填，生成签名的时间戳
        nonceStr: '', // 必填，生成签名的随机串
        signature: '',// 必填，签名
        jsApiList: [] // 必填，需要使用的JS接口列表
    });

    wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
        wx.updateAppMessageShareData({ 
            title: '', // 分享标题
            desc: '', // 分享描述
            link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: '', // 分享图标
            success: function () {
                // 设置成功
            }
        })
    }); 



    注：在项目入口使用一次即可  分享的链接必须与 “步骤一：绑定域名”中绑定的域名一致  并且与获取“signature”时传递的url一致

    前端需要用js获取当前页面除去'#'hash部分的链接（可用location.href.split('#')[0]获取,而且需要 encodeURIComponent ）