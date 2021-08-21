import React, { Component } from 'react';
import Connect from './Connect';

class Hoc extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { handleChange, num } = this.props;
        console.log(this, num);

        return (
            <div>
                <div>{ num }</div>
                <button onClick={ handleChange }>handleChange</button>
            </div>
        );
    }
}

export default Connect(Hoc, { a: 11 })