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