import React, {useState} from "react";
import { Link } from 'react-router-dom';
import { LogoutOutlined, UserOutlined  } from '@ant-design/icons';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { Layout, Menu, Breadcrumb, Button, Avatar } from 'antd';
import Signout from '../Session/Signout'
const { Header, Content, Footer } = Layout;

const MenuItem = Menu.Item;

const Navbar:React.FC<any> = ({currentUser}) => {


    return (
   
        <Menu theme="dark" mode="horizontal" style={{position:'relative', display: 'flex', justifyContent: 'center', width:"75%"}} selectable={false}  >
            <Link to="/" style={{ position: 'absolute', top: 0, left: 0 }}>

                <i className="fas fa-music fa-1x"></i>&nbsp; Better Tracks
            </Link>
    
            <MenuItem>
                {currentUser && (
                    <Link to={`/profile/${currentUser.id}`}>

                        <Avatar shape="square" size="small" icon={<UserOutlined />} />&nbsp; {currentUser.username}
                    </Link>
                )}
            
            </MenuItem>

            <Signout/>
       
            
        </Menu>
       
    )



}


export default Navbar;