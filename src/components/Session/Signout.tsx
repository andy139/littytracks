import React, { useState } from "react";
import {ApolloConsumer} from 'react-apollo';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import {Button} from "antd";
import { Link } from 'react-router-dom';

const Signout: React.FC = ({ }) => {

    const handleSignout = client => {

        localStorage.removeItem('authToken')
        client.writeData({ data: {isLoggedIn: false}})
        console.log("Sign out user", client)
    }

    return (
        <ApolloConsumer >
            {client =>(


                <Link onClick={() => handleSignout(client)} type="link" size={"large"} style={{}} >
                    Sign Out
                    {/* &nbsp;<i className="fas fa-sign-out-alt"></i> */}
                </Link>


            )}

         

        </ApolloConsumer>
     
    )



}


export default Signout;