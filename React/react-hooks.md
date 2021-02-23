# hooks出现的原因/动机/解决了什么问题
    1、在组件之间复用状态逻辑很难，Hook 使你在无需修改组件结构的情况下复用状态逻辑；
    2、复杂组件变得难以理解，组件复杂之后变得难以理解，Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据），
    componentDidMount中可能会进行很多操作，如设置事件监听，而之后需在 componentWillUnmount 中清除，如果使用useEffect 则能将这两个部分合并在一起；
    3、Hook 使你在非 class 的情况下可以使用更多的 React 特性；降低了学习难度，简化了代码；

# Hook 规则
    1、只在最顶层使用 Hook，不要在循环，条件或嵌套函数中调用 Hook；
    2、只在 React 函数中调用 Hook；不要在普通的 JavaScript 函数中调用 Hook。

    尽量不在闭包中使用hooks的值，在callback中可能会无法获取到hooks的值，比如useState的value，
    const [state, setState] = useState({});

    console.log(state);
    window.addEventListener('resize', (e)=>{
        console.log(state) // 无论怎么改变 打印出来的始终是初始值 {}
        setState({
            width: e.target.innerWidth,
            height: e.target.innerHeight
        })
    })

# react-hooks 遇到的问题
## 定时器问题
    因react-hooks是无状态组件，所以this无法使用，在组件头部定义timer时，每次setState时timer会被重置
    解决办法：
        1、将timer放入state
        2、将timer定义到组件外面

## hooks redux
    通过 useSelector 获取的数据 需要clone才能进行修改 否则会直接影响state里面的数据

## useRef
纯函数子组件不能直接使用useRef获取组件与组件内的方法，故父组件调用子组件方法不能再使用以前的方法

父组件：
```sh
    import React, { useRef } from 'react';

    const Father = () => {
        const ref = useRef(null);

        return (
            <div>
                <Child ref = {ref} >
                    <div>我是child</div>
                </Child>
                <button onClick={()=>{ref.current.childFunc}}>调用自组件函数</button>
            </div>
        );
    }
```


```sh
    import React, { useImperativeHandle, forwardRef } from 'react';

    // 如果在export时才包forwardRef，会提示forwardRef不允许使用PropTypes，在这里包则能避免这个问题
    const Child = forwardRef(({children}, ref) => {
        const childFunc = () => {console.log('child func')};

        useImperativeHandle(ref, ()=>({
            childFunc
        }))

        return (
            <div>
                {children}
            </div>
        )
    })
```

## useCallback

```sh
    const func = (a, b) => {
        console.log(a, b);
    }
    // 如果useCallback中的函数仅依赖监听的参数，则按照官方的写法即可
    // 如果useCallback中的函数既依赖监听的参数，也依赖调用时传入的参数，则需要用以下的方法，将具体执行的方法再包一下
    const _func = useCallback(
        (b) => {
            ((a) => {
                func(a, b);
            })(a);
        },
        [a]
    );
```

## 闭包导致state拿不到最新值

    1、在组件内部使用一个变量cache一下   (props更新可能会丢失)

    2、可以尝试useCallback（有时可以）

    3、使用useRef，将最新的state放到current中 原理一致 （终极解决方案）

## forwardRef
    父组件需要在useEffect中监听ref值  才能打印出最新的ref

    子组件中 可以直接给forwardRef传过来的ref赋值 修改current，并且在父组件中拿到

## 奇淫技巧
    兄弟组件方法调用：
    可以通过父组件state，在子组件中set func，在兄弟组件中调用