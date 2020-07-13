import React, { useState, useEffect } from 'react';
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

// import styles from './shared.css';

const backgroundGifs = [
	'https://66.media.tumblr.com/900d93b71b6061e043a0aaa2f91a025e/fcf075c8db503555-f4/s540x810/ea7b280580ad959eac6e3d81304bc55b0d34d726.gif',
	'https://66.media.tumblr.com/1b9859af9aecd7ca666df0015aa1cb10/tumblr_oras0eWIDg1vhvnzyo1_500.gif',
	'https://66.media.tumblr.com/d90f205bed27f5a7480616237e93143a/tumblr_ovtfzbaGUR1vu5dwpo1_500.gif',
	'https://66.media.tumblr.com/75b6803d9d1e84cfa2db697b9239c13e/tumblr_on533uMc731utwxd1o1_500.gif',
	'https://66.media.tumblr.com/68b6f2ae22f5c2c80384affc385d1f8e/tumblr_owcib08z7g1vur2auo1_500.gif',
	'https://66.media.tumblr.com/ff3dbf048d78c4ac623178fab00078f6/tumblr_pg1yi12uiU1tcvan1o1_540.gif',
	'https://66.media.tumblr.com/08a708f46a33f81701f0e016f01a5b6d/tumblr_pxmj3f9uUF1rldv4go1_400.gif',
	'https://66.media.tumblr.com/8ad1daf5cdd6a52495104f749ffdd5f7/tumblr_ph89ylzo9g1rzlojlo1_540.gif',
	'https://66.media.tumblr.com/d757c71b9d3b703a96af6dada4f7e49a/tumblr_p8ofbvhm4s1wxdq3zo1_500.gif',
	'https://66.media.tumblr.com/eb1d86f747efdd869aecd1f8be75260c/tumblr_p54ik4BRAj1tcvan1o1_500.gif',


]

const { Paragraph } = Typography;
const CREATE_PLAY_MUTATION = gql`
	mutation($trackId: Int!) {
		createPlay(trackId: $trackId) {
			track {
				id
			}
		}
	}
`;

export const GET_COMMENTS_QUERY = gql`
    query($trackId: Int!){
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

`

const { SoundCloudLogoSVG, PlayIconSVG, PauseIconSVG, NextIconSVG, PrevIconSVG } = Icons;

const { Header, Footer, Sider, Content } = Layout;

const AudioPlayer: React.FC<any> = withCustomAudio((props) => {
	const { soundCloudAudio, trackTitle, tracks, match, imgUrl, playing, track, currentTime, duration, gifNum, setGifNum } = props;
	const [ createPlay, { data, loading } ] = useMutation(CREATE_PLAY_MUTATION, {
		refetchQueries: [ { query: ME_QUERY } ]
	});

	const [ scrolling, setScroll ] = useState(true);

	const [ modal, setModal ] = useState(false);

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
				null
				// <Link to="/" style={{}}>
				// 	{/* <Title level={4} className='logo-font' style={{ color: "#d2e0fa" }}>LittyTracks</Title> */}
				// 	<img src="https://django-app-images.s3-us-west-1.amazonaws.com/logo.png" style={{ width: 150 }} />
				// </Link>
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
			bodyStyle={{ height: '100vh', overflowY: 'auto' }}
			
			
		>
			{/* <Row className="player-background">
				<Button
					type="text"
					onClick={() => disableTrackModal()}
					icon={<i className="fas fa-times-circle" style={{ fontSize: 45, paddingBottom: '15px' }} />}
				/>
			</Row> */}


			<Row justify={'center'} className='full-row'> 
			
				<Col span={16} className="col-padding col-blurry center-col row-modal">
					<div className='player-background'>
						<Button
							type="text"
							onClick={() => disableTrackModal()}
							icon={<i className="fas fa-times-circle" style={{ fontSize: 45, paddingBottom: '15px' }} />}
						/>

					

					</div>

					<div className="player-modal over">

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


					</div>
					

					{/* Music Player */}
				</Col>
				<Col span={8} className="col-modal-right" >
				
					<Row>
						<h2>
							<Link to={`/profile/${track.postedBy.id}`}>
								<Avatar size="large" icon={<img src={track.postedBy.userprofile.avatarUrl} />} />
								&nbsp; {track.postedBy.username}
							</Link>
						</h2>
					</Row>
					<Paragraph>{track.description}</Paragraph>
					<LikeTrack trackId={track.id} likeCount={track.likes.length} />
					&nbsp;
					<CommentTrack track={track} commentCount={track.comments.length} setModal={setTrackModal} />
					<Divider />
				

					<CommentList trackId={track.id} comments={track.comments} />
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
							<span style={{ float: 'right' }}>{track.plays.length} Plays</span>
						</Space>
					</Row>
				</Col>
			</Row>
		</div>
	);
});

export default AudioPlayer;
