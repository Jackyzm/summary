import React, { Component } from 'react';

class Detail1 extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        console.log('componentDidMount')
    }

    render() {
        console.log('render');

        return (
            <div>
                <div>Detail</div>
                <button onClick={ () => this.props.history.push('/detail3?id=222') }>detail3?id=222</button>
            </div>
        );
    }
}

export default Detail1