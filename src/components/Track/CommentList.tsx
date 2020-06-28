import React, { useState, createElement, useContext, useEffect, useRef } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { Comment, Avatar, Form, Button, List, Empty, Input, Tooltip, } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import moment from 'moment';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { UserContext } from '../../App';
import { ME_QUERY } from '../../App';
import SubcommentList from './SubcommentList'
import { GET_TRACKS_QUERY } from '../../pages/Splash'

import './track.css'

const { TextArea } = Input;


const Editor = ({ onChange, handleSubmit, submitting, value }) => (
    <>
        <Form.Item>
            <Input onChange={onChange} value={value} placeholder="Write a comment..." onPressEnter={() => handleSubmit()} />
        </Form.Item>
    </>
);

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
    mutation($commentId: Int!){
        deleteComment(commentId: $commentId){
            user{
                username
            }
        }

    }

`;


const CommentList: React.FC < any > = ({ comments, trackId }) => {
    const currentUser: any = useContext(UserContext);



    
    const [spinner, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [submitting, changeSubmit] = useState(false);
    const [value, changeValue] = useState('');
    const [createComment, { data, loading }] = useMutation(CREATE_COMMENT_MUTATION, {
        refetchQueries: [{ query: GET_TRACKS_QUERY}]
    });

    const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
        refetchQueries: [{ query: GET_TRACKS_QUERY }]
    });
    
    // useEffect(() => {
    //     let reversedOrder = [...comments].reverse()
    //     setComment(reversedOrder)
    // });

  

    const wrapperElement = document.createElement("div")

    const messagesEndRef:any = useRef(null)



    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        })
        
    }


    const handleSubmit = (trackId) => {

        changeSubmit(true);
        createComment({
            variables: { trackId: trackId, comment: value }
        }).then(() => {
            changeSubmit(false)
            changeValue('')
            messagesEndRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            })
            scrollToBottom();
        })
    }
    
    const emptyLikes = (
        <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{
                height: 80
            }}
            description={
                <span>No Comments Yet</span>
            }
        >
            
        </Empty>
    );



        
   

      

    return (
        <div>
       
            <div className='demo-infinite-container' ref={messagesEndRef}>

       
      
                <List
                    itemLayout="horizontal"
                    dataSource={comments}
                    style={{ height: '350px' }}
                    locale={{ emptyText: emptyLikes }}
                    renderItem={(comment: any) => {

                        // Format Date\


                        const timestamp = comment.createdAt
                        const date = moment(timestamp + 'Z').fromNow()
                        const date2 = moment(comment.createdBy);
                        const formattedDate = date2.format('llll');
                        const userId = comment.postedBy.id;
                        const isUser = userId === currentUser.id
                        const subcomments = comment.subcomments



                        let deleteCommentDiv;



                        if (isUser) {
                            deleteCommentDiv = (<span key="comment-basic-like">


                                <span key="comment-basic-reply-to" onClick={() => {
                                    deleteComment({
                                        variables: { commentId: comment.id }
                                    })
                                }} >Delete</span>
                                {/* <DeleteFilled /> */}

                            </span>)
                        } else {
                            deleteCommentDiv = null;
                        }






                        return <Comment
                        author={
                            <Link style={{ color: "#8dcff8" }} to={`/profile/${comment.postedBy.id}`}>{comment.postedBy.username}</Link>

                            }
                            datetime={
                                <Tooltip title={formattedDate}>
                                    <span>{date}</span>
                                </Tooltip>
                            }
                            // actions={[<a key="list-loadmore-edit">Reply</a>, <span>Delete</span>]}
                            actions={[
                                deleteCommentDiv,
                                <span key="comment-basic-reply-to">Reply</span>,
                            ]
                            }
                            avatar={
                                <Avatar
                                    src={comment.postedBy.userprofile.avatarUrl}
                                    alt="Han Solo"
                                />
                            }
                            content={
                                <p>
                                    {comment.comment}
                                </p>
                            }
                        >


                            <SubcommentList comments={subcomments} commentId={comment.id}></SubcommentList>


                        </Comment>
                    }

                    }
                >
                    {/* <Comment
                        avatar={
                            <Avatar
                                src={currentUser.userprofile.avatarUrl}
                                alt="Han Solo"
                            />
                        }
                        content={
                            <Editor
                                onChange={e => changeValue(e.target.value)}
                                handleSubmit={() => handleSubmit(trackId)}
                                submitting={submitting}
                                value={value}
                            />
                        }
                    /> */}


                </List> 

            </div>
            
            <Comment
                avatar={
                    <Avatar
                        src={currentUser.userprofile.avatarUrl}
                        alt="Han Solo"
                    />
                }
                content={
                    <Editor
                        onChange={e => changeValue(e.target.value)}
                        handleSubmit={() => handleSubmit(trackId)}
                        submitting={submitting}
                        value={value}
                    />
                }
            />
        </div>

     
    )

}



export default CommentList;