import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogoutOutlined, UserOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { Query } from 'react-apollo';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Layout, Menu, Breadcrumb, Button, Avatar, Typography, Space, Dropdown, Tooltip } from 'antd';
import SearchTrack from '../Track/SearchTrack';
import Signout from '../Session/Signout';
import CreateTrack from '../Track/CreateTrack';

import './shared.css';

const { Title } = Typography;
const { Header } = Layout;

const Navbar: React.FC<any> = ({ currentUser, setSearchResults }) => {
	const history = useHistory();


	return (
		<Header className="header" style={{ zIndex: 90, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<div className="logo">
				<Link to="/" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					{/* <Title level={4} className='logo-font' style={{ color: "#d2e0fa" }}>LittyTracks</Title> */}
					<img src="https://django-app-images.s3-us-west-1.amazonaws.com/logo.png" style={{ width: 150 }} />
				</Link>
			</div>



			<Menu
				mode="horizontal"
				style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
				selectable={false}
				theme="dark"
			>
				
				<SearchTrack setSearchResults={setSearchResults} />

			</Menu>	

			<Dropdown
				overlay={
					<Menu style={{ marginTop: 20, borderRadius: '7%' }}>
						<Menu.Item style={{ fontSize: 20, zIndex: 100 }}>
							<CreateTrack isNavbar={true} />
						</Menu.Item>
					</Menu>
				}
				placement="bottomRight"
			>
				<Button type="text">
					<CloudUploadOutlined style={{ fontSize: 30 }} />
				</Button>
			</Dropdown>

			<Dropdown
				overlay={
					<Menu style={{ marginTop: 20, borderRadius: '7%' }}>
						<Menu.Item
							style={{ fontSize: 16, width: 150, height: 30 }}
							onClick={(e) => {
								history.push(`/profile/${currentUser.id}`);
							}}
						>
							{currentUser && (
								<span>View Profile</span>
								// <Link to={`/profile/${currentUser.id}`} >
								// 		View Profile
								// 	</Link>
							)}
						</Menu.Item>
						<Menu.Divider />
						<Menu.Item style={{ fontSize: 16, width: 150 }}>
							<Signout />
						</Menu.Item>
					</Menu>
				}
				placement="bottomRight"
			>
				<Button type="text">
					<Avatar
						shape="circle"
						size="large"
						src={
							currentUser.userprofile.avatarUrl ? (
								currentUser.userprofile.avatarUrl
							) : (
								'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4'
							)
						}
						style={{ cursor: 'pointer' }}
					/>
				</Button>
			</Dropdown>
		</Header>
	);
};

export default Navbar;
