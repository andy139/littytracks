import React, { useState } from 'react';
// import {Query} from 'react-apollo';
import $ from 'jquery';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { GithubOutlined, LinkedinOutlined } from '@ant-design/icons';
import { Layout, Space, Button } from 'antd';
import Splash from './pages/Splash';
import Profile from './pages/Profile';
import Navbar from './components/Shared/Navbar';
import Loading from './components/Shared/Loading';

import './App.less';

const { Header, Footer, Sider, Content } = Layout;
// ctrl + space to see what type component is taking in

export const UserContext = React.createContext(null);

export const GETS_TRACK_QUERY = gql`
	{
		tracks {
			id
			title
		}
	}
`;

export const ME_QUERY = gql`
	{
		me {
			id
			username
			email
			userprofile {
				avatarUrl
				backgroundUrl
			}
			likeSet {
				track {
					id
				}
			}
		}
	}
`;

const App: React.FC<any> = () => {
	const { loading, data, error } = useQuery(ME_QUERY, {
		fetchPolicy: 'cache-and-network'
	});

	const [ searchResults, setSearchResults ] = useState([]);

	if (loading) return <Loading />;
	if (error) return <div>Error</div>;

	const currentUser = data.me;

	return (
		<Router>
			<UserContext.Provider value={currentUser}>
				<Layout>
					<Navbar currentUser={currentUser} setSearchResults={setSearchResults} />

					<Content
						className="site-layout"
						style={{
							padding: '0 50px',
							marginTop: 64,
							background: '#001934',
							width: '75%',
							minHeight: '100vh',
							marginLeft: 'auto',
							marginRight: 'auto'
						}}
					>
						<Switch>
							<Route exact path="/" component={() => <Splash searchResults={searchResults} />} />

							<Route path="/profile/:id" render={(props) => <Profile {...props} currentUser={currentUser} />} />
						</Switch>
					</Content>

					<Footer style={{ textAlign: 'center' }}>
						<span>
							Created by&nbsp;
							<a style={{ color: 'inherit' }} href="https://www.atran.co/" target="_blank">
								Andy Tran
							</a>
						</span>
						&nbsp;
						<Button
							type="link"
							href="https://www.linkedin.com/in/andy139/"
							target="_blank"
							icon={<LinkedinOutlined />}
						/>
						<Button type="link" href="https://github.com/andy139" target="_blank" icon={<GithubOutlined />} />
					</Footer>
				</Layout>
			</UserContext.Provider>
		</Router>
	);
};

export default App;
