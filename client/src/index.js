import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { GlobalProvider } from './globalContext';
import * as serviceWorker from './serviceWorker';
import ErrorBoundary from './common/ErrorBoundary';


ReactDOM.render(
  <ErrorBoundary>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </ErrorBoundary>,

  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
