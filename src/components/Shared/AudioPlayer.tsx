import React, { useState, useEffect } from 'react';
import {
	Button,
	Avatar,
	Space,
	Row,
	Col,
	Modal,
	Divider,
	Typography
} from 'antd';

import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import $ from 'jquery';
import { useMutation } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import {Timer, Progress, Icons, VolumeControl, Cover } from 'react-soundplayer/components';
import { withCustomAudio } from 'react-soundplayer/addons';
import LikeTrack from '../Track/LikeTrack';
import CommentTrack from '../Comment/CommentTrack';
import UpdateTrack from '../Track/UpdateTrack';
import DeleteTrack from '../Track/DeleteTrack';
import CommentList from '../Comment/CommentList';
import { ME_QUERY } from '../../App';
import UpdateBackground from './UpdateBackground';
import { backgroundGifs } from './UpdateBackground';
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

const {PlayIconSVG, PauseIconSVG } = Icons;


const AudioPlayer: React.FC<any> = withCustomAudio((props) => {
	const {
		soundCloudAudio,
		trackTitle,
		match,
		backgroundUrl,
		imgUrl,
		playing,
		track,
		currentTime,
		duration,
	} = props;
	const [ createPlay, { data, loading } ] = useMutation(CREATE_PLAY_MUTATION, {
		refetchQueries: [ { query: ME_QUERY } ]
	});


	const [ scrolling, setScroll ] = useState(true);
	const [ minimizePlayer, setMinimize ] = useState(true);
	const [modal, setModal] = useState(false);
	const [backgroundNum, setBackgroundNum] = useState(1)



	const setTrackModal = () => {
		setScroll(false);
		$('body').addClass('modal-open');
		document.body.style.overflow = 'hidden';
		setModal(true);
	};

	const disableTrackModal = () => {
		setScroll(true);
		$('body').removeClass('modal-open');
		document.body.style.overflow = 'unset';
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
							</div>
						</span>
					) : null}

					<i
						className="fas fa-times-circle"
						style={{ fontSize: 30, cursor: 'pointer' }}
						onClick={() => disableTrackModal()}
					/>
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
			bodyStyle={{ height: '100vh',  padding: '0px' }}
		>

			<Row justify={'center'} align={'middle'} className="full-row">
				<Col span={16} className="col-padding col-blurry center-col row-modal">
					<div
						className="player-background"
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							backgroundImage: `url(${backgroundGifs[backgroundNum]})`
						}}
					/>

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
					<Row
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							marginBottom: '10px'
						}}
					>
						<h2
							style={{
								marginBottom: 0,
								display: 'flex',
								alignItems: 'center'
							}}
						>
							<Link to={`/profile/${track.postedBy.id}`}>
								<Avatar size="large" icon={<img src={track.postedBy.userprofile.avatarUrl} />} />
								&nbsp; {track.postedBy.username}
							</Link>
						</h2>

						<span className="player-options">
							<Button
								onClick={() => setMinimize(!minimizePlayer)}
								style={{
									margin: '10px'
									// opacity: '0.6'
								}}
								type="primary"
								shape="round"
							>
								{minimizePlayer ? 'Minimize Player' : 'Maximize Player'}
							</Button>
							<UpdateBackground setBackgroundNum={setBackgroundNum} backgroundNum={backgroundNum}/>
						</span>
					</Row>
					<Paragraph>{track.description}</Paragraph>
					<LikeTrack trackId={track.id} likeCount={track.likes.length} />
					&nbsp;
					<CommentTrack track={track} commentCount={track.comments.length} setModal={setTrackModal} />
					<Divider />
					<CommentList trackId={track.id} comments={track.comments} disableTrackModal={disableTrackModal} />
				</Col>
			</Row>
		</Modal>
	);

	debugger

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
