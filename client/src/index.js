import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "antd/dist/antd.css"
import App from './App';
import reportWebVitals from './reportWebVitals';

// 1. import from react-redux and redux
// 2. create reduser reducer function
// 3. combine multiple reducers
// 4. create redux store
// 5. provide redux store to the entire application



import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';



const store = createStore(rootReducer, composeWithDevTools());




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <Provider store={store} >
      <App />
    </Provider>
  
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
