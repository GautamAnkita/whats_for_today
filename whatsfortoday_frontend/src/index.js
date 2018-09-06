import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import './assets/scss/material-kit-react.css?v=1.2.0';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
