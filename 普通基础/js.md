# promise.all 返回结果与传入的数组一致 不会因为执行完毕的时间顺序而改变

    var p1 = new Promise((resolve, reject) => {
        setTimeout(resolve, 4000, 'one');
    });
    var p2 = new Promise((resolve, reject) => {
        setTimeout(resolve, 2000, 'two');
    });
    var p3 = new Promise((resolve, reject) => {
        setTimeout(resolve, 3000, 'three');
    });
    var p4 = new Promise((resolve, reject) => {
        setTimeout(resolve, 1000, 'four');
    });

    Promise.all([p1, p2, p3, p4]).then(values => {
        console.log(values);
    }, reason => {
        console.log(reason)
    });

    result: ["one", "two", "three", "four"]

# es6 数组快速去重

```sh
const set1 = new Set([1, 2, 5, 3, 4, 5, 5]);
const array = Array.from(set1);
console.log(array)  // [1, 2, 5, 3, 4]
```

# string 有没有最大长度？如果有，是多少，为什么？

    最大长度为2^53-1  限制于js下标 js最大的整数为2^53-1

# hasOwnProperty 不要直接使用 obj.hasOwnProperty 进行判断

    1、并非所有对象都继承自 Object.prototype
    2、即使对于继承自的对象Object.prototype，该hasOwnProperty方法也可能被其他对象遮蔽。

    Object.prototype.hasOwnProperty.call(obj, 'key')
    Object.prototype.isPrototypeOf.call(obj, 'key')
    {}.propertyIsEnumerable.call(obj, "key")

# let var

    let 可以将变量绑定在所在的任意作用域中；
    let 会生成一个“暂时性死区” TDZ (Temporal Dead Zone) 在作用域内无法被再次声明 但可以多次赋值

# let const

    let const 均可以用来创建块作用域变量
    const必须在定义的时候就赋值，且不能再修改

# 变量提升 (hoisting) 是什么？

    变量的声明会在编译阶段就执行，变量的赋值在运行的时候执行；
    变量提升是指js代码在顺序执行之前/编译的时候，将函数定义与变量定义提升到最前面，在代码里面，可以在定义之前使用/运行而不报错

# 提升规则是什么？

    每个作用域都会进行提升操作，且只会提升到当前作用域的上层，不会提升到最顶层/全局；（函数作用域）
    ES5及之前块作用域只有两个：函数作用域  try..catch
    只有函数声明会被提升，函数表达式不会提升，函数表达式是将函数赋值给了一个变量，提升的其实是变量；
    函数会首先被提升，然后才是变量。
    变量重复声明时，重复的声明会被忽略，但赋值会被覆盖；函数重复声明时，函数会被覆盖；
    变量提升受函数作用域限制以及 try...catch 块限制；函数提升受所有块级作用域(所有{})限制；

# 为什么会设计变量提升？

    函数提升本来就是为了解决相互递归的问题而设计出来的。   （递归时，互相调用，如果没有函数提升，则运行时会报错）

# 为什么函数提升优先级要高于变量？

    函数是第一个公民，函数声明的优先级最高

# 函数表达式与函数声明

```sh
// 函数声明
function func(){
    console.log('-----')
}
```

```sh
// 函数表达式
const func = function (){
    console.log('-----')
}
const func = () => {
    console.log('-----')
}
```

# 在 map 里执行异步函数，并在 map 后同步获取结果

    const func = async (data = []) => {
        let result = 0;
        await Promise.all(data.map(async (item) => {
            // do something
            await new Promise((resolve, reject) => {
                result += item;
                resolve();
            });
        }));
        // 同步获得最终结果
        console.log(result);
    };

    func([1, 2, 3, 4]);

# 作用域 作用域链

    作用域是一套规则，用于确定在何处以及如何查找变量。如果查找的目的是为了赋值，那么会进行LHS查询 比如执行语句 a = 2, 就需要执行一次LHS(Left-hand Side)查询，如果a不在作用域中，则会抛出错误，ReferenceError; 如果查询的目的是获取变量的值，则会进行RHS(Right-hand Side)查询 比如执行console.log(a)，则会对a执行RHS查询；
    在查询的时候会先在当前作用域查找，如果当前作用域找不到，则会向上级作用域查找，直到全局作用域，当找完全局作用域之后，无论有没有找到都会结束查找，这就是作用域链；

    在es5中try...catch 会形成块作用域  立即执行函数（IIFE）也会形成

    函数作用域
        在函数内部是一个独立的作用域，在es6之前也是如此，函数作用域也是块级作用域的一种；

```sh
例：

foo();

console.log(a); // ReferenceError
function foo(){
    console.log(a); // undefined
    var a = 2;
}
```

    块作用域(ES6)

    所有{}的代码块，包括function map for if等；
    甚至可以直接单独使用{}创建一个代码块，例：
        let a = 1;
        {
            let b = 2;
            console.log(a,b);
        }
        console.log(a,b);

# 闭包

    当函数可以记住并访问所在词法作用域，即使函数是在当前词法作用域之外执行，这是就产生了闭包；
    在定时器、时间监听器、callback等都是闭包；比如ajax请求中success方法、任意的callback，能访问当前词法作用域的值，但是它并不是在当前词法作用域执行；
    词法作用域就时定义在词法阶段的作用域，或者说由书写代码时函数声明的位置决定）
    例子：
        const func = (a, fn) => {
            const b = 'xxx';
            if (a) fn(b);
        }

        const foo = () => {
            const callback = (b) =>{
                const a = 'callback'
                console.log(a + b);
            }

            func(true, callback);
        }

        foo();


        const func = (a, fn) => {
            const b = 'xxx';
            if (a) fn(b);
        }

        const callback = (b) =>{
            const a = 'callback';
            console.log(a + b);
        }

        func(true, callback);

    优点：

    缺点：
        会影响浏览器点垃圾回收；
        比如：
            var a = 1;
            console.log(a);

            window.addEventListener("scroll", function scroll(e){
                console.log(e);
            })

        变量 a 在console之后就可以回收了，但是因为scroll形成了一个覆盖整个作用域的闭包，js引擎极有可能保存着这个变量；

        使用块作用域可以解决这个问题

        {
            const a = 1;
            console.log(a);
        }

        window.addEventListener("scroll", function scroll(e){
            console.log(e);
        })

# 模块模式条件

    1、必须要有外部的封闭函数，且必须至少被调用一次，每次调用都会创建一个新的模块实例
    2、封闭函数必须返回至少一个内部状态，这样才能在私有作用域形成闭包，并且可以访问或者修改私有的状态；

# call apply

    改变this的指向，改变this的作用及用法是一样的，使用的call apply改变this之后 无论在哪调用 this都不会再次变更, 但是可以再次使用call、apply改变
    区别：call()方法接受的是参数列表，而apply()方法接受的是一个参数数组。

    注意：第一个参数都是this的指向；

    function.call(thisArg, arg1, arg2, ...) // 每一个arg 对应function的参数
    func.apply(thisArg, [argsArray]) // array中每一个元素对应function里的参数

```sh
例子：
function foo(b,c) {
    console.log(this, b,c);
}

const s = {
    a: 111
}

const d = [111, 222];

foo.call(s, d); // { a: 111 } [111, 222] undefined
foo.apply(s, d); // { a: 111 } 111 222

```

    call 与 apply都会直接调用这个函数，但是bind不会 bind会返回一个新函数
    bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。
    类似对call进行了一个封装

```sh
// 简单实现bind函数
function bind(fn, any, ...args) { // 这里使用使用了es6的 “剩余参数” 如果使用es5 则从arguments里将 “剩余参数” 取出即可
    // console.log(arguments)
    return function() {
        return fn.call(any, ...args)
    }
}

function foo(b,c) {
    console.log(this, b,c);
}

const s = {
    a: 111
}

const d = [111, 222];

const fo = bind(foo, s, d);
fo(); // { a: 111 } [111, 222] undefined

const fo = foo.bind(s, d);
fo(); // { a: 111 } [111, 222] undefined
```

## 不使用 call apply bind 改变 this 指向

```sh
function foo() {
    console.log(arguments,this)
}

Function.prototype.myCall = function () {
    const _this = this
    let args = [...arguments];
    const any = arguments[0];
    args= args.slice(1);
    const obj = {
        ...any,
        func: _this
    }
    obj.func(...args)
}

const obj = {name:'lol'}
foo.myCall(obj,'xxx')
// foo.call(obj,'xxx')
```

# class

    class 声明创建一个基于原型继承的具有给定名称的新类。

    constructor 是一种用于创建和初始化class创建的对象的特殊方法。

    在一个类中只能有一个名为 “constructor” 的特殊方法。 一个类中出现多次构造函数 (constructor)方法将会抛出一个 SyntaxError 错误。

    在一个构造方法中可以使用super关键字来调用一个父类的构造方法。
    如果没有显式指定构造方法，则会添加默认的 constructor 方法。

    如果不指定一个构造函数(constructor)方法, 则使用一个默认的构造函数(constructor)

# new 关键字

    并没有所谓的“构造函数”，只有对函数的构造调用；

    使用new关键字调用函数/发生构造调用时，会执行以下操作：

    1、创建/构造一个全新的对象；
    2、这个对象会被执行[[Prototype]]链接；
    3、这个新对象会绑定到函数调用的this；
    4、如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新对象；

```sh
    function newOperator(ctor, ...args) {
        if (typeof ctor !== 'function'){
            throw 'newOperator function the first param must be a function';
        }

        // 1.创建一个空的简单JavaScript对象（即{}）
        var obj = {};

        // 2.链接该新创建的对象（即设置该对象的__proto__）到该函数的原型对象prototype上
        obj.__proto__ = ctor.prototype;

        // 3.将步骤1新创建的对象作为this的上下文
        var result = ctor.apply(obj, args);

        // 4.如果该函数没有返回对象，则返回新创建的对象
        var isObject = typeof result === 'object' && result !== null;
        var isFunction = typeof result === 'function';
        return isObject || isFunction ? result : obj;
    }

    // 测试
    function company(name, address) {
        this.name = name;
        this.address = address;
    }

    var company1 = newOperator(company, 'yideng', 'beijing');
    console.log('company1: ', company1);
```

# 类型判断问题

    // number 同 string
    const str = 'sssss';
    console.log(typeof str); // "string"
    console.log(str instanceof String) // false

    const str = new String('ffff');
    console.log(str); // [String: 'ffff']
    console.log(str.toString()); // 'ffff'
    console.log(typeof str); // "object"
    console.log(str instanceof String) // true

    const arr = [1,2]
    console.log(typeof arr) // "object"
    console.log(arr instanceof Array) // true
    console.log(arr.__proto__.map) // [Function: map]

# 深拷贝和浅拷贝

    Object.defineProperty(obj, key, {
        value,
        writable: true, // 是否可以修改
        configurable: true, // 是否可通过defineProperty配置
        enumerable: true // 是否可枚举 如果为false，则该属性无法被遍历，使用所有的深拷贝与Object.assign 均无法复制该属性，直接赋值则会保留
    })

    如果writable与configurable都是false，这该属性会变成常量属性，始终无法被更改；

    增加的特性/属性描述符无法复制

    深拷贝：
        1、递归
        2、const newObj = JSON.parse(JSON.stringify(obj)) 可以实现简单的深拷贝
        使用三方库：
        3、使用qs库（现在的三方请求库都依赖qs，所以不用额外增加项目依赖） const newObj = qs.parse(qs.stringify(obj))
        4、使用lodash， lodash/clonedeep

    浅拷贝实现方法：
        1、直接赋值
        2、Object.assign

```sh
    ... 操作符复制obj，严谨的说浅拷贝，但是如果obj是个简单对象的时候 比如都是string num boolean等，实现的效果约等于深拷贝，如果是复杂对象如obj、array等则不行
例1：
    const obj = { a: 2 };
    const newObj = {...obj};
    console.log(newObj === obj) // true

    newObj.a = 3
    console.log(newObj, obj) // { a: 3 } { a: 2 }

例2：
    const obj = {
        a:2,
        b:{ c:3}
    }

    const newObj = { ...obj }

    console.log(newObj === obj, newObj.b === obj.b ) // false true

    newObj.a = 3;
    newObj.b.c = 5;

    console.log(newObj, obj ) // { a: 3, b: { c: 5 } }, { a: 2, b: { c: 5 } }
```

# 循环跳出问题

    for、forEach、for...in、for...of、map、every、some

    forEach、map  无论是return 还是break都无法跳出，但是try...catch 可以跳出，但一般不这么玩
    forEach、map的区别： map会返回一个新的数据，并且不会印象原数组
    try...catch 可以跳出
    // 跳出forEach
    try {
        [1,2,3].forEach(element => {
            console.log(element);
            if (element === 1) throw Error()
        });
    } catch (_){
        console.log('----')
    }

    // 跳出map
    try {
        [1,2,3].map(element => {
            console.log(element);
            if (element === 1) throw Error()
        });
    } catch (_){
        console.log('----')
    }

    for (let i = 0; i < 10; i++) {
        console.log(i);
        if (i > 2) // 跳出;  // 使用return 任何 / break 均可跳出循环 注意：使用return跳出后后面的代码也将不执行
    }

    const obj = {a:2,b:4}
    for (key in obj) {
        console.log(key);
        if (key === 'a') //跳出 // 使用return 任何 / break 均可跳出循环 注意：使用return跳出后后面的代码也将不执行
    }

    const arr = [1,2,3,4,5]
    for (const a of arr) {
        console.log(a);
        if (a === 1) return null //跳出 // 使用return 任何 / break 均可跳出循环  注意：使用return跳出后后面的代码也将不执行
    }

    every() 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值。
    const arr = [1,2,3,4,5]
    arr.every((item)=>{
        console.log(item);
        if (item > 2) return; // return false 则跳出循环
        return item < 10;
    })

    some() 方法测试数组中是不是至少有1个元素通过了被提供的函数测试。它返回的是一个Boolean类型的值。
    const arr = [1,2,3,4,5]
    arr.some((item)=>{
        console.log(item);
        if (item > 2) return true; // return true 则跳出循环
        return item > 10;
    })

# 面向对象编程

    设计模式：实例化、继承、多态
    面向对象编程强调的是数据和操作数据的行为本质上是互相关联的，好的设计就是把数据以及它相关的行为封装起来

# http code

    301：永久重定向（Moved Permanently）
    被请求的资源已永久移动到新位置，并且将来任何对此资源的引用都应该使用本响应返回的若干个 URI 之一。如果可能，拥有链接编辑功能的客户端应当自动把请求的地址修改为从服务器反馈回来的地址。除非额外指定，否则这个响应也是可缓存的。
    302：重定向，当响应码为302时，表示服务器要求浏览器重新再发一个请求，服务器会发送一个响应头Location，它指定了新请求的URL地址；
    304：缓存，当用户第一次请求index.html时，服务器会添加一个名为Last-Modified响应头，这个头说明了index.html的最后修改时间，浏览器会把index.html内容，以及最后响应时间缓存下来。当用户第二次请求index.html时，在请求中包含一个名为If-Modified-Since请求头，它的值就是第一次请求时服务器通过Last-Modified响应头发送给浏览器的值，即index.html最后的修改时间，If-Modified-Since请求头就是在告诉服务器，我这里浏览器缓存的index.html最后修改时间是这个，您看看现在的index.html最后修改时间是不是这个，如果还是，那么您就不用再响应这个index.html内容了，我会把缓存的内容直接显示出来。而服务器端会获取If-Modified-Since值，与index.html的当前最后修改时间比对，如果相同，服务器会发响应码304，表示index.html与浏览器上次缓存的相同，无需再次发送(节省传输成本)，浏览器可以显示自己的缓存页面，如果比对不同，那么说明index.html已经做了修改，服务器会响应200。

# 1<2<3 与 3>2>1

    console.log(1<2<3) // true
    console.log(3>2>1) // false
    原因：
        js是顺序执行的， 1<2 判断为true，true<3 为true
        3>2 判断为true，true>1 判断为false

# 0.1+0.2 === 0.3 // false

    使用Number.EPSILON（机器精度）判断
    function numberIsEqual(num1, num2) {
        return Math.abs(num1 - num2) < Number.EPSILON
    }

    console.log(0.1+0.2 === 0.3) // false
    console.log(numberIsEqual(0.1+0.2,0.3)) // true

# jsonp 的原理

    动态创建一个script标签，在script的url中传入一个callback函数，服务端封装好数据之后将数据拼接在url里，浏览器加载完毕之后就会调用callback函数，这时就能在callback中获取到返回的数据

# 现在跨域均需遵循 CORS 机制 "跨域资源共享"(Cross-origin resource sharing)

    对于简单请求，CORS请求会在请求头信息之中增加一个Origin字段。Origin字段用来说明，本次请求来自哪个源（协议 + 域名 + 端口）。服务器根据这个值，决定是否同意这次请求。
    非简单请求是对那种对服务器有特殊要求的请求，比如请求方式是PUT或者DELETE，或者Content-Type字段类型是application/json。都会在正式通信之前，增加一次HTTP请求，称之为预检。浏览器会先询问服务器，当前网页所在域名是否在服务器的许可名单之中；
    后台可以通过拦截器排除options；

    withCredentials 是否同意携带cookie；

    CORS请求需要客户端/浏览器 及服务端均支持；
    OPTIONS请求/CORS预检请求，
        OPTIONS请求方法的主要用途有两个：
            1、获取服务器支持的HTTP请求方法；
            2、用来检查服务器的性能。

    现在xhr/fetch 均使用cors进行跨域

# Window.getComputedStyle()

    Window.getComputedStyle()方法返回一个对象，该对象在应用活动样式表并解析这些值可能包含的任何基本计算后报告元素的所有CSS属性的值。 私有的CSS属性值可以通过对象提供的API或通过简单地使用CSS属性名称进行索引来访问。

    let style = window.getComputedStyle(element, [pseudoElt]);
    element
    用于获取计算样式的Element。
    pseudoElt 可选
    指定一个要匹配的伪元素的字符串。必须对普通元素省略（或null）。

# 实现 Promise.all

    promise.then 接受两个参数，不要使用catch，否则外面就catch不到错误了
    p.then(value => {
        // fulfillment
    }, reason => {
        // rejection
    });

```sh
function promiseAll(promises) {
  return new Promise(function(resolve, reject) {
    if(!Array.isArray(promises)){
        throw new TypeError(`argument must be a array`)
    }
    let num = 0;
    let result = [];
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then(value=>{
        num++;
        result[i] = value;
        if (num === promises.length) {
            return resolve(result)
          }
      },error=>{
        return reject(error)
      })
    }
  })
}

// test
let p1 = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve(1)
    }, 1000)
})
let p2 = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve(2)
    }, 2000)
})
let p3 = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve(3)
    }, 3000)
})
promiseAll([p3, p1, p2]).then(res => {
    console.log(res) // [3, 1, 2]
})
```

# 防抖和节流

## 防抖

    在一段时间时间之内，重复调用都拦截，直到停止调用后再执行一次方法
    const debounce = function (fun, n) {
        let context, args;
        let timer = null;
        return function () {
            context = this;
            args = arguments;
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                timer = null;
                fun.apply(context, args);
            }, n * 1000)
        }
    }

## 节流

    一段时间直接之内只会执行一次，多次调用会拦截，每隔一段时间会执行一次
    const throttle = function (fun, n) {
        let context, args;
        // 立刻执行一次
        let previous = 0;

        // n之后再执行
        // let previous = new Date().valueOf() / 1000;
        return function () {
            context = this;
            args = arguments;
            const now = new Date().valueOf() / 1000;
            if (now - previous > n) {
                fun.apply(context, args);
                previous = now;
            }
        }
    }

# 原型 原型链

    prototype  __proto__
    显示原型prototype，只有构造函数上具有该属性，同时构造函数也是对象，具有__proto__

    JavaScript一切皆对象，所有的对象都有__proto__

    在js中，所有的对象都有原型，这个原型又有原型，构成原型链

    例子：Function.__proto__ === Function.prototype
    Function.__proto__.__proto__ === Object.prototype
