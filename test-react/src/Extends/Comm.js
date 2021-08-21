import { Component } from 'react';

class Comm extends Component {
    constructor(props) {
        super(props);
        this.num = 1
    }

    handleChange = () => {
        this.num += 1;
        // 处理复用js逻辑
    }
}

export default Comm