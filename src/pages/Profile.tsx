import React, { useState, useEffect } from 'react';

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
					artistName
					imgUrl
					likes {
						id
					}
					comments {
						id
						comment
						createdAt
						postedBy {
							username
							id
							userprofile {
								avatarUrl
							}
						}
						subcomments {
							subcomment
							id
							createdAt
							postedBy {
								username
								id
								userprofile {
									avatarUrl
								}
							}
						}
					}
					playcount {
						playCount
					}
					postedBy {
						id
						username
						userprofile {
							avatarUrl
						}
					}
				}
			}
			trackSet {
				id
				title
				url
				description
				artistName
				imgUrl
				comments {
					id
					comment
					createdAt
					postedBy {
						username
						id
						userprofile {
							avatarUrl
						}
					}
					subcomments {
						subcomment
						id
						createdAt
						postedBy {
							username
							id
							userprofile {
								avatarUrl
							}
						}
					}
				}
				postedBy {
					id
					username
					userprofile {
						avatarUrl
					}
				}
				playcount {
					playCount
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

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const [open, openTrack] = useState(false);

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
				height: 110
			}}
			description={
				<span>
					{currentUser.id === match.params.id ? (
						<span>
							You got no music!
							<Row justify={'center'} style={{ marginTop: 10 }}>
								<CreateTrack isProfile={true} />
							</Row>
						</span>
					) : (
							'This user has no music yet'
						)}
				</span>
			}
		>
			{/* <Button type="primary">Upload some cool sounds now!</Button> */}
		</Empty>
	);

	const emptyLikes = (
		<Empty
			image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
			imageStyle={{
				height: 110
			}}
			description={
				<span>{currentUser.id === match.params.id ? 'You have no likes yet!' : 'This user has no likes yet'}</span>
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
			pagination={{
				onChange: (page) => { },
				pageSize: 4
			}}
			style={{ paddingBottom: 15 }}
			dataSource={data.user.trackSet}
			footer={<div />}
			renderItem={(track: any) => (
				<List.Item>
					<AudioPlayer
						clientId={'xxx'}
						currentUser={currentUser}
						streamUrl={track.url}
						match={match}
						trackTitle={track.title}
						imgUrl={track.imgUrl}
						track={track}
					/>
				</List.Item>
			)}
		/>
	);

	const likedTracks2 = (
		<List
			itemLayout="vertical"
			size="large"
			locale={{ emptyText: emptyLikes }}
			pagination={{
				onChange: (page) => { },
				pageSize: 4
			}}
			loading={false}
			dataSource={data.user.likeSet}
			footer={<div />}
			style={{ paddingBottom: 15 }}
			renderItem={({ track }: any) => (
				<List.Item>
					<AudioPlayer
						streamUrl={track.url}
						currentUser={currentUser}
						match={match}
						trackTitle={track.title}
						imgUrl={track.imgUrl}
						track={track}
						
					/>
				</List.Item>
			)}
		/>
	);

	const timestamp = data.user.dateJoined;
	const date = moment(timestamp);
	const formattedDate = date.format('LL');
	return (
		<div>
			{/* User info card */}
			<PageHeader
				style={{ marginTop: 20 }}
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
				<UpdateAvatar style={{ marginRight: '100' }} userId={match.params.id} />
			</PageHeader>

			<Tabs defaultActiveKey="1">
				<TabPane
					tab={
						<span style={{ fontSize: 20 }}>
							{/* <AppleOutlined /> */}
							Tracks
						</span>
					}
					key="1"
				>
					{createdTracks2}
				</TabPane>
				<TabPane
					tab={
						<span style={{ fontSize: 20 }}>
							{/* <AndroidOutlined /> */}
							Likes
						</span>
					}
					key="2"
				>
					{likedTracks2}
				</TabPane>
			</Tabs>

			{match.params.id === currentUser.id ? <CreateTrack userId={match.params.id} /> : null}
		</div>
	);
};

export default Profile;
