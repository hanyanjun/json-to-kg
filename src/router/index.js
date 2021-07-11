
import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from "../pages/home/Home"
import Block123 from "../pages/block123"





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
            </Switch>
        </Router>
    )
}