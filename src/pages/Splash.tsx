import React, {createContext, useState } from 'react';
import { Row, Col } from 'antd';

import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import _ from 'lodash';

import SearchTrack from '../components/Track/SearchTrack';
import TrackList from '../components/Track/TrackList';
import CreateTrack from '../components/Track/CreateTrack';
import Loading from '../components/Shared/Loading';
import Error from '../components/Shared/Error';

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



const Splash: React.FC<any> = ({ classes, searchResults }) => {
	const { loading, data, error } = useQuery(GET_TRACKS_QUERY);
	// const [searchResults, setSearchResults] = useState([]);
	

	debugger

	if (!data) return null;

	const tracks = searchResults.length > 0 ? searchResults : data.tracks;

	debugger
	return (
		<div>
			{/* <Row align={'middle'} justify="center">
				<SearchTrack setSearchResults={setSearchResults} />
			</Row> */}

			           
            <CreateTrack/>
			{loading ? <Loading /> : error ? <Error /> : <TrackList tracks={tracks} />}

		</div>
	);
};

export default Splash;
