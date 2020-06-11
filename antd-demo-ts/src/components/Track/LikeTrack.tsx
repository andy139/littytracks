import React, {useState, useContext} from "react";

import {useMutation} from "@apollo/react-hooks";
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import {Button, Space} from "antd";
import {UserContext} from "../../App";
import { gql } from "apollo-boost";
import {ME_QUERY} from "../../App";


const CREATE_LIKE_MUTATION = gql`
    mutation($trackId: Int!){
        createLike(trackId: $trackId){
            track {
                id
                likes {
                    id
                }
            }
        }
    }

`

const IconText = ({ icon, text }) => (
    <span>
      {text}
      {icon}
    </span>
  );

const LikeTrack:React.FC<any> = ({trackId, likeCount}) => {

    const [createLike, {data, loading}] = useMutation(CREATE_LIKE_MUTATION,{
        refetchQueries:[{query:ME_QUERY}]
      });
    const currentUser:any = useContext(UserContext);


    if (!currentUser) return null;


    debugger

    const disableLikes:any = () => {
        const userLikes:any = currentUser.likeSet

        const isTrackLiked =
            userLikes.findIndex(({ track }) => track.id === trackId) > -1;


        debugger
        return isTrackLiked;
    }
    
    return (
    
        <IconText 
            icon={

            <Button type="text" 
                    shape="circle" 
                    
                    disabled={disableLikes()}
                         
            >
                <i className="fas fa-thumbs-up"
                        onClick={(event) => {
                            event.stopPropagation();
                      
                            createLike({variables:{trackId:parseInt(trackId)}}).then((data)=>console.log(data));
                        }
                }/>
            </Button>

            } 
            text={likeCount} 
        />
       
  
    )



}

export default LikeTrack;
