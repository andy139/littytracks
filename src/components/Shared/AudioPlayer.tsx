import React, { useState, useEffect } from 'react';
import { Collapse, Select, List, Card, Avatar, Space, Row, Col, Descriptions, Divider } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined, SettingOutlined, CaretRightOutlined } from '@ant-design/icons';

import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

import { useMutation } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { PlayButton, Timer, Progress, Icons, VolumeControl } from 'react-soundplayer/components';
import { withCustomAudio } from 'react-soundplayer/addons';
import LikeTrack from '../Track/LikeTrack';
import CommentTrack from '../Track/CommentTrack';
import UpdateTrack from '../Track/UpdateTrack';
import DeleteTrack from '../Track/DeleteTrack';
import { ME_QUERY } from '../../App';

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

const AudioPlayer: React.FC<any> = withCustomAudio((props) => {
	const { soundCloudAudio, trackTitle, match, imgUrl, playing, track, currentTime, duration } = props;
	const [ createPlay, { data, loading } ] = useMutation(CREATE_PLAY_MUTATION, {
		refetchQueries: [ { query: ME_QUERY } ]
	});
	const play = () => {
		if (playing) {
			soundCloudAudio.pause();
		} else {
			soundCloudAudio.play();
			createPlay({ variables: { trackId: track.id } });
		}
	};

	useEffect(() => {
		console.log(currentTime);
		console.log(duration);
		return () => {
			if (currentTime > duration / 2) {
				createPlay({ variables: { trackId: track.id } });
				console.log(currentTime);
				console.log(duration);
			}
		};
	}, []);

	return (
		<div className="trackBox">
			<Row align="middle" justify="center">
				<Col flex="0 1 300px" style={{ justifyContent: 'center', display: 'flex' }}>
					<img
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
						<Link to={`/profile/${track.postedBy.id}`}>{track.postedBy.username}</Link>
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
							<CommentTrack track={track} commentCount={track.comments.length} />
							<span style={{ float: 'right' }}>{track.plays.length} Plays</span>
						</Space>
					</Row>
				</Col>
			</Row>
		</div>
	);
});

export default AudioPlayer;
