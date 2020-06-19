import React, {useState} from "react";
import { Link } from 'react-router-dom';
import { LogoutOutlined, UserOutlined  } from '@ant-design/icons';
import { Query } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Layout, Menu, Breadcrumb, Button, Avatar, Typography, Space } from 'antd';
import SearchTrack from '../Track/SearchTrack'
import Signout from '../Session/Signout'

import { GET_TRACKS_QUERY } from '../../pages/Splash';

const { Title } = Typography;
const { Header, Content, Footer } = Layout;

const MenuItem = Menu.Item;

const Navbar: React.FC<any> = ({ currentUser }) => {
    
    const { loading, data, error } = useQuery(
        GET_TRACKS_QUERY

    )

    const [searchResults, setSearchResults] = useState([]);

    if (!data) return null;
    const tracks = searchResults.length > 0 ? searchResults : data.tracks;


    return (


   
        <Menu theme="dark" mode="horizontal" style={{position:'relative', display: 'flex', justifyContent: 'center', width:"75%"}} selectable={false}  >
            <Link to="/" style={{ position: 'absolute', top: 0, left: 0, display: 'flex', justifyContent: 'center', alignItems:'center', paddingTop:"10px"}}>
                <Title level={4}> <Avatar size={42} src="https://django-app-images.s3-us-west-1.amazonaws.com/music-logo3.png" /> Better Tracks</Title>
            </Link>
    
            <MenuItem>
         
                {/* <SearchTrack setSearchResults={setSearchResults} /> */}

            </MenuItem>

       

            <Space style={{ position: 'absolute', top: 0, right: 0 }}>
                
                {currentUser && (
                    <Link to={`/profile/${currentUser.id}`} >

                        <Avatar shape="square" size="small" src={currentUser.userprofile.avatarUrl} />&nbsp; {currentUser.username}
                    </Link>
                )}
             

                <Signout />
            </Space>
            
        
          

            
       
            
        </Menu>
       
    )



}


export default Navbar;