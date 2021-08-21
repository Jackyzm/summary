import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom'

const Detail = () => {
    console.log('-----');
    const history = useHistory();
    const params = useParams()
    console.log(params);

    useEffect(() => {
        console.log('componentDidMount')
    }, []);

    console.log('render');
    return (
        <div>
            <div>Detail</div>
            <button onClick={ () => history.push('/detail/222') }>detail/222</button>
        </div>
    );
}

export default Detail
