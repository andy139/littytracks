import React, { useState } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import AudioPlayer from '../components/Shared/AudioPlayer';
import Error from '../components/Shared/Error';
import Loading from '../components/Shared/Loading';
import { create } from 'domain';
import format from 'date-fns/format';
import moment from 'moment';
import { PageHeader, List, Avatar, Space, Divider, Empty, Button, Descriptions, Row, Col, Tabs } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import DeleteTrack from '../components/Track/DeleteTrack';
import UpdateTrack from '../components/Track/UpdateTrack';
import CreateTrack from '../components/Track/CreateTrack';
import UploadAvatar from '../components/Track/UpdateAvatar';
import client from 'apollo-client';

import './profile.css';
import UpdateAvatar from '../components/Track/UpdateAvatar';

export const PROFILE_QUERY = gql`
	query($id: Int!) {
		user(id: $id) {
			id
			username
			dateJoined
			userprofile {
				avatarUrl
			}
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
			trackSet {
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
`;

const { TabPane } = Tabs;

const Profile: React.FC<any> = ({ match, history, currentUser }) => {
	const { loading, data, error } = useQuery(PROFILE_QUERY, {
		variables: { id: match.params.id }
	});

	if (loading) return <Loading />;

	if (error) return <Error error={error} />;

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
				height: 60
			}}
			description={
				<span>{currentUser.id === match.params.id ? 'You got no music :(' : 'This user has no music yet'}</span>
			}
		>
			{/* <Button type="primary">Upload some cool sounds now!</Button> */}
		</Empty>
	);

	const emptyLikes = (
		<Empty
			image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
			imageStyle={{
				height: 60
			}}
			description={
				<span>{currentUser.id === match.params.id ? 'This user has no likes yet' : 'This user has no likes yet'}</span>
			}
		>
			{/* <Button type="primary">Upload some cool sounds now!</Button> */}
		</Empty>
	);

	const createdTracks2 = (
		<List
			itemLayout="vertical"
			size="large"
			locale={{ emptyText: emptyList }}
			loading={false}
			dataSource={data.user.trackSet}
			renderItem={(track: any) => (
				<List.Item
					extra={
						<img
							width={225}
							alt="logo"
							src={
								track.imgUrl ? (
									track.imgUrl
								) : (
									'http://res.cloudinary.com/andytran/raw/upload/v1592239178/ksa9qczmaoicuqcgdo10'
								)
							}
						/>
					}
					actions={[
						// <IconText icon={LikeOutlined} text={track.likes.length} key="list-vertical-like-o" />,

						<UpdateTrack track={track} />,
						<DeleteTrack track={track} userId={match.params.id} />
					]}
				>
					<List.Item.Meta
						avatar={<Avatar src="https://avatars1.githubusercontent.com/u/8186664?s=460&v=4" />}
						title={
							<div>
								<div>{track.title}</div>
								<div style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{track.postedBy.username}</div>
							</div>
						}
						description={<AudioPlayer url={track.url} />}
					/>
				</List.Item>
			)}
		/>
	);

	const likedTracks = data.user.likeSet.map(({ track }) => (
		<div>
			{track.title} {track.likes.length}
			{track.postedBy.username}
			<AudioPlayer url={track.url} />
		</div>
	));

	const likedTracks2 = (
		<List
			itemLayout="vertical"
			size="large"
			locale={{ emptyText: emptyLikes }}
			loading={false}
			dataSource={data.user.likeSet}
			renderItem={({ track }: any) => (
				<List.Item
					extra={
						<img
							width={225}
							alt="logo"
							src={
								track.imgUrl ? (
									track.imgUrl
								) : (
									'http://res.cloudinary.com/andytran/raw/upload/v1592239178/ksa9qczmaoicuqcgdo10'
								)
							}
						/>
					}
					actions={[
						// <IconText icon={LikeOutlined} text={track.likes.length} key="list-vertical-like-o" />,

						<UpdateTrack track={track} />,
						<DeleteTrack track={track} userId={match.params.id} />
					]}
				>
					<List.Item.Meta
						avatar={<Avatar src="https://avatars1.githubusercontent.com/u/8186664?s=460&v=4" />}
						title={
							<div>
								<div>{track.title}</div>
								<div style={{ color: 'rgba(0, 0, 0, 0.45)' }}>{track.postedBy.username}</div>
							</div>
						}
						description={<AudioPlayer url={track.url} />}
					/>
				</List.Item>
			)}
		/>
	);


	const timestamp = data.user.dateJoined
	const date = moment(timestamp)
	const formattedDate = date.format('LL');
	return (
		<div>
			{/* User info card */}
			<PageHeader
				style={{marginTop: 20}}
				className="site-page-header"
				onBack={() => history.goBack()}
				title={
					<div>
						<Row>{data.user.username}</Row>
						<Row />
					</div>
				}
				subTitle={`Joined ${formattedDate}`}
				avatar={{
					src:
						data.user.userprofile.avatarUrl === ''
							? 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4'
							: data.user.userprofile.avatarUrl,
					size: 180
				}}
			>
				<UpdateAvatar style={{marginRight:'100'}} userId={match.params.id} />
				{/* <Descriptions size="small" column={3}>
					<Descriptions.Item>
						<UpdateAvatar userId={match.params.id} />
					</Descriptions.Item>
				</Descriptions> */}
			</PageHeader>

			<Tabs defaultActiveKey="1">
				<TabPane
					tab={
						<span>
							{/* <AppleOutlined /> */}
							Music
						</span>
					}
					key="1"
				>
					<h3>Created Tracks</h3>

					{createdTracks2}
				</TabPane>
				<TabPane
					tab={
						<span>
							{/* <AndroidOutlined /> */}
							Likes
						</span>
					}
					key="2"
				>
					<h3>Liked Tracks</h3>
		
				{likedTracks2}
				</TabPane>
			</Tabs>

		

			{match.params.id === currentUser.id ? <CreateTrack userId={match.params.id} /> : null}
		</div>
	);
};

export default Profile;
