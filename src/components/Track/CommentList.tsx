import React, { useState, createElement, useContext, useEffect, useRef } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { Comment, Avatar, Form, Button, List, Empty, Input, Tooltip, Row, Col, Spin } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';
import { UserContext } from '../../App';

import TrackComment from './TrackComment'
import './track.css'
import './comment.css'
const { TextArea } = Input;


const Editor = ({ onChange, handleSubmit, submitting, value }) => (
    <>
        <Form size={"large"}>
            <Form.Item>
                <Input className='input-comment' onChange={onChange} value={value} placeholder="Write a comment..." onPressEnter={() => handleSubmit()} />
            </Form.Item>

        </Form>
       
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


export const GET_COMMENTS_QUERY = gql`
    query($trackId: Int!, $page: Int!){
            comments(trackId: $trackId, page: $page) {
                    page
                    pages
                    hasNext
                    hasPrev
                    objects {
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

    }

`

const GET_SUBCOMMENTS_QUERY = gql`
    query($commentId: Int!){
        subcomments(commentId: $commentId){
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
`


const CommentList: React.FC < any > = ({ trackId }) => {
    const currentUser: any = useContext(UserContext);



    const [newData, setData] = useState([])    
    const [loader, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [submitting, changeSubmit] = useState(false);
    const [value, changeValue] = useState('');


    const { data, loading, fetchMore} = useQuery(GET_COMMENTS_QUERY, {
        variables: {
            trackId: Number(trackId),
            page: 1
        }
    });

    

    // remake comments query
    const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
        refetchQueries: [{
            query: GET_COMMENTS_QUERY,
            variables: {trackId: Number(trackId), page:1}
        
        }]
    });

  
    



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



    if (loading) return <Spin size="large" />
   
    // if (!data) return null;
    
    const comments = data.comments.objects

    debugger
    
    function handleMore() {
        //fetch more data
    }

    return (
        <>
            <div className='row-one comment-container' >

            
            <List
                itemLayout="horizontal"
                dataSource={comments}
                // className='comment-container'
                locale={{ emptyText: emptyLikes }}
                renderItem={(comment: any) => {

                    return <TrackComment comment={comment} trackId={trackId}>
                    </TrackComment>
                
                }
            }
            >
            </List> 
            
            </div>

             <Comment
                avatar={
                    <Avatar
                        // style={{ marginTop: '5px'}}
                        src={currentUser.userprofile.avatarUrl}
                        alt="User photo"
                        size='large'
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
            </>
       

     
    )

}



export default CommentList;