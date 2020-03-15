import React from 'react';
import ReactDOM from 'react-dom';
import mapboxgl from 'mapbox-gl';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './components/store';
import { Provider } from 'react-redux';


mapboxgl.accessToken = 'pk.eyJ1IjoiYWxleGJyaWNjaSIsImEiOiJjamxzeWwzaDUwMnVpM3F0OW9scWh4N2U0In0.BG5p1vRgnX4xqdXbzmTWAg';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
