import React, { useState } from 'react';
import { Collapse, Select, List, Card, Avatar, Space, Row, Col, Descriptions } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, SettingOutlined, CaretRightOutlined, } from '@ant-design/icons';
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

const { Panel } = Collapse;
const { Option } = Select;
const genExtra = () => (
	<SettingOutlined
		onClick={(event) => {
			// If you don't want click extra trigger collapse, you can prevent this:
			event.stopPropagation();
		}}
	/>
);

const TrackList: React.FC<any> = ({ classes, tracks }) => {
	debugger;
	return (
		<List
			itemLayout="vertical"
			size="large"
			pagination={{
				onChange: (page) => {
					console.log(page);
				},
				pageSize: 6
			}}
			dataSource={tracks}
			footer={<div>Footer</div>}
			renderItem={(item: any) => {
				debugger;
				return (
					<List.Item
						key={item.title}
						// extra={
						// 	<img
						// 		width={225}
						// 		alt="logo"
						// 		src={
						// 			item.imgUrl ? (
						// 				item.imgUrl
						// 			) : (
						// 					'http://res.cloudinary.com/andytran/raw/upload/v1592239178/ksa9qczmaoicuqcgdo10'
						// 				)
						// 		}
						// 	/>
						// }
					>
						<List.Item.Meta
							avatar={
								<Avatar
									size={64}
									src={
										item.postedBy.userprofile.avatarUrl ? (
											item.postedBy.userprofile.avatarUrl
										) : (
											'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4'
										)
									}
								/>
							}
							title={item.title}
							description={<Link to={`/profile/${item.postedBy.id}`}>{item.postedBy.username}</Link>}
						/>

						<Row justify="center" >
							<Col flex="300px" style={{ display: 'flex', justifyContent: 'center' }}>
								<img
									width={225}
									alt="logo"
									src={
										item.imgUrl ? (
											item.imgUrl
										) : (
											'http://res.cloudinary.com/andytran/raw/upload/v1592239178/ksa9qczmaoicuqcgdo10'
										)
									}
								/>
							</Col>
							<Col flex="auto">
								<AudioPlayer url={item.url} />
								{/* <Descriptions title="User Info">
									
									
								</Descriptions>, */}
								<p style={{marginTop:"20px"}}>
									{item.description}

								</p>
								
							</Col>
						</Row>

						<Collapse
							bordered={false}
							// expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
							className="site-collapse-custom-collapse"
							expandIconPosition={'right'}
							style={{ marginTop: '20px' }}
						>
							<Panel
								header={
									<Space>
										<LikeTrack trackId={item.id} likeCount={item.likes.length} />
										<CommentTrack track={item} commentCount={item.comments.length} />
									</Space>
								}
								key="1"
								className="site-collapse-custom-panel"
							>
								<CommentList comments={item.comments} trackId={item.id} />
							</Panel>
						</Collapse>
					</List.Item>
				);
			}}
		/>
	);
};

export default TrackList;
