import React from "react";
import {
    HashRouter,
    Switch,
    Route,
} from "react-router-dom";
import Home from './Home'
import Detail from './Detail'
import Detail1 from './Detail1'
import Detail2 from './Detail2'
import Detail3 from './Detail3'
import Hoc from './Hoc'
import Hoc1 from './Hoc1'
import Extends from './Extends'


export default function App() {
    return (
        <HashRouter>
            {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            <Switch>
                <Route path="/" exact>
                    <Home />
                </Route>
                {/* <Route path="/about">
                    <About />
                </Route> */}
                <Route exact path="/detail/:id">
                    <Detail />
                </Route>
                <Route exact path="/detail1/:id" component={ Detail1 } />
                <Route exact path="/detail2" component={ Detail2 } />
                <Route exact path="/detail3" component={ Detail3 } />
                <Route exact path="/hoc" component={ Hoc } />
                <Route exact path="/hoc1" component={ Hoc1 } />
                <Route exact path="/extends" component={ Extends } />
            </Switch>
        </HashRouter>
    );
}