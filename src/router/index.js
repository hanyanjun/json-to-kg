
import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import Home from "../pages/home/Home"
import Block123 from "../pages/block123"
import Time from "../pages/time/Time"





export default function () {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route exact path="/block123">
                    <Block123 />
                </Route>
                <Route exact path="/time">
                    <Time />
                </Route>
            </Switch>
        </Router>
    )
}