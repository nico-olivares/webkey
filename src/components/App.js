import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Auth from '../pages/Auth'
import 'bootstrap/dist/css/bootstrap.min.css';
import { getSomething } from '../api';
import Links from '../pages/Links';

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
            <>
                <Router>
                    <Link className="nav-link" to="/auth">Create Account or login</Link>
                    <Link to="/" >This is the links view</Link>
                    <Route path='/auth' exact render={() => <Auth />} />
                    <Route path='/' exact render={() => <Links />}>Home</Route>
                </Router>
                <Header />
                <Footer />
            </>
        </div>
    );
};

export default App;
