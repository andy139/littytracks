import React, { useState, useContext } from 'react';
import { Collapse, Select, Carousel, List, Card, Avatar, Space, Row, Col, Descriptions, Divider, Modal } from 'antd';
import { SettingOutlined} from '@ant-design/icons';
import AudioPlayer from '../Shared/AudioPlayer';
import {UserContext} from '../../App'
import './track.css';



const genExtra = () => (
	<SettingOutlined
		onClick={(event) => {
			// If you don't want click extra trigger collapse, you can prevent this:
			event.stopPropagation();
		}}
	/>
);



const TrackList: React.FC<any> = ({ classes, tracks }) => {

	
	const currentUser: any = useContext(UserContext);

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
				
						<AudioPlayer tracks={tracks} backgroundUrl={currentUser.userprofile.backgroundUrl}  streamUrl={item.url} trackTitle={item.title} imgUrl={item.imgUrl} track={item} clientId={'xxx'}   />
				
					</List.Item>
				);
			}}
			/>
		</>
	);
};

export default TrackList;
