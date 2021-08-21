import React from 'react';
import Comm from './Comm';

class Extends extends Comm {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        console.log(this)
        return (
            <div>
                <div>{ this.num }</div>
                <button onClick={ () => this.handleChange() }>handleChange</button>
            </div>
        );
    }
}

export default Extends