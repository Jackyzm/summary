# redux
    redux的原理：创建一个state  通过dispatch去改变state；通过一个listener监听state的改变；通过getState获取最新的state

    中间件：中间件的作用就是在发起dispatch之后与改变state的中间 可以做一些事情 比如请求数据 获取到请求结果之后再改变state

# React
    React三个主要组成部分：

    React基础模块（这个模块定义了React的基础API及组件相关内容。对应我们开发页面时引入的 'react' 模块）
    
    渲染模块（这个模块对于不同类型的应用，采用不同的渲染方式。对应我们开发页面时引入的 'react-dom' 模块）

    Reconciliation 模块（又叫 协调模块，这个模块是上面两个模块的基础，主要负责任务协调、生命周期函数管理等）

# Virtual DOM
    Virtual DOM 是一种编程概念。在这个概念里， UI 以一种理想化的，或者说“虚拟的”表现形式被保存于内存中，并通过如 ReactDOM 等类库使之与“真实的” DOM 同步。这一过程叫做协调。
    Virtual DOM是对DOM的抽象,本质上是JavaScript对象,这个对象就是更加轻量级的对DOM的描述.

# React Fiber
    React Fiber调度算法又叫 Fiber Reconciler，是 React 16 启用的一种新的调度算法，是对核心调度算法（Stack Reconciler）的重构

## Stack Reconciler

    React 16版本之前使用的 Stack Reconciler 调度算法，它通过递归的形式遍历 Virtual DOM，存在难以中断和恢复的问题，如果react更新任务运行时间过长，就会阻塞布局、动画等的运行，可能导致掉帧。

## Fiber Reconciler
    允许渲染过程分段完成，而不必须一次性完成，中间可以返回至主进程控制执行其他任务，它有如下新特性：

    可拆分，可中断任务
    可重用各分阶段任务，且可以设置优先级
    可以在父子组件任务间前进后退切换任务
    render方法可以返回多元素（即可以返回数组）
    支持异常边界处理异常

# Portals
    Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案。

    ReactDOM.createPortal(child, container)
    第一个参数（child）是任何可渲染的 React 子元素，例如一个元素，字符串或 fragment。第二个参数（container）是一个 DOM 元素。

    // React 并*没有*创建一个新的 div。它只是把子元素渲染到 `domNode` 中。
    // `domNode` 是一个可以在任何位置的有效 DOM 节点。
    return ReactDOM.createPortal(
        this.props.children,
        domNode
    );