import React, { useState, useContext } from "react";
import {Button} from 'antd';
import {DeleteOutlined} from '@ant-design/icons'
import {UserContext} from '../../App';
import {useMutation} from "@apollo/react-hooks";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import {GET_TRACKS_QUERY} from "../../pages/Splash";

const DELETE_TRACK_MUTATION = gql`
    mutation($trackId: Int!){
        deleteTrack(trackId: $trackId){
            trackId
        }
    }

`

const DeleteTrack:React.FC<any> = ({track}) => {

    const currentUser:any = useContext(UserContext);
    const isCurrentUser = currentUser.id === track.postedBy.id;

    const [deleteTrack, {loading, error}] = useMutation(
            DELETE_TRACK_MUTATION, 
            {
                update(cache, {data: {deleteTrack}}) {
        
                    const data:any = cache.readQuery({
                    query: GET_TRACKS_QUERY
                    })
        
                    const index = data.tracks.findIndex(
                        track => Number(track.id) === deleteTrack.trackId
                    )

                    const tracks = [...data.tracks.slice(0, index), ...data.tracks.slice(index+1)]

                    cache.writeQuery({query: GET_TRACKS_QUERY, data: {tracks}})
        
                }
        
            }
        )
      ;


    if (!isCurrentUser) return null;

    return (
        <>
            <Button 
                icon={<DeleteOutlined />} 
                type="primary" 
                shape="circle"
                onClick={() => {
                    deleteTrack({variables: {trackId: track.id}})
                        .then((data) => {
                            console.log(data)
                        })
                }}
            
            ></Button>
        </>
    )



}

export default DeleteTrack;
