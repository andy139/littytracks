import React, { useState } from 'react';
import { Collapse, Select, List, Card, Avatar, Space, Row, Col, Descriptions } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, SettingOutlined, CaretRightOutlined } from '@ant-design/icons';



import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Link } from 'react-router-dom';
import AudioPlayer from '../Shared/AudioPlayer';
import LikeTrack from './LikeTrack';
import DeleteTrack from './DeleteTrack';
import UpdateTrack from './UpdateTrack';
import CommentTrack from './CommentTrack';
import CommentList from './CommentList';

import './track.css';
import { OmitProps } from 'antd/lib/transfer/ListBody';

import { PlayButton, Timer, Progress, Icons, VolumeControl } from 'react-soundplayer/components';
import { withCustomAudio } from 'react-soundplayer/addons';

const {
	SoundCloudLogoSVG,
	PlayIconSVG,
	PauseIconSVG,
	NextIconSVG,
	PrevIconSVG
} = Icons;

const { Panel } = Collapse;
const { Option } = Select;

const AWSSoundPlayer = withCustomAudio((props) => {
	const {  soundCloudAudio, trackTitle, imgUrl, playing } = props;

	const play = () => {
		if (playing) {
			 soundCloudAudio.pause();
		} else {
			 soundCloudAudio.play();
		}
	};

	return (
		<div className='trackBox'>
			
			<Row align='middle' justify='center'> 
				<Col flex="0 1 300px" style={{ justifyContent: 'center', display:'flex'}}>
					<img
						width={200}
						className='imgTrack'
						alt="logo"
						src={
							imgUrl ? (
								imgUrl
							) : (
								'http://res.cloudinary.com/andytran/raw/upload/v1592239178/ksa9qczmaoicuqcgdo10'
							)
						}
					/>
				</Col>
				<Col flex="1 1 200px">
					<h2>{trackTitle}</h2>

					{/* <PlayButton className="playButton" {...props}/>  */}
			
					<div className='playButton' onClick={() => play()}>
						{playing ? <span> <PauseIconSVG />&nbsp;&nbsp; PAUSE</span> : <span><PlayIconSVG />&nbsp;&nbsp;PLAY</span>}
					</div>
					
					<Timer {...props} />
					<Progress {...props} />
					<VolumeControl style={{ width: 50 }} {...props} />
				</Col>
			</Row>
		</div>
	);
});

const genExtra = () => (
	<SettingOutlined
		onClick={(event) => {
			// If you don't want click extra trigger collapse, you can prevent this:
			event.stopPropagation();
		}}
	/>
);

const TrackList: React.FC<any> = ({ classes, tracks }) => {
	return (
		<List
			itemLayout="vertical"
			size="large"
			pagination={{
				onChange: (page) => {
					console.log(page);
				},
				pageSize: 3
			}}
			
			dataSource={tracks}
			footer={<div />}
			renderItem={(item: any) => {
				return (
					<List.Item style={{ borderRadius: '4px' }}> 
						<AWSSoundPlayer streamUrl={item.url} trackTitle={item.title} imgUrl={item.imgUrl} preloadType="metadata" />
					</List.Item>

					// <List.Item
					// 	key={item.title}

					// >
					// 	<List.Item.Meta
					// 		avatar={
					// 			<Avatar
					// 				size={64}
					// 				src={
					// 					item.postedBy.userprofile.avatarUrl ? (
					// 						item.postedBy.userprofile.avatarUrl
					// 					) : (
					// 						'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4'
					// 					)
					// 				}
					// 			/>
					// 		}
					// 		title={item.title}
					// 		description={<Link to={`/profile/${item.postedBy.id}`}>{item.postedBy.username}</Link>}
					// 	/>

					// 	<Row justify="center" >
					// 		<Col flex="300px" style={{ display: 'flex', justifyContent: 'center' }}>
					// 			<img
					// 				width={175}
					// 				alt="logo"
					// 				src={
					// 					item.imgUrl ? (
					// 						item.imgUrl
					// 					) : (
					// 						'http://res.cloudinary.com/andytran/raw/upload/v1592239178/ksa9qczmaoicuqcgdo10'
					// 					)
					// 				}
					// 			/>
					// 		</Col>
					// 		<Col flex="auto">
					// 			<AudioPlayer url={item.url} />
					// 			{/* <Descriptions title="User Info">

					// 			</Descriptions>, */}
					// 			<p style={{marginTop:"20px"}}>
					// 				{item.description}

					// 			</p>

					// 		</Col>
					// 	</Row>

					// 	<Collapse
					// 		bordered={false}
					// 		// expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
					// 		className="site-collapse-custom-collapse"
					// 		expandIconPosition={'right'}
					// 		style={{ marginTop: '20px' }}
					// 	>
					// 		<Panel
					// 			header={
					// 				<Space>
					// 					<LikeTrack trackId={item.id} likeCount={item.likes.length} />
					// 					<CommentTrack track={item} commentCount={item.comments.length} />
					// 				</Space>
					// 			}
					// 			key="1"
					// 			className="site-collapse-custom-panel"
					// 		>
					// 			<CommentList comments={item.comments} trackId={item.id} />
					// 		</Panel>
					// 	</Collapse>

					// 	<AWSSoundPlayer
					// 		streamUrl={streamUrl}
					// 		trackTitle={trackTitle}
					// 		preloadType="metadata" />

					// </List.Item>
				);
			}}
		/>
	);
};

export default TrackList;
