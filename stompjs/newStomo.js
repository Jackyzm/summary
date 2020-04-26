const __hasProp = {}.hasOwnProperty;
const __slice = [].slice;

const Byte = {
    LF: '\x0A',
    NULL: '\x00'
};

const unmarshallSingle = function (data) {
    let body; let chr; let command; let divider; let headerLines; let headers; let i; let idx; let len; let line; let start; let trim; let _i; let _j; let _len; let _ref; let
        _ref1;
    divider = data.search(RegExp(`${Byte.LF}${Byte.LF}`));
    headerLines = data.substring(0, divider).split(Byte.LF);
    command = headerLines.shift();
    headers = {};
    trim = function (str) {
        return str.replace(/^\s+|\s+$/g, '');
    };
    _ref = headerLines.reverse();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        idx = line.indexOf(':');
        headers[trim(line.substring(0, idx))] = trim(line.substring(idx + 1));
    }
    body = '';
    start = divider + 2;
    if (headers['content-length']) {
        len = parseInt(headers['content-length']);
        body = (`${data}`).substring(start, start + len);
    } else {
        chr = null;
        for (i = _j = start, _ref1 = data.length; start <= _ref1 ? _j < _ref1 : _j > _ref1; i = start <= _ref1 ? ++_j : --_j) {
            chr = data.charAt(i);
            if (chr === Byte.NULL) {
                break;
            }
            body += chr;
        }
    }
    return new Frame(command, headers, body);
};

class Frame {
    constructor(command, headers, body) {
        this.command = command;
        this.headers = headers != null ? headers : {};
        this.body = body != null ? body : '';

        this.toString = function () {
            let lines; let name; let skipContentLength; let value; let
                _ref;
            lines = [this.command];
            skipContentLength = this.headers['content-length'] === false;
            if (skipContentLength) {
                delete this.headers['content-length'];
            }
            _ref = this.headers;
            for (name in _ref) {
                if (!__hasProp.call(_ref, name)) continue;
                value = _ref[name];
                lines.push(`${name}:${value}`);
            }
            if (this.body && !skipContentLength) {
                lines.push(`content-length:${Frame.sizeOfUTF8(this.body)}`);
            }
            lines.push(Byte.LF + this.body);
            return lines.join(Byte.LF);
        };
    }
}

Frame.sizeOfUTF8 = function (s) {
    if (s) {
        return encodeURI(s).match(/%..|./g).length;
    }
    return 0;
};

Frame.unmarshall = function (datas) {
    let data;
    return (function () {
        let _i; let _len; let _ref; let
            _results;
        _ref = datas.split(RegExp(`${Byte.NULL}${Byte.LF}*`));
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            data = _ref[_i];
            if ((data != null ? data.length : void 0) > 0) {
                _results.push(unmarshallSingle(data));
            }
        }
        return _results;
    }());
};

Frame.marshall = function (command, headers, body) {
    let frame;
    frame = new Frame(command, headers, body);
    return frame.toString() + Byte.NULL;
};


const now = function () {
    if (Date.now) {
        return Date.now();
    }
    return new Date().valueOf;
};

class Client {
    constructor(ws) {
        this.ws = ws;
        this.ws.binaryType = 'arraybuffer';
        this.counter = 0;
        this.connected = false;
        this.heartbeat = {
            outgoing: 10000,
            incoming: 10000
        };
        this.maxWebSocketFrameSize = 16 * 1024;
        this.subscriptions = {};

        this.debug = function (message) {
            let _ref;
            return typeof window !== 'undefined' && window !== null ? (_ref = window.console) != null ? _ref.log(message) : void 0 : void 0;
        };

        this._transmit = function (command, headers, body) {
            let out;
            out = Frame.marshall(command, headers, body);
            if (typeof this.debug === 'function') {
                this.debug(`>>> ${out}`);
            }
            while (true) {
                if (out.length > this.maxWebSocketFrameSize) {
                    this.ws.send(out.substring(0, this.maxWebSocketFrameSize));
                    out = out.substring(this.maxWebSocketFrameSize);
                    if (typeof this.debug === 'function') {
                        this.debug(`remaining = ${out.length}`);
                    }
                } else {
                    return this.ws.send(out);
                }
            }
        };

        this._transmit = function (command, headers, body) {
            let out = Frame.marshall(command, headers, body);
            if (typeof this.debug === 'function') {
                this.debug(`>>> ${out}`);
            }
            while (true) {
                if (out.length > this.maxWebSocketFrameSize) {
                    this.ws.send(out.substring(0, this.maxWebSocketFrameSize));
                    out = out.substring(this.maxWebSocketFrameSize);
                    if (typeof this.debug === 'function') {
                        this.debug(`remaining = ${out.length}`);
                    }
                } else {
                    return this.ws.send(out);
                }
            }
        };

        this._setupHeartbeat = function (headers) {
            let serverIncoming; let serverOutgoing; let ttl; let v; let _ref; let
                _ref1;
            if ((_ref = headers.version) !== Stomp.VERSIONS.V1_1 && _ref !== Stomp.VERSIONS.V1_2) {
                return;
            }
            _ref1 = (function () {
                let _i; let _len; let _ref1; let
                    _results;
                _ref1 = headers['heart-beat'].split(',');
                _results = [];
                for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                    v = _ref1[_i];
                    _results.push(parseInt(v));
                }
                return _results;
            }()), serverOutgoing = _ref1[0], serverIncoming = _ref1[1];
            if (!(this.heartbeat.outgoing === 0 || serverIncoming === 0)) {
                ttl = Math.max(this.heartbeat.outgoing, serverIncoming);
                if (typeof this.debug === 'function') {
                    this.debug(`send PING every ${ttl}ms`);
                }
                this.pinger = Stomp.setInterval(ttl, (function (_this) {
                    return function () {
                        _this.ws.send(Byte.LF);
                        return typeof _this.debug === 'function' ? _this.debug('>>> PING') : void 0;
                    };
                }(this)));
            }
            if (!(this.heartbeat.incoming === 0 || serverOutgoing === 0)) {
                ttl = Math.max(this.heartbeat.incoming, serverOutgoing);
                if (typeof this.debug === 'function') {
                    this.debug(`check PONG every ${ttl}ms`);
                }
                return this.ponger = Stomp.setInterval(ttl, (function (_this) {
                    return function () {
                        let delta;
                        delta = now() - _this.serverActivity;
                        if (delta > ttl * 2) {
                            if (typeof _this.debug === 'function') {
                                _this.debug(`did not receive server activity for the last ${delta}ms`);
                            }
                            return _this.ws.close();
                        }
                    };
                }(this)));
            }
        };

        this._parseConnect = function () {
            let connectCallback;
            let errorCallback;
            const args = arguments.length >= 1 ? __slice.call(arguments, 0) : [];
            let headers = {};
            switch (args.length) {
                case 2:
                    headers = args[0], connectCallback = args[1];
                    break;
                case 3:
                    if (args[1] instanceof Function) {
                        headers = args[0], connectCallback = args[1], errorCallback = args[2];
                    } else {
                        headers.login = args[0], headers.passcode = args[1], connectCallback = args[2];
                    }
                    break;
                case 4:
                    headers.login = args[0], headers.passcode = args[1], connectCallback = args[2], errorCallback = args[3];
                    break;
                default:
                    headers.login = args[0], headers.passcode = args[1], connectCallback = args[2], errorCallback = args[3], headers.host = args[4];
            }
            return [headers, connectCallback, errorCallback];
        };

        this.connect = function () {
            const args = arguments.length >= 1 ? __slice.call(arguments, 0) : [];
            const out = this._parseConnect.apply(this, args);
            const headers = out[0];
            this.connectCallback = out[1];
            const errorCallback = out[2];
            if (typeof this.debug === 'function') {
                this.debug('Opening Web Socket...');
            }

            this.ws.onmessage = (function (_this) {
                return function (evt) {
                    let arr; let c; let client; let data; let frame; let messageID; let onreceive; let subscription; let _i; let _len; let _ref; let
                        _results;
                    data = typeof ArrayBuffer !== 'undefined' && evt.data instanceof ArrayBuffer ? (arr = new Uint8Array(evt.data), typeof _this.debug === 'function' ? _this.debug(`--- got data length: ${arr.length}`) : void 0, ((function () {
                        let _i; let _len; let
                            _results;
                        _results = [];
                        for (_i = 0, _len = arr.length; _i < _len; _i++) {
                            c = arr[_i];
                            _results.push(String.fromCharCode(c));
                        }
                        return _results;
                    })()).join('')) : evt.data;
                    _this.serverActivity = now();
                    if (data === Byte.LF) {
                        if (typeof _this.debug === 'function') {
                            _this.debug('<<< PONG');
                        }
                        return;
                    }
                    if (typeof _this.debug === 'function') {
                        _this.debug(`<<< ${data}`);
                    }
                    _ref = Frame.unmarshall(data);
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        frame = _ref[_i];
                        console.log(frame);
                        switch (frame.command) {
                            case 'CONNECTED':
                                if (typeof _this.debug === 'function') {
                                    _this.debug(`connected to server ${frame.headers.server}`);
                                }
                                _this.connected = true;
                                _this._setupHeartbeat(frame.headers);
                                _results.push(typeof _this.connectCallback === 'function' ? _this.connectCallback(frame) : void 0);
                                break;
                            case 'MESSAGE':
                                subscription = frame.headers.subscription;
                                onreceive = _this.subscriptions[subscription] || _this.onreceive;
                                if (onreceive) {
                                    client = _this;
                                    messageID = frame.headers['message-id'];
                                    frame.ack = function (headers) {
                                        if (headers == null) {
                                            headers = {};
                                        }
                                        return client.ack(messageID, subscription, headers);
                                    };
                                    frame.nack = function (headers) {
                                        if (headers == null) {
                                            headers = {};
                                        }
                                        return client.nack(messageID, subscription, headers);
                                    };
                                    _results.push(onreceive(frame));
                                } else {
                                    _results.push(typeof _this.debug === 'function' ? _this.debug(`Unhandled received MESSAGE: ${frame}`) : void 0);
                                }
                                break;
                            case 'RECEIPT':
                                _results.push(typeof _this.onreceipt === 'function' ? _this.onreceipt(frame) : void 0);
                                break;
                            case 'ERROR':
                                _results.push(typeof errorCallback === 'function' ? errorCallback(frame) : void 0);
                                break;
                            default:
                                _results.push(typeof _this.debug === 'function' ? _this.debug(`Unhandled frame: ${frame}`) : void 0);
                        }
                    }
                    return _results;
                };
            }(this));
            this.ws.onclose = (function (_this) {
                return function () {
                    let msg;
                    msg = `Whoops! Lost connection to ${_this.ws.url}`;
                    if (typeof _this.debug === 'function') {
                        _this.debug(msg);
                    }
                    _this._cleanUp();
                    return typeof errorCallback === 'function' ? errorCallback(msg) : void 0;
                };
            }(this));
            return this.ws.onopen = (function (_this) {
                return function () {
                    if (typeof _this.debug === 'function') {
                        _this.debug('Web Socket Opened...');
                    }
                    headers['accept-version'] = Stomp.VERSIONS.supportedVersions();
                    headers['heart-beat'] = [_this.heartbeat.outgoing, _this.heartbeat.incoming].join(',');
                    return _this._transmit('CONNECT', headers);
                };
            }(this));
        };

        this.disconnect = function (disconnectCallback, headers) {
            if (headers == null) {
                headers = {};
            }
            this._transmit('DISCONNECT', headers);
            this.ws.onclose = null;
            this.ws.close();
            this._cleanUp();
            return typeof disconnectCallback === 'function' ? disconnectCallback() : void 0;
        };

        this._cleanUp = function () {
            this.connected = false;
            if (this.pinger) {
                Stomp.clearInterval(this.pinger);
            }
            if (this.ponger) {
                return Stomp.clearInterval(this.ponger);
            }
        };

        this.send = function (destination, headers, body) {
            if (headers == null) {
                headers = {};
            }
            if (body == null) {
                body = '';
            }
            headers.destination = destination;
            return this._transmit('SEND', headers, body);
        };
        this.subscribe = function (destination, callback, headers) {
            let client;
            if (headers == null) {
                headers = {};
            }
            if (!headers.id) {
                headers.id = `sub-${this.counter++}`;
            }
            headers.destination = destination;
            this.subscriptions[headers.id] = callback;
            this._transmit('SUBSCRIBE', headers);
            client = this;
            return {
                id: headers.id,
                unsubscribe() {
                    return client.unsubscribe(headers.id);
                }
            };
        };

        this.unsubscribe = function (id) {
            delete this.subscriptions[id];
            return this._transmit('UNSUBSCRIBE', { id });
        };

        this.begin = function (transaction) {
            let client; let
                txid;
            txid = transaction || `tx-${this.counter++}`;
            this._transmit('BEGIN', { transaction: txid });
            client = this;
            return {
                id: txid,
                commit() {
                    return client.commit(txid);
                },
                abort() {
                    return client.abort(txid);
                }
            };
        };
        this.commit = function (transaction) {
            return this._transmit('COMMIT', { transaction });
        };

        this.abort = function (transaction) {
            return this._transmit('ABORT', { transaction });
        };

        this.ack = function (messageID, subscription, headers) {
            if (headers == null) {
                headers = {};
            }
            headers['message-id'] = messageID;
            headers.subscription = subscription;
            return this._transmit('ACK', headers);
        };

        this.nack = function (messageID, subscription, headers) {
            if (headers == null) {
                headers = {};
            }
            headers['message-id'] = messageID;
            headers.subscription = subscription;
            return this._transmit('NACK', headers);
        };
    }
}

const Stomp = {
    VERSIONS: {
        V1_0: '1.0',
        V1_1: '1.1',
        V1_2: '1.2',
        supportedVersions() {
            return '1.1,1.0';
        }
    },
    client(url, protocols) {
        if (protocols == null) {
            protocols = ['v10.stomp', 'v11.stomp'];
        }
        const klass = Stomp.WebSocketClass || WebSocket;
        const ws = new klass(url, protocols);
        return new Client(ws);
    },
    setInterval,
    clearInterval,
    over(ws) {
        return new Client(ws);
    },
    Frame
};

export { Stomp };
