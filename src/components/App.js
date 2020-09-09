import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Main from '../components/Main';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getSomething } from '../api';

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
                <Header />
                <Main />
                <Footer />
            </>
        </div>
    );
    
};

export default App;
