import React, { useState } from "react";

import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import SearchTrack from "../components/Track/SearchTrack";
import TrackList from "../components/Track/TrackList";
import CreateTrack from "../components/Track/CreateTrack";
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";


const GET_TRACKS_QUERY = gql`
    query getTracksQuery {
        tracks {
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

const Splash: React.FC<any> = ({ classes }) => {
    const { loading, data, error } = useQuery(
        GET_TRACKS_QUERY

    )

    

    return (
        <div>
            <SearchTrack/>
           
            <CreateTrack/>
            {loading ? <Loading/> : error ? <Error/> : <TrackList tracks={data.tracks}/>}
       
        </div>
    )



}

export default Splash;

