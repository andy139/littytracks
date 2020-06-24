import React, { useState } from "react";
import { Row, Col } from "antd";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import _ from 'lodash';

import SearchTrack from "../components/Track/SearchTrack";
import TrackList from "../components/Track/TrackList";
import CreateTrack from "../components/Track/CreateTrack";
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";


import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";

export const GET_TRACKS_QUERY = gql`
    query getTracksQuery {
        tracks {
            id
            title
            description
            url
            imgUrl
            likes {
                id
                
            }
            postedBy {
                id
                username
                userprofile{
                    avatarUrl
                }
            }
            comments {
                id
                comment
                createdAt
                subcomments{
                    subcomment
                    id
                    createdAt
                    postedBy {
                        username
                        id
                        userprofile{
                            avatarUrl
                        }
                    }
                }
                postedBy{
                    username
                    id
                    userprofile{
                        avatarUrl
                    }
                }
                
                

            }
        }
    }
`

const audioList2 = [
    {
        name: 'Bedtime Stories',
        singer: 'Jay Chou',
        cover:
            'http://res.cloudinary.com/alick/image/upload/v1502375978/bedtime_stories_bywggz.jpg',
        musicSrc:
            'http://res.cloudinary.com/alick/video/upload/v1502375674/Bedtime_Stories.mp3',
    },
    
    {
        name: 'Dorost Nemisham',
        singer: 'Sirvan Khosravi',
        cover:
            'https://res.cloudinary.com/ehsanahmadi/image/upload/v1573758778/Sirvan-Khosravi-Dorost-Nemisham_glicks.jpg',
        musicSrc: () => {
            return Promise.resolve(
                'https://res.cloudinary.com/ehsanahmadi/video/upload/v1573550770/Sirvan-Khosravi-Dorost-Nemisham-128_kb8urq.mp3',
            )
        },
    },
    {
        name: '难得',
        singer: '安来宁',
        cover: '//cdn.lijinke.cn/nande.jpg',
        musicSrc: '//cdn.lijinke.cn/nande.mp3',
    },
]


const Splash: React.FC<any> = ({ classes }) => {
    const { loading, data, error } = useQuery(
        GET_TRACKS_QUERY

    )
    const [searchResults, setSearchResults] = useState([]);
     

    if (!data) return null;

    //map objects to correct keys
    const replacements = {
        'title': 'name', 'imgUrl': 'cover', 'url': 'musicSrc'
    }
    
    let newSearchList = searchResults.map((track) => {
        return Object.keys(track).map((key) => {
            const newKey = replacements[key] || key;
            return { [newKey]: track[key] }
        }).reduce((a, b) => Object.assign({}, a, b));
    })
        
        
        
        

    let newTrackList = data.tracks.map((track) => {
        return Object.keys(track).map((key) => {
            const newKey = replacements[key] || key;
            return { [newKey]: track[key] }
        }).reduce((a, b) => Object.assign({}, a, b));

    })
        
        
  

    const tracks = searchResults.length > 0 ? searchResults : data.tracks;
    const newTracks = searchResults.length > 0 ? newSearchList: newTrackList;

    debugger
    
    
    return (
        <div>
            <Row align={"middle"} justify="center">
                <SearchTrack setSearchResults={setSearchResults} />
            </Row>

       
{/*            
            <CreateTrack/> */}
            {loading ? <Loading/> : error ? <Error/> : <TrackList tracks={tracks}/>}
            {/* <ReactJkMusicPlayer
                
                audioLists={newTracks}
                theme='dark'
                defaultPosition={{ top: 0, left: 0 }}
                autoPlay={false}
                mode='full'
                showThemeSwitch={false}
                
            /> */}
        </div>
    )



}

export default Splash;

