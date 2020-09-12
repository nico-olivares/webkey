// set up depedent react and dom components
// set up useState and useEffect


import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    withRouter,
    Redirect,
} from "react-router-dom";

// set up boostrap css

import "bootstrap/dist/css/bootstrap.min.css";

// set up global containers

import Header from "../components/Header";
import Footer from "../components/Footer";

// set up page/view level containers

import { getLinks } from "../api";
import Main from "../components/Main";
import Login from "../pages/Login";
import Register from "../pages/Register";

// set up JWT

import jwt from "jsonwebtoken";
const { JWT_SECRET } = process.env;

// set up top level App component
// 
const App = () => {
    const [links, setLinks] = useState([]);
    const [user, setUser] = useState({});

    console.log('jwt secret ', JWT_SECRET);

    //user verification
    function localStorageUser() {
        if (localStorage.getItem("user")) {
            const localStorageUser = JSON.parse(localStorage.getItem("user"));
            return localStorageUser;
        } else {
            return {};
        }
    }

    useEffect(() => {
        getLinks()
            .then((response) => {
                console.log("response..", response);
                setLinks(response.links);
                setUser(localStorageUser());
                    
            })
            .catch((error) => {
                setLinks(error);
            });
    }, []);
  
    return (
        <div className="App">
            <Router>
                <Header user={user} />
                <main id="main">
                    {user.token 
                    ? (
                        <div id="page" class="page-main">
                            <Route path="/" exact render={() => <Main links={links} />} />
                            <Redirect to='/' exact component={() => <Main links={links} />} />
                        </div>
                    ) : (
                        <Switch>
                            <div id="page" class="page-entry">
                                <Route path="/login" exact render={() => <Login user={user} setUser={setUser} />} />
                                <Route path="/register" exact render={() => <Register user={user} setUser={setUser} />} />
                                <Redirect to="/login" />
                            </div>
                        </Switch>
                    )}
                </main>
                <Footer />
            </Router>
        </div>
    );
};

export default App;
