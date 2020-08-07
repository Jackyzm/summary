# 使用stomp协议
```sh
import { Stomp } from 'path/stomp';

wx.connectSocket({
    url: 'ws://xxx',
    header: {
        'content-type': 'application/json',
        Authorization: `Bearer xxx`
    }
});

let socketOpen = false;
let socketMsgQueue = [];
function sendSocketMessage(msg) {
    // console.log('send msg:', msg);
    if (socketOpen) {
        wx.sendSocketMessage({ data: msg });
    } else {
        socketMsgQueue.push(msg);
    }
}
const ws = {
    send: sendSocketMessage,
    onopen: null,
    onmessage: null
};

wx.onSocketOpen(() => {
    console.log('WebSocket连接已打开！');

    socketOpen = true;
    // 默认如果有消息就发出去
    for (let i = 0; i < socketMsgQueue.length; i++) {
        sendSocketMessage(socketMsgQueue[i]);
    }
    socketMsgQueue = [];
    if (ws.onopen) ws.onopen();
});

wx.onSocketMessage((res) => {
    // console.log('收到onmessage事件:', res);
    if (ws.onmessage) ws.onmessage(res);
});

Stomp.setInterval = setInterval;
Stomp.clearInterval = clearInterval;
const client = Stomp.over(ws);
const destination = '/xxx';

client.connect({}, () => {
    // 订阅消息
    client.subscribe(destination, ({ body = '{}' }) => {
        const { xxx } = JSON.parse(body);
        // console.log('From MQ:', body, headers);
    });
    // 发送消息
    client.send('/xxx', { }, 'hello world !');
}, (err) => {
    console.log(err);
});
// 放到this里面 以便后续业务代码可以通过client send发送消息
this.client = client;


 wx.onSocketError((err) => {
    console.log(err, 'err');
});

wx.onSocketClose(({ code }) => {
    // console.log(code);
    // 主动关闭/退出页面
    if (code === 1005 || code === 1000) return;
    this.setData({ showPay: false });
    wx.showModal({
        title: '提示',
        content: '网络异常，请刷新后重试',
        showCancel: false
    });
});
```