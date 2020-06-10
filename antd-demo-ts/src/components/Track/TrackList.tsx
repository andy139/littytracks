import React, { useState } from "react";
import { Collapse, Select, List, Card } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import {Link} from "react-router-dom";
import AudioPlayer from '../Shared/AudioPlayer';
import LikeTrack from "./LikeTrack";
import DeleteTrack from "./DeleteTrack";
import UpdateTrack from "./UpdateTrack";

import './track.css';


const { Panel } = Collapse;
const { Option } = Select;
const genExtra = () => (
    <SettingOutlined
        onClick={event => {
            // If you don't want click extra trigger collapse, you can prevent this:
            event.stopPropagation();
        }}
    />
);


const TrackList: React.FC<any>= ({ classes, tracks}) => {


    const allTracks = tracks.map(track => {

        let panelHeader = (
        
    
            <List>
                <List.Item>
                    <LikeTrack trackId={track.id} likeCount={track.likes.length} />

                </List.Item>
                <List.Item>
                    
                    <Link
                        to={`/profile/${track.postedBy.id}`}
                    >
                        {track.title}
                    </Link>
                    <br/>
                    {track.postedBy.username}

                  
                
                </List.Item>
                <List.Item>
                    <AudioPlayer url={track.url}/>

                </List.Item>
            </List>
           
        )
       
        return (<Collapse bordered={false} defaultActiveKey={['1']} expandIconPosition={'right'} >

                    <Panel header={panelHeader} key={track.id}>
                        {track.description}
                        <UpdateTrack track={track}/>
                        <DeleteTrack track={track}/>
                    </Panel>

                </Collapse>)
        }
    )

    return (
        <div>
            {allTracks}
        </div>
    )



}

export default TrackList;