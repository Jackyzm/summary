import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom'

const Detail = () => {
    console.log('-----');
    const history = useHistory();
    const location = useLocation()
    console.log(location)
    useEffect(() => {
        console.log('componentDidMount')
    }, []);

    console.log('render');
    return <div>
        <div>Detail</div>
        <button onClick={ () => history.push('/detail2?id=222') }>detail2?id=222</button>
    </div>
}

export default Detail
