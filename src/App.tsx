import React from 'react';
// import {Query} from 'react-apollo';
import { useQuery } from "@apollo/react-hooks";
import { gql } from 'apollo-boost';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { GithubOutlined, LinkedinOutlined,  } from '@ant-design/icons'
import { Layout, Space, Button } from 'antd';
import Splash from './pages/Splash';
import Profile from './pages/Profile';
import Navbar from './components/Shared/Navbar';
import Loading from './components/Shared/Loading';

import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";

import "./App.less";

const { Header, Footer, Sider, Content,  } = Layout;
// ctrl + space to see what type component is taking in

export const UserContext =  React.createContext(null);

export const GETS_TRACK_QUERY = gql`
  {
    tracks {
      id
      title
    }
  }
`;

export const ME_QUERY = gql `
{
  me {
    id
    username
    email
    userprofile{
      avatarUrl
    }
    likeSet {
      track {
        id
      }
    }
  }
}`

const App: React.FC<any> = () => {


  const {loading, data, error} = useQuery(
    ME_QUERY,
    {
      fetchPolicy:"cache-and-network"
    }
  )

  if (loading) return <Loading/>
  if (error) return <div>Error</div>

  const currentUser = data.me;

  // return <div>{JSON.stringify(data)}</div>

  return (

  
      <Router>
        <UserContext.Provider value={currentUser}>

          <Layout >
              
                <Navbar currentUser={currentUser}  />
              
            <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64, background: "#001934", minHeight: '100vh', width:"75%", marginLeft: "auto", marginRight: "auto" }}>
                <Switch >
                  <Route exact path="/" component={Splash} ></Route>
                  
                  {/* <Route path="/profile/:id" component={() => <Profile currentUser={currentUser}/>}></Route> */}
                  <Route path="/profile/:id" render={(props) => <Profile {...props} currentUser={currentUser} />}></Route>
                </Switch>
          </Content>
        
          <Footer style={{ textAlign: 'center' }}>
            <span>
              Created by&nbsp;
                <a
                style={{ color: 'inherit'}}
                href='https://www.atran.co/' target="_blank"  
              >
                Andy Tran
                </a>
              </span>
                &nbsp;
                <Button type="link" href='https://www.linkedin.com/in/andy139/' target="_blank" icon={<LinkedinOutlined /> }/>
            <Button type="link" href='https://github.com/andy139'target="_blank" icon={<GithubOutlined />}/>
          
          </Footer>
          </Layout>
        </UserContext.Provider>
      </Router>

    


  )
}




export default App;
