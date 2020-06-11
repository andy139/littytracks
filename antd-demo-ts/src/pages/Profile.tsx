import React, { useState } from "react";

import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import AudioPlayer from '../components/Shared/AudioPlayer';
import Error from '../components/Shared/Error';
import Loading from '../components/Shared/Loading';
import { create } from "domain";
import format from "date-fns/format";

import { PageHeader, List,Avatar, Space, Divider, Empty, Button } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import DeleteTrack from '../components/Track/DeleteTrack';
import UpdateTrack from '../components/Track/UpdateTrack';
import CreateTrack from '../components/Track/CreateTrack';
import client from 'apollo-client';

import './profile.css';

export const PROFILE_QUERY = gql`
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
                description
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
                description
                postedBy {
                    id
                    username
                }
                likes {
                id
                }
            }
        }
        
    }
    
`


const Profile: React.FC<any> = ({match, history, currentUser}) => {




    const {loading, data, error} = useQuery(
        PROFILE_QUERY,
        {
            variables:{id: match.params.id}
        }
    )
    

    if (loading) return <Loading/>

    if (error) return <Error error={error}/>




    
    const IconText = ({ icon, text }) => (
        <Space>
          {React.createElement(icon)}
          {text}
        </Space>
      );


    const emptyList = (
        <Empty
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{
          height: 60,
        }}
        description={
          <span>
            You got no music :(
          </span>
        }
      >
            <Button type="primary">Upload some cool sounds now!</Button>
      </Empty>
    )


    const createdTracks2 = (
        <List

        itemLayout="vertical"
        size="large"
        locale={{ emptyText: emptyList }}
        loading={false}
        dataSource={data.user.trackSet}
        renderItem={(track:any) => (
          <List.Item
         
          extra={
            <img
              width={272}
              alt="logo"
              src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
            />
          }
          actions={[
            // <IconText icon={LikeOutlined} text={track.likes.length} key="list-vertical-like-o" />,
        
            <UpdateTrack track={track}/>,
            <DeleteTrack track={track} userId={match.params.id}/>
          ]}
          >
            <List.Item.Meta
              avatar={<Avatar src='https://avatars1.githubusercontent.com/u/8186664?s=460&v=4' />}
              title={
                <div>
                    <div>
                        {track.title}
                    </div>
                    <div style={{color: 'rgba(0, 0, 0, 0.45)'}}>
                        {track.postedBy.username}
                    </div>

                </div>
              }
              description={<AudioPlayer url={track.url}></AudioPlayer>}
            />
                

          </List.Item>
        )}
      />
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
            <PageHeader
                className="site-page-header"
                onBack={() => history.goBack()}
                title={data.user.username}
                subTitle={`Joined ${data.user.dateJoined.substring(0, 10)}`}
                avatar={{ src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4' }}
            />
      
            <Divider orientation="left"><h3>Created Tracks</h3></Divider>
            {createdTracks2}
            <Divider orientation="left"><h3>Liked Tracks</h3></Divider>
            {likedTracks}

               

          
        </div>
    )



}

export default Profile;
