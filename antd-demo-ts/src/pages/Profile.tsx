import React, { useState } from "react";

import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import AudioPlayer from '../components/Shared/AudioPlayer';
import Error from '../components/Shared/Error';
import Loading from '../components/Shared/Loading';
import { create } from "domain";
import format from "date-fns/format";

const PROFILE_QUERY = gql`
    query($id: Int!){
        user(id: $id) {
            id
            username
            dateJoined
            likeSet {
                id
                track {
                id
                title
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
            trackSet{
                id
                title
                url
                likes {
                id
                }
            }
        }
        
    }
    
`


const Profile: React.FC<any> = ({match}) => {

    debugger

    const {loading, data, error} = useQuery(
        PROFILE_QUERY,
        {
            variables:{id: match.params.id}
        }
    )
    

    if (loading) return <Loading/>

    if (error) return <Error error={error}/>
    

    const createdTracks = data.user.trackSet.map(track => 
        <div>
            Tite:{track.title} Likes:{track.likes.length}
            <AudioPlayer url={track.url}></AudioPlayer>
        </div>
    )

    const likedTracks = data.user.likeSet.map(({track}) => 
        <div>
            {track.title} {track.likes.length}
            {track.postedBy.username}
            <AudioPlayer url={track.url}></AudioPlayer>
        </div>
    )




    return (
        <div>
            {/* User info card */}
            <div>
                //AVATAR HERE {data.user.username[0]}
                //title= {data.user.username}

                //DATE = {`Joined ${format(
                  data.user.dateJoined,
                  "MMM Do, YYYY"
                )}`}
            </div>

            {/* CREATE TRACKS */}
            <div>
                // aUDO TRACK ICON
                CREATED trackSet
                {createdTracks}
            </div>
            {/* Likes tracks */}
            <div>
                LIKED trackSet
                {likedTracks}

               

            </div>
        </div>
    )



}

export default Profile;
