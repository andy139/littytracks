import React, { useState, useRef } from "react";
import { Input, AutoComplete } from 'antd';
import { ApolloConsumer } from 'react-apollo';
import { useQuery } from '@apollo/react-hooks';
import { Button } from 'antd';
import { gql } from "apollo-boost";

import Trie from "../../assets/trie"
import { SearchOutlined, UserOutlined } from '@ant-design/icons'
import "./track.css";
const { Search } = Input;


const SEARCH_TERMS_QUERY = gql`
    query getCorpusQuery{
        corpus {
            corpus
        }
    }

`


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

    const {loading:loadingTerms, data, error} = useQuery(SEARCH_TERMS_QUERY);
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([])

    if (!data) return null;

    const newTrie = new Trie(data.corpus.corpus)
    const clearSearchInput = () => {
        setSearchResults([]);
        setValue("");
    }

    const onChange = data => {
        setValue(data);
    };

    const onSearch = searchVal => {
        let trieArray = newTrie.showWords(searchVal.toLowerCase())
        let autoOptions: any = trieArray.map(word => {
            return {
                value: word
            }
        })
        setOptions(autoOptions);

    }




    const handleSubmit = async (searchTerm, client) => {
        
        const res = await client.query({
            query: SEARCH_TRACKS_QUERY,
            variables: { search: searchTerm }
        })

        debugger
        setSearchResults(res.data.tracks);
        setLoading(false);



    }

 


    return (
        <>  
            <ApolloConsumer
                
            >
                {client => (
                    <AutoComplete
                        // dropdownStyle={{ backgroundColor: 'white', color: 'black' }}
                     
                        onChange={onChange}
                        value={value}
                        options={options}
                        onSearch={onSearch}
                        onSelect={(data, option) => {
                            setLoading(true);
                            handleSubmit(data, client)
                            debugger
                        }}
                        style={{ minWidth: '300px', width: "35%" }}
                    >

                        <Search
                            placeholder="Search All Tracks"
                            enterButton={<SearchOutlined />}
                          
                            // loading={loading}
                            // onChange={event => setSearch(event.target.value)}
                            // value={search}
                            // addonBefore={<Button type="primary" shape="circle" onClick={clearSearchInput}><i className="fas fa-times"></i></Button>}
                            size="large"
                            // style={{ minWidth: '300px', maxWidth: "30%" }}

                        >


                        </Search>


                    </AutoComplete>
                
                      
               
               
        
             
           
                   
                )}
                
             
            </ApolloConsumer>
        </>
    )



}

export default SearchTrack;