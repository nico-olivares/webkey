import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';

ReactDOM.render(
    <App />, 
    document.getElementById('root')
);

function B(props) {
   return <button onClick={props.onClick}>Click me</button> 
}

function C(props) {
    return (<div> {props.state}</div>)
}

function A() {
    const [state, setState] = useState('yo')

    const onClick = (e) => {
        e.preventDefault()

        setState('bro')
    }

    return <div>
        <C state={state} />
        <B onClick={onClick} />
    </div>

    return <div>
        <span>{state}</span>
        <button onClick={onClick}>Click me</button>
    </div>
}
