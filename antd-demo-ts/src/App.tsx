import React from 'react';
// import {Query} from 'react-apollo';
import { useQuery } from "@apollo/react-hooks";
import { gql } from 'apollo-boost';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { Layout } from 'antd';
import Splash from './pages/Splash';
import Profile from './pages/Profile';
import Navbar from './components/Shared/Navbar';
import Loading from './components/Shared/Loading';
import "./App.css";

const { Header, Footer, Sider, Content } = Layout;
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

  if (loading) return <Loading/>
  if (error) return <div>Error</div>

  const currentUser = data.me;

  // return <div>{JSON.stringify(data)}</div>

  return (

  
      <Router>
        <Layout>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
            <Navbar currentUser={currentUser}/>
          </Header>
        <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
            <Switch >
              <Route exact path="/" component={Splash} ></Route>
              <Route page="/profile/:id" component={Profile}></Route>
            </Switch>
          </Content>
        </Layout>
      </Router>

    


  )
}




export default App;
