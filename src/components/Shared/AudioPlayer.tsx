import React, { useState, useEffect } from 'react';
import { Collapse, Select, List, Card,Button, Avatar, Space, Row, Col, Modal, Divider, Layout,Typography } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, SettingOutlined, CaretRightOutlined } from '@ant-design/icons';

import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

import { useMutation } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { PlayButton, Timer, Progress, Icons, VolumeControl, Cover} from 'react-soundplayer/components';
import { withCustomAudio } from 'react-soundplayer/addons';
import LikeTrack from '../Track/LikeTrack';
import CommentTrack from '../Track/CommentTrack';
import UpdateTrack from '../Track/UpdateTrack';
import DeleteTrack from '../Track/DeleteTrack';
import CommentList from '../Track/CommentList'
import { ME_QUERY } from '../../App';

import './shared.css'

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
const { SoundCloudLogoSVG, PlayIconSVG, PauseIconSVG, NextIconSVG, PrevIconSVG } = Icons;

const { Header, Footer, Sider, Content } = Layout;


const AudioPlayer: React.FC<any> = withCustomAudio((props) => {
	const { soundCloudAudio, trackTitle, tracks, match, imgUrl, playing, track, currentTime, duration,} = props;
	const [ createPlay, { data, loading } ] = useMutation(CREATE_PLAY_MUTATION, {
		refetchQueries: [ { query: ME_QUERY } ]
	});

	const [modal, setModal] = useState(false);


	const setTrackModal = () => {
		document.body.style.overflow = 'hidden'
		setModal(true)


	}

	const disableTrackModal = () => {
		document.body.style.overflow = 'unset';
		setModal(false)
	}



	const play = () => {
		if (playing) {
			soundCloudAudio.pause();
		} else {
			soundCloudAudio.play();
			createPlay({ variables: { trackId: track.id } });
		}
	};

	useEffect(() => {
	
		return () => {
			if (currentTime > duration / 2) {
				createPlay({ variables: { trackId: track.id } });
			
			}
		};
	}, []);

	const modalComponent = (
		<Modal
			title={<Link to="/" style={{}}>
				{/* <Title level={4} className='logo-font' style={{ color: "#d2e0fa" }}>LittyTracks</Title> */}
				<img src="https://django-app-images.s3-us-west-1.amazonaws.com/logo.png" style={{ width: 150 }} />
			</Link>}
			visible={modal}
			onCancel={() => disableTrackModal()}
			width='100%'
			style={{
				top: 20,
			
				// overflow: 'hidden',
			}}
			footer={null}

			bodyStyle={{height:'82vh'}}
			

		>
			
				
			<Row align={'middle'}>
				<Col span={12} className='col-padding col-blurry' >

					<Button type='text' onClick={() => setModal(false)} icon={<i className="fas fa-times-circle" style={{fontSize:45, paddingBottom:'15px'}}></i>}>

					</Button>
					<br/>
				
					<Cover trackName={trackTitle}
						className='coveralbum'
						artistName={track.artistName}
						backgroundUrl={track.imgUrl}
					>
						
	
					</Cover>

					<div className='player-modal'>
						<Timer {...props} className="timer" />

						<span className="playButton" onClick={() => play()}>
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

					</div>


					
					
				</Col>
				<Col span={12} className='col-padding'>

					{/* <Row>
						<h2 className="header-title">
							{trackTitle} - {track.artistName}
							{match ? <Space style={{ float: 'right' }}>
								{' '}

								<UpdateTrack track={track} />
								<DeleteTrack track={track} userId={match.params.id} />
							</Space> : null}

						</h2>
					</Row> */}
					<Row>
						<h2>

							<Link to={`/profile/${track.postedBy.id}`}>
								<Avatar size="large" icon={<img src={track.postedBy.userprofile.avatarUrl}></img>} />
							&nbsp; {track.postedBy.username}

							</Link>
						</h2>
				

					</Row>
					<Paragraph>
						{track.description}
					</Paragraph>
					

					<LikeTrack trackId={track.id} likeCount={track.likes.length} />
					&nbsp;
					<CommentTrack track={track} commentCount={track.comments.length} setModal={setTrackModal} />
					<Divider></Divider>
					<CommentList trackId={track.id} comments={track.comments}/>
				
				
				</Col>
		</Row>
		
		</Modal>
	)





	return (
		<div className="trackBox">

			
			{modalComponent}

			<Row align="middle" justify="center">
				<Col flex="0 1 300px" style={{ justifyContent: 'center', display: 'flex' }}>
					<img
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
                        {match ? <Space style={{ float: 'right' }}>
                            {' '}

                            <UpdateTrack track={track} />
                            <DeleteTrack track={track} userId={match.params.id} />
                        </Space> : null }
						
					</h2>

					<h3>

						<Link to={`/profile/${track.postedBy.id}`}>
							<Avatar size="small" icon={<img src={track.postedBy.userprofile.avatarUrl}></img>} />
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

							<CommentTrack track={track} commentCount={track.comments.length} setModal={setTrackModal}  />
							<span style={{ float: 'right' }}>{track.plays.length} Plays</span>
						</Space>
					</Row>
				</Col>
			</Row>
		</div>
	);
});

export default AudioPlayer;
