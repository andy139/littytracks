import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider, Query } from 'react-apollo';

// import { gql } from 'apollo-boost';
// import { ApolloClient } from 'apollo-client';
import ApolloClient, { gql } from 'apollo-boost';

import { withClientState } from 'apollo-link-state';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

import { onError } from "apollo-link-error";
import { ApolloLink, Observable } from 'apollo-link';

import Session from "./components/Session";
import "./index.css";
import App from './App';

const link = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});


const client = new ApolloClient({
  uri: "https://littytracks.herokuapp.com/graphql/",
  // uri: "http://localhost:8000/graphql/",
  // link: link,
  fetchOptions:{
    credentials:"include" //include auth header on request
  },
  request: operation => {
    const token = localStorage.getItem('authToken') || ""
    operation.setContext({
      headers: {
        Authorization: `JWT ${token}`
      }
    })

  },
  onError: ({ graphQLErrors, networkError }) => {

    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) console.log(`[Network error]: ${networkError}`);

  },
  clientState: {
    defaults:{
      isLoggedIn: !!localStorage.getItem('authToken') // gets authotoekn from storage
    }
  }
});


// const request = async (operation) => {
//   const token = localStorage.getItem('authToken') || ""
//   operation.setContext({
//     headers: {
//       Authorization: `JWT ${token}`
//     }
//   });

// }

// const requestLink = new ApolloLink((operation, forward) =>
//   new Observable(observer => {
//     let handle;
//     Promise.resolve(operation)
//       .then(oper => request(oper))
//       .then(() => {
//         handle = forward(operation).subscribe({
//           next: observer.next.bind(observer),
//           error: observer.error.bind(observer),
//           complete: observer.complete.bind(observer),
//         });
//       })
//       .catch(observer.error.bind(observer));

//     return () => {
//       if (handle) handle.unsubscribe();
//     };
//   })
// );


// const client = new ApolloClient({
//   link: ApolloLink.from([
//     onError(({ graphQLErrors, networkError }) => {
//       if (graphQLErrors)
//         graphQLErrors.forEach(({ message, locations, path }) =>
//           console.log(
//             `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
//           )
//         );
//       if (networkError) console.log(`[Network error]: ${networkError}`);
//     }),
//     requestLink,
//     new HttpLink({
//       uri: ' "http://localhost:8000/graphql/',
//       credentials: 'include'
//     }),
//     withClientState({
     
//       defaults: {
//       isLoggedIn: !!localStorage.getItem('authToken') // gets authotoekn from storage
//       }, 
//       resolvers: {
//         Mutation: {
//           updateNetworkStatus: (_, { isLoggedIn }, { cache }) => {
//             cache.writeData({ data: { isLoggedIn } });
//             return null;
//           }
//         }
//       },
//       cache: new InMemoryCache()
//     }),
      
//   ]), cache: new InMemoryCache()

  
// })



const IS_LOGGED_IN_QUERY = gql`
  query{
    isLoggedIn @client
  }

`

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <Query query={IS_LOGGED_IN_QUERY}>
        {({ data }) => data.isLoggedIn ?  <App/> : <Session />}

      </Query>
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
