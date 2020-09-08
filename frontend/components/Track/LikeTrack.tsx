import React, { useContext } from 'react';

import { useMutation } from '@apollo/react-hooks';
import {  LikeOutlined, LikeFilled } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { UserContext } from '../../App';
import { gql } from 'apollo-boost';
import { ME_QUERY } from '../../App';

const CREATE_LIKE_MUTATION = gql`
	mutation($trackId: Int!) {
		createLike(trackId: $trackId) {
			track {
				id
				likes {
					id
				}
			}
		}
	}
`;

const DELETE_LIKE_MUTATION = gql`
	mutation($trackId: Int!) {
		deleteLike(trackId: $trackId) {
			track {
				id
				likes {
					id
				}
			}
		}
	}
`;

const IconText = ({ icon, text }) => (
	<Space>
		{icon}
		{text}
	</Space>
);

const LikeTrack: React.FC<any> = ({ trackId, likeCount }) => {
	const [ createLike, { data, loading } ] = useMutation(CREATE_LIKE_MUTATION, {
		refetchQueries: [ { query: ME_QUERY } ]
	});

	const [ deleteLike ] = useMutation(DELETE_LIKE_MUTATION, {
		refetchQueries: [ { query: ME_QUERY } ]
	});

	const currentUser: any = useContext(UserContext);

	if (!currentUser) return null;

	const disableLikes: any = () => {
		const userLikes: any = currentUser.likeSet;
		const isTrackLiked = userLikes.findIndex(({ track }) => track.id === trackId) > -1;
		return isTrackLiked;
	};

	return (
		<IconText
			icon={
				disableLikes() ? (
					<Button
						type="text"
						shape="circle"
						onClick={(event) => {
							event.stopPropagation();
							deleteLike({ variables: { trackId: parseInt(trackId) } }).then((data) => console.log(data));
						}}
					>
						<LikeFilled style={{ fontSize: '20px', color: '#08c' }} /> 
					</Button>
				) : (
					<Button
						type="text"
						shape="circle"
						onClick={(event) => {
							event.stopPropagation();
							createLike({ variables: { trackId: parseInt(trackId) } }).then((data) => console.log(data));
						}}
					>
						<LikeOutlined style={{ fontSize: '20px', color: '#08c' }} /> 
					</Button>
				)
			}
			text={likeCount} 
		/>
	);
};

export default LikeTrack;
