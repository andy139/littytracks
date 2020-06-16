import React, { useState } from "react";

import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import SearchTrack from "../components/Track/SearchTrack";
import TrackList from "../components/Track/TrackList";
import CreateTrack from "../components/Track/CreateTrack";
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";


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
            }
        }
    }
`

const Splash: React.FC<any> = ({ classes }) => {
    const { loading, data, error } = useQuery(
        GET_TRACKS_QUERY

    )
    const [searchResults, setSearchResults] = useState([]);
     

    if (!data) return null;
    const tracks = searchResults.length > 0 ? searchResults : data.tracks;
    
    return (
        <div>
            <SearchTrack setSearchResults={setSearchResults}/>
           
            <CreateTrack/>
            {loading ? <Loading/> : error ? <Error/> : <TrackList tracks={tracks}/>}
       
        </div>
    )



}

export default Splash;

