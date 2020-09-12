/** @format */

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    withRouter,
    Redirect,
} from "react-router-dom";
import jwt from "jsonwebtoken";


import "bootstrap/dist/css/bootstrap.min.css";



import { getLinks } from "../api";

import Login from "../pages/Login";
import Register from "../pages/Register";

const { JWT_SECRET } = process.env;

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

                {user.token ? (
                    <div>
                    <Route path="/" exact render={() => <Main links={links} />} />
                    <Redirect to='/' exact component={() => <Main links={links} />} />
                    </div>
                ) : (
                    <Switch>
                        <Route
                            path="/login"
                            exact
                            render={() => <Login user={user} setUser={setUser} />}
                        />
                        <Route
                            path="/register"
                            exact
                            render={() => <Register user={user} setUser={setUser} />}
                        />
                       <Redirect to="/login" />
                    </Switch>

                )}

                <Footer />
            </Router>
        </div>
    );
};

export default App;
