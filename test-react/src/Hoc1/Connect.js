import React, { useState } from 'react';

const Connect = (Com, someThing) => {
    const WrappedComponent = (props) => {
        const [num, setNum] = useState(1)

        const handleChange = () => {
            console.log(someThing)
            setNum(num + 1)
        }

        return (
            <Com
                num={ num }
                handleChange={ handleChange }
                { ...props }
            />
        );
    }
    return WrappedComponent
}

export default Connect