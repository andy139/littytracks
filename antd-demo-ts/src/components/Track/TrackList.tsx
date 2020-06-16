import React, { useState } from "react";
import { Collapse, Select, List, Card, Avatar, Space } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, SettingOutlined } from '@ant-design/icons';
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


    
    

    return (
        <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: page => {
            console.log(page);
          },
          pageSize: 3,
        }}
        dataSource={tracks}
        footer={
          <div>
            <b>ant design</b> footer part
          </div>
        }
        renderItem={(item:any) => (
          <List.Item
            key={item.title}
            actions={[
                <LikeTrack trackId={item.id} likeCount={item.likes.length}/>,
            ]}
            extra={
              <img
                width={225}
                alt="logo"
                src={item.imgUrl ? item.imgUrl : "http://res.cloudinary.com/andytran/raw/upload/v1592239178/ksa9qczmaoicuqcgdo10" }
              />
            }
          >
            <List.Item.Meta
              avatar={<Avatar size={64} src={item.avatar ? item.avatar : "https://avatars1.githubusercontent.com/u/8186664?s=460&v=4"} />}
              title={<a href={item.href}>{item.title}</a>}
              description={item.postedBy.username}
            />
            <AudioPlayer url={item.url}/>
          </List.Item>
        )}
      />
    )



}

export default TrackList;