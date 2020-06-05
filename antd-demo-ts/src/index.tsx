import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {ApolloProvider} from 'react-apollo';
import ApolloClient from 'apollo-boost';

import Session from "./components/Session";


const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql/'

})

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <Session />
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
