import React, { useState, useEffect, useContext } from 'react';
import {
	Collapse,
	Select,
	List,
	Card,
	Button,
	Avatar,
	Space,
	Row,
	Col,
	Modal,
	Divider,
	Layout,
	Typography
} from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, SettingOutlined, CaretRightOutlined } from '@ant-design/icons';

import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import $ from 'jquery';
import { useMutation } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { PlayButton, Timer, Progress, Icons, VolumeControl, Cover } from 'react-soundplayer/components';
import { withCustomAudio } from 'react-soundplayer/addons';
import LikeTrack from '../Track/LikeTrack';
import CommentTrack from '../Comment/CommentTrack';
import UpdateTrack from '../Track/UpdateTrack';
import DeleteTrack from '../Track/DeleteTrack';
import CommentList from '../Comment/CommentList';
import { ME_QUERY } from '../../App';

import { UserContext } from '../../App';
import UpdateBackground from './UpdateBackground';
import './shared.css';

const { Paragraph } = Typography;
const CREATE_PLAY_MUTATION = gql`
	mutation($trackId: Int!) {
		addPlaycount(trackId: $trackId) {
			track {
				id
			
			}
		}
	}
`;

export const GET_COMMENTS_QUERY = gql`
	query($trackId: Int!) {
		comments(trackId: $trackId) {
			comment
			postedBy {
				id
			}
			createdAt
			id
			postedBy {
				username
				id
				userprofile {
					avatarUrl
				}
			}
		}
	}
`;

const { SoundCloudLogoSVG, PlayIconSVG, PauseIconSVG, NextIconSVG, PrevIconSVG } = Icons;

const { Header, Footer, Sider, Content } = Layout;

const AudioPlayer: React.FC<any> = withCustomAudio((props) => {
	const {
		soundCloudAudio,
		trackTitle,
		tracks,
		match,
		currentUser,
		imgUrl,
		playing,
		track,
		currentTime,
		duration,
		gifNum,
		setGifNum
	} = props;
	const [ createPlay, { data, loading } ] = useMutation(CREATE_PLAY_MUTATION, {
		refetchQueries: [ { query: ME_QUERY } ]
	});

	const [ scrolling, setScroll ] = useState(true);

	const [ minimizePlayer, setMinimize ] = useState(true);

	const [ modal, setModal ] = useState(false);

	debugger;

	const setTrackModal = () => {
		setScroll(false);
		$('body').addClass('modal-open');
		// document.body.style.overflow = 'hidden';
		setModal(true);
	};

	const disableTrackModal = () => {
		setScroll(true);
		$('body').removeClass('modal-open');
		// document.body.style.overflow = 'unset';
		setModal(false);
	};

	const play = () => {
		if (playing) {
			soundCloudAudio.pause();
		} else {
			soundCloudAudio.play();
			createPlay({ variables: { trackId: track.id } });
		}
	};

	useEffect(
		() => {
			return () => {
				if (currentTime > duration / 2) {
					createPlay({ variables: { trackId: track.id } });
				}
			};
		},
		[ createPlay, currentTime, duration, track.id ]
	);

	const modalComponent = (
		<Modal
			title={
				// null
				<div className="modal-title-space">
					<Link to="/" style={{}} onClick={() => disableTrackModal()}>
						{/* <Title level={4} className='logo-font' style={{ color: "#d2e0fa" }}>LittyTracks</Title> */}
						<img src="https://django-app-images.s3-us-west-1.amazonaws.com/logo.png" style={{ width: 150 }} />
					</Link>
					{!minimizePlayer ? (
						<span className="top-music-player">
							<div className="music-settings">
								<span className="playButton3" style={{}} onClick={() => play()}>
									{playing ? (
										<span>
											{' '}
											<PauseIconSVG />
										</span>
									) : (
										<span>
											<PlayIconSVG />
										</span>
									)}
								</span>
								&nbsp;
								<VolumeControl
									className="music-settings"
									buttonClassName="volume-button2"
									rangeClassName="range-volume"
									{...props}
								/>
								<Progress {...props} className="bar-radius2" innerClassName="bar-color2" />
								{/* <Timer {...props} className="timer-top" /> */}
							</div>
						</span>
					) : null}

					<i
						className="fas fa-times-circle"
						style={{ fontSize: 45, cursor: 'pointer' }}
						onClick={() => disableTrackModal()}
					/>

					{/* <Button
						style={{
							margin: '15px'
						}}
						type="text"
						onClick={() => disableTrackModal()}
						}
					/> */}
				</div>
			}
			visible={modal}
			onCancel={() => disableTrackModal()}
			width="100%"
			style={{
				top: 0,
				margin: 0,
				position: 'fixed'
			}}
			closable={false}
			footer={null}
			bodyStyle={{ height: '100vh', overflowY: 'auto', padding: '0px' }}
		>
			{/* <Row className="player-background">
				<Button
					type="text"
					onClick={() => disableTrackModal()}
					icon={<i className="fas fa-times-circle" style={{ fontSize: 45, paddingBottom: '15px' }} />}
				/>
			</Row> */}

			<Row justify={'center'} align={'middle'} className="full-row">
				<Col span={16} className="col-padding col-blurry center-col row-modal">
					<div
						className="player-background"
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							backgroundImage: `url(${currentUser.userprofile.backgroundUrl})`
						}}
					>
		
					</div>

					{minimizePlayer ? (
						<div className="player-modal over">
							<Row align="middle" justify="center" gutter={[ 24, 16 ]}>
								<Col flex="0 1 400px" style={{ justifyContent: 'center', display: 'flex' }}>
									<img
										width={300}
										className="imgTrack"
										alt="logo"
										src={
											imgUrl ? imgUrl : 'http://res.cloudinary.com/andytran/raw/upload/v1592239178/ksa9qczmaoicuqcgdo10'
										}
									/>
								</Col>

								<Col flex="1 1 200px">
									<h2>Track</h2>
									<h1 style={{ fontSize: 40 }}>{trackTitle}</h1>
									<h2>By {track.artistName}</h2>
									&nbsp;
									<Timer {...props} className="timer" />
									<span className="playButton2" onClick={() => play()}>
										{playing ? (
											<span>
												{' '}
												<PauseIconSVG />&nbsp;&nbsp; PAUSE
											</span>
										) : (
											<span>
												<PlayIconSVG />&nbsp;&nbsp;PLAY
											</span>
										)}
									</span>
									<div className="music-settings">
										<VolumeControl
											className="music-settings"
											buttonClassName="volume-button"
											rangeClassName="range-volume"
											{...props}
										/>
										<Progress {...props} className="bar-radius" innerClassName="bar-color" />
									</div>
									<h1>{track.playcount.playCount} Plays</h1>
								</Col>
							</Row>
						</div>
					) : null}

					{/* Music Player */}
				</Col>
				<Col span={8} className="col-modal-right">
					<Row style={{
						display: 'flex',
						justifyContent: 'space-between',
						marginBottom: '10px'
					}}>
						<h2 style={{
							marginBottom: 0,
								display: 'flex',
							alignItems: 'center'
						}}>
							<Link to={`/profile/${track.postedBy.id}`}>
								<Avatar size="large" icon={<img src={track.postedBy.userprofile.avatarUrl} />} />
								&nbsp; {track.postedBy.username}
							</Link>
						</h2>

						<span className="player-options">
							<Button
								onClick={() => setMinimize(!minimizePlayer)}
								style={{
									margin: '10px',
									// opacity: '0.6'
								}}
								type="primary"
								shape="round"
							>
								{minimizePlayer ? 'Minimize Player' : 'Maximize Player'}
							</Button>

							<UpdateBackground />

						</span>
					
					</Row>
					<Paragraph>{track.description}</Paragraph>
					<LikeTrack trackId={track.id} likeCount={track.likes.length} />
					&nbsp;
					<CommentTrack track={track} commentCount={track.comments.length} setModal={setTrackModal} />
					<Divider />
					<CommentList trackId={track.id} comments={track.comments} disableTrackModal={disableTrackModal}/>
					{/* <div className="player-modal over">

						<Row align="middle" justify="center" gutter={[24, 16]}>
							<Col flex="0 1 400px" style={{ justifyContent: 'center', display: 'flex' }}>
								<img

									width={300}
									className="imgTrack"
									alt="logo"
									src={imgUrl ? imgUrl : 'http://res.cloudinary.com/andytran/raw/upload/v1592239178/ksa9qczmaoicuqcgdo10'}
								/>

							</Col>


							<Col flex="1 1 200px">
								<h2>Track</h2>

								<h1 style={{ fontSize: 40 }}>{trackTitle}</h1>
								<h2>By {track.artistName}</h2>
								&nbsp;
								<Timer {...props} className="timer" />

								<span className="playButton2" onClick={() => play()}>
									{playing ? (
										<span>
											{' '}
											<PauseIconSVG />&nbsp;&nbsp; PAUSE
										</span>
									) : (
											<span>
												<PlayIconSVG />&nbsp;&nbsp;PLAY
											</span>
										)}
								</span>

								<div className="music-settings">
									<VolumeControl
										className="music-settings"
										buttonClassName="volume-button"
										rangeClassName="range-volume"
										{...props}
									/>
									<Progress {...props} className="bar-radius" innerClassName="bar-color" />
								</div>

								<h1>{track.plays.length} Plays</h1>

							</Col>


						</Row>


					</div> */}
				</Col>
			</Row>
		</Modal>
	);

	return (
		<div className="trackBox">
			{modalComponent}

			<Row align="middle" justify="center">
				<Col flex="0 1 300px" style={{ justifyContent: 'center', display: 'flex' }}>
					<img
						// onClick={() => setTrackModal()}
						onClick={() => setTrackModal()}
						width={225}
						className="imgTrack"
						alt="logo"
						src={imgUrl ? imgUrl : 'http://res.cloudinary.com/andytran/raw/upload/v1592239178/ksa9qczmaoicuqcgdo10'}
					/>
				</Col>
				<Col flex="1 1 200px">
					<h2 className="header-title">
						{trackTitle} - {track.artistName}
						{match ? (
							<Space style={{ float: 'right' }}>
								{' '}
								<UpdateTrack track={track} />
								<DeleteTrack track={track} userId={match.params.id} />
							</Space>
						) : null}
					</h2>

					<h3>
						<Link to={`/profile/${track.postedBy.id}`}>
							<Avatar size="small" icon={<img src={track.postedBy.userprofile.avatarUrl} />} />
							&nbsp; {track.postedBy.username}
						</Link>
					</h3>

					{/* <PlayButton className="playButton" {...props}/>  */}
					<br />
					<Timer {...props} className="timer" />

					<div className="playButton" onClick={() => play()}>
						{playing ? (
							<span>
								{' '}
								<PauseIconSVG />&nbsp;&nbsp; PAUSE
							</span>
						) : (
							<span>
								<PlayIconSVG />&nbsp;&nbsp;PLAY
							</span>
						)}
					</div>

					<div className="music-settings">
						<VolumeControl
							className="music-settings"
							buttonClassName="volume-button"
							rangeClassName="range-volume"
							{...props}
						/>
						<Progress {...props} className="bar-radius" innerClassName="bar-color" />
					</div>
					<Divider />

					<Row>
						<Space>
							<LikeTrack trackId={track.id} likeCount={track.likes.length} />

							<CommentTrack track={track} commentCount={track.comments.length} setModal={setTrackModal} />
							<span style={{ float: 'right' }}>{track.playcount.playCount} Plays</span>
						</Space>
					</Row>
				</Col>
			</Row>
		</div>
	);
});

export default AudioPlayer;
