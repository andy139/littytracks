import React, { useState } from 'react';
import { Row, Col } from 'antd';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import _ from 'lodash';

import SearchTrack from '../components/Track/SearchTrack';
import TrackList from '../components/Track/TrackList';
import CreateTrack from '../components/Track/CreateTrack';
import Loading from '../components/Shared/Loading';
import Error from '../components/Shared/Error';

import ReactJkMusicPlayer from 'react-jinke-music-player';
import 'react-jinke-music-player/assets/index.css';

export const GET_TRACKS_QUERY = gql`
	query getTracksQuery {
		tracks {
			id
			title
			description
			url
            imgUrl
            artistName
			likes {
				id
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
			comments {
				id
			
			}
		}
	}
`;

const Splash: React.FC<any> = ({ classes }) => {
	const { loading, data, error } = useQuery(GET_TRACKS_QUERY);
	const [ searchResults, setSearchResults ] = useState([]);

	if (!data) return null;

	//map objects to correct keys
	const replacements = {
		title: 'name',
		imgUrl: 'cover',
		url: 'musicSrc'
	};

	let newSearchList = searchResults.map((track) => {
		return Object.keys(track)
			.map((key) => {
				const newKey = replacements[key] || key;
				return { [newKey]: track[key] };
			})
			.reduce((a, b) => Object.assign({}, a, b));
	});

	let newTrackList = data.tracks.map((track) => {
		return Object.keys(track)
			.map((key) => {
				const newKey = replacements[key] || key;
				return { [newKey]: track[key] };
			})
			.reduce((a, b) => Object.assign({}, a, b));
	});

	const tracks = searchResults.length > 0 ? searchResults : data.tracks;
	const newTracks = searchResults.length > 0 ? newSearchList : newTrackList;

	return (
		<div>
			<Row align={'middle'} justify="center">
				<SearchTrack setSearchResults={setSearchResults} />
			</Row>

			           
            <CreateTrack/>
			{loading ? <Loading /> : error ? <Error /> : <TrackList tracks={tracks} />}

		</div>
	);
};

export default Splash;
