import React, { useState, createElement, useContext, useEffect, useRef } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { Comment, Avatar, Form, Button, List, Empty, Input, Tooltip, Row, Col, Spin } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import SubcommentList from './SubcommentList';
import { GET_COMMENTS_QUERY } from './CommentList';

// import './track.css'
import './comment.css';

const CREATE_COMMENT_MUTATION = gql`
	mutation($trackId: Int!, $comment: String!) {
		createComment(trackId: $trackId, comment: $comment) {
			track {
				id
				comments {
					comment
				}
			}
		}
	}
`;

const DELETE_COMMENT_MUTATION = gql`
	mutation($commentId: Int!) {
		deleteComment(commentId: $commentId) {
			commentId
		}
	}
`;

const GET_SUBCOMMENTS_QUERY = gql`
	query($commentId: Int!) {
		subcomments(commentId: $commentId) {
			subcomment
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

const TrackComment: React.FC<any> = ({ comment, trackId }) => {
    const currentUser: any = useContext(UserContext);

	const [ deleteComment, { loading: deleteLoading } ] = useMutation(DELETE_COMMENT_MUTATION, {
		update(cache, { data: { deleteComment } }) {
			debugger;
			const cacheData: any = cache.readQuery({
				query: GET_COMMENTS_QUERY,
				variables: {
					trackId: Number(trackId),
					limit: 5,
					offset: 0
				}
			});

		

			const commentId = deleteComment.commentId;

			const index = cacheData.comments.findIndex((comment) => Number(comment.id) === commentId);

			const comments = [ ...cacheData.comments.slice(0, index), ...cacheData.comments.slice(index + 1) ];

			debugger;
			cache.writeQuery({
				query: GET_COMMENTS_QUERY,
				variables: {
					trackId: Number(trackId),
					limit: 5,
					offset: 0
				},
				data: { comments }
			});
		}
	});

	const timestamp = comment.createdAt;
	const date = moment(timestamp + 'Z').fromNow();
	const date2 = moment(comment.createdBy);
	const formattedDate = date2.format('llll');

	const userId = comment.postedBy.id;
	const isUser = userId === currentUser.id;
	const subcomments = comment.subcomments;

    let deleteCommentDiv;
    
    const [updateMethod, callMethod] = useState(true);

	if (isUser) {
		deleteCommentDiv = (
			<span key="comment-basic-like">
				<span
					key="comment-basic-reply-to"
					onClick={() => {
						deleteComment({
							variables: { commentId: comment.id }
						});
					}}
				>
					Delete
				</span>
				{/* <DeleteFilled /> */}
			</span>
		);
	} else {
		deleteCommentDiv = null;
	}

	return (
		<Spin tip="...deleting comment" spinning={deleteLoading}>
			<Comment
				author={
					<Link style={{ color: '#8dcff8' }} to={`/profile/${comment.postedBy.id}`}>
						{comment.postedBy.username}
					</Link>
				}
				datetime={
					<Tooltip title={formattedDate}>
						<span>{date}</span>
					</Tooltip>
				}
				
                actions={[deleteCommentDiv, <span key="comment-basic-reply-to" onClick={() => {

                    callMethod(false)
                }}>Reply</span>]}
				avatar={<Avatar src={comment.postedBy.userprofile.avatarUrl} alt="Han Solo" />}
				content={<p>{comment.comment}</p>}
            >
      
                <SubcommentList comments={subcomments} updateMethod={updateMethod} commentId={comment.id} />
			</Comment>
		</Spin>
	);
};

export default TrackComment;
