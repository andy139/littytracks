import React, { useState, useRef } from "react";
import { Input } from 'antd';
import {ApolloConsumer} from 'react-apollo';
import { Button } from 'antd';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import "./track.css";
const { Search } = Input;

const SEARCH_TRACKS_QUERY = gql`
    query($search: String){
        tracks(search:$search){
            id
            title
            description
            url
            likes {
                id
                
            }
            postedBy {
                id
                username
            }
        }
    }

`


const SearchTrack: React.FC<any> = ({setSearchResults }) => {

 
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

 

    const clearSearchInput = () => {
        setSearchResults([]);
        setSearch("");
    }

    const handleSubmit = async (client) => {
        
        const res = await client.query({
            query: SEARCH_TRACKS_QUERY,
            variables: { search }
        })

        setSearchResults(res.data.tracks);
        setLoading(false);

        console.log({res})

    }


    return (
        <>  
            <ApolloConsumer>
                {client => (
                   
                    <Search placeholder="Search All Tracks" 
                        size="large" 
                        // allowClear
                   
                        onSearch={() => {
                            setLoading(true);
                            handleSubmit(client)}
                        }
                        loading={loading} 
                        enterButton 
                        style={{padding: 10, paddingBottom:20, paddingTop:20}}
                        onChange={event => setSearch(event.target.value)}
                        value={search}
                        addonBefore={<Button type="primary" shape="circle" onClick={clearSearchInput}><i className="fas fa-times"></i></Button>}
                        
                    />
                    


                )}
                
             
            </ApolloConsumer>
        </>
    )



}

export default SearchTrack;