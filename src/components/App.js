import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Main from '../components/Main';
import Footer from '../components/Footer';
import { BrowserRouter as Router, Route, Link, Switch, withRouter } from 'react-router-dom';
import Auth from '../pages/Auth'

import 'bootstrap/dist/css/bootstrap.min.css';
import { getSomething } from '../api';
import Links from '../pages/Links';
import Login from '../pages/Login';
import Register from '../pages/Register'

const App = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        getSomething()
            .then((response) => {
                setMessage(response.message);
            })
            .catch((error) => {
                setMessage(error.message);
            });
    });

    return (
        <div className='App'>
            <Router>
                <Header />
                <Switch>
                    <Route path='/login' exact render={() => <Login />} />

                    <Route path='/register' exact render={() => <Register />} />

                    <Route path='/home' exact render={() => <Links />} />
                </Switch>
                <Footer />
            </Router>

        </div>
    );

};

export default App;
