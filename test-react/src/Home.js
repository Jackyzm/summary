import React from 'react';
import { useHistory } from 'react-router-dom'

const Home = () => {
    const history = useHistory();
    return (
        <div>
            <div>Home</div>
            <button onClick={ () => history.push('/detail/111') }>detail/111</button>
            <button onClick={ () => history.push('/detail1/111') }>detail1/111</button>
            <button onClick={ () => history.push('/detail2?id=111') }>detail2?id=111</button>
            <button onClick={ () => history.push('/detail3?id=111') }>detail3?id=111</button>
            <div>
                <button onClick={ () => history.push('/hoc') }>hoc</button>
                <button onClick={ () => history.push('/hoc1') }>hoc1</button>
                <button onClick={ () => history.push('/extends') }>extends</button>
            </div>
        </div>
    );
}

export default Home