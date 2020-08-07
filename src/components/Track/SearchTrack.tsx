import React, { useState, useRef } from "react";
import { Input } from 'antd';
import {ApolloConsumer} from 'react-apollo';
import { Button } from 'antd';
import { gql } from "apollo-boost";
import { SearchOutlined } from '@ant-design/icons'
import "./track.css";
const { Search } = Input;

const SEARCH_TRACKS_QUERY = gql`
    query($search: String){
        tracks(search:$search){
            id
            title
            description
            url
            imgUrl
            artistName
            playcount {
                playCount
            }
            likes {
                id
                
            }
           comments {
				id
			
			}
            postedBy {
                id
                username
                userprofile{
                    avatarUrl
                }
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
        debugger
        setLoading(false);

        console.log({res})

    }


    return (
        <>  
            <ApolloConsumer>
                {client => (

                    <Search
                        placeholder="Search All Tracks"
                        enterButton={<SearchOutlined/>}
                        onSearch={() => {
                            setLoading(true);
                            handleSubmit(client)}
                        }
                        loading={loading} 
                        onChange={event => setSearch(event.target.value)}
                        value={search}
                        addonBefore={<Button type="primary" shape="circle" onClick={clearSearchInput}><i className="fas fa-times"></i></Button>}
                        size="large"
                        style={{ minWidth: '300px', maxWidth:"30%"}}
                        
                    />
                   
                 


                )}
                
             
            </ApolloConsumer>
        </>
    )



}

export default SearchTrack;