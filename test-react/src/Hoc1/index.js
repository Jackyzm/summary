import React from 'react';
import Connect from './Connect';


const Hoc = (props) => {
    const { handleChange, num } = props;
    return (
        <div>
            <div>{ num }</div>
            <button onClick={ handleChange }>handleChange</button>
        </div>
    )
}

export default Connect(Hoc, { a: 11 })