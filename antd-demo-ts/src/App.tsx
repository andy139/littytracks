import React from 'react';
// import {Query} from 'react-apollo';
import { useQuery } from "@apollo/react-hooks";
import { gql } from 'apollo-boost';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';


import "./App.css";


// ctrl + space to see what type component is taking in


const GETS_TRACK_QUERY = gql`
  {
    tracks {
      id
      title
    }
  }
`;

const ME_QUERY = gql `
{
  me {
    id
    username
    email
  }
}`

const App: React.FC = () => {


  const {loading, data, error} = useQuery(
    ME_QUERY

  )

  if (loading) return <div>Loading</div>
  if (error) return <div>Error</div>

  return <div>{JSON.stringify(data)}</div>
}




export default App;
