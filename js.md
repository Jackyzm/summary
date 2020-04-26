# es6 数组快速去重
```sh
const set1 = new Set([1, 2, 5, 3, 4, 5, 5]);
const array = Array.from(set1);
console.log(array)  // [1, 2, 5, 3, 4]
```

# string 有没有最大长度？如果有，是多少，为什么？
    最大长度为2^53-1  限制于js下标 js最大的整数为2^53-1

# hasOwnProperty 不要直接使用obj.hasOwnProperty进行判断
    1、并非所有对象都继承自 Object.prototype
    2、即使对于继承自的对象Object.prototype，该hasOwnProperty方法也可能被其他对象遮蔽。

    Object.prototype.hasOwnProperty.call(obj, 'key')
    Object.prototype.isPrototypeOf.call(obj, 'key')
    {}.propertyIsEnumerable.call(obj, "key")

# let var
    let 可以讲变量绑定在所在的任意作用域中；
    let 会生成一个“暂时性死区” 在作用域内无法被再次声明 但可以多次赋值

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

# 在map里执行异步函数，并在map后同步获取结果
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

    forEach、map  无法跳出 无论是return 还是break都不行

    for (let i = 0; i < 10; i++) {
        console.log(i);
        if (i > 2) // 跳出;  // 使用return 任何 / break 均可跳出循环
    }

    const obj = {a:2,b:4}
    for (key in obj) {
        console.log(key)
        if (key === 'a') //跳出 // 使用return 任何 / break 均可跳出循环
    }

    const arr = [1,2,3,4,5]
    for (const a of arr) {
        console.log(a)
        if (a === 1) return null //跳出 // 使用return 任何 / break 均可跳出循环
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
    