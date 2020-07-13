import React, { useState } from 'react';
import { Collapse, Select, Carousel, List, Card, Avatar, Space, Row, Col, Descriptions, Divider, Modal } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, SettingOutlined, CaretRightOutlined } from '@ant-design/icons';



import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Link } from 'react-router-dom';
import AudioPlayer from '../Shared/AudioPlayer';
import LikeTrack from './LikeTrack';
import DeleteTrack from './DeleteTrack';
import UpdateTrack from './UpdateTrack';
import CommentTrack from '../Comment/CommentTrack';
import CommentList from '../Comment/CommentList';

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
		<>

			

		<List
			itemLayout="vertical"
			size="large"
			pagination={{
				onChange: (page) => {
			
				},
				pageSize: 4
			}}
			style={{ paddingBottom:'15px',}}
			
			dataSource={tracks}
			footer={<div></div>}
			renderItem={(item: any) => {
				return (
					<List.Item style={{ borderRadius: '4px' }}> 
				
						<AudioPlayer tracks={tracks} streamUrl={item.url} trackTitle={item.title} imgUrl={item.imgUrl} track={item} clientId={'xxx'} preloadType="metadata"  />
				
					</List.Item>
				);
			}}
			/>
		</>
	);
};

export default TrackList;
