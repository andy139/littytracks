import React, { useState } from 'react';
import { Collapse, Select, List, Card, Avatar, Space, Row, Col, Descriptions, Divider } from 'antd';
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
				
						<AudioPlayer streamUrl={item.url} trackTitle={item.title} imgUrl={item.imgUrl} track={item} preloadType="metadata" />
					</List.Item>
				);
			}}
		/>
	);
};

export default TrackList;
