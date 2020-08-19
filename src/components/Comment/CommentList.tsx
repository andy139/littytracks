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

import TrackComment from './Comment'
// import './track.css'
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
			
            comment {
                comment
                postedBy {
                    id
                    username
                    
                    userprofile {
                    avatarUrl
                    }
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
    query($trackId: Int!, $offset: Int!, $limit:Int!){
            comments(trackId: $trackId, offset:$offset, limit:$limit) {
                    
                    comment
                    postedBy {
                        id
                        username
                        
                        userprofile {
                        avatarUrl
                        }
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


const CommentList: React.FC < any > = ({ trackId, disableTrackModal }) => {
    const currentUser: any = useContext(UserContext);



    const [newData, setData] = useState([])    
    const [loader, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [submitting, changeSubmit] = useState(false);
    const [value, changeValue] = useState('');
    const [page, changePage] = useState(1)


    const { data, loading, fetchMore} = useQuery(GET_COMMENTS_QUERY, {
        variables: {
            trackId: Number(trackId),
            offset: 0,
            limit: 5
        },
        fetchPolicy: "cache-and-network"
    });

    

    // remake comments query
    const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {

        update(cache, { data: { createComment } }) {
            const cacheData: any = cache.readQuery({
                query: GET_COMMENTS_QUERY,
                variables: {
                    trackId: Number(trackId),
                    limit: 5,
                    offset: 0
                }
                
            })
            
    
            const comments = [createComment.comment].concat(cacheData.comments)

            cache.writeQuery({
                query: GET_COMMENTS_QUERY, variables: {
                    trackId: Number(trackId),
                    limit: 5,
                    offset: 0
                },
                data: { comments }
            })
           
            
        }

    });

  
    
    const messagesEndRef:any = useRef(null)


    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        })
        
    }


    const handleSubmit = (trackId) => {

        if (value.length >= 1) {
            changeSubmit(true);
            createComment({
                variables: { trackId: trackId, comment: value }
            }).then(() => {
                changeSubmit(false)
                changeValue('')

            })

        } 

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



    // if (loading) return <Spin size="large" />
   
    if (!data) return null;

    
    
    

    function onLoadMore() {

        setLoading(true)

        fetchMore({
            variables: {
                trackId: trackId,
                offset: data.comments.length
            },
            updateQuery: (prev: any, { fetchMoreResult }) => {
                
                const isNoMoreComments = fetchMoreResult.comments.length == 0
               
                if (isNoMoreComments) { 
                    setHasMore(false);
                    return prev;

                }
                
                return Object.assign({}, prev, {
                    comments: [...prev.comments, ...fetchMoreResult.comments]
                });
            }
        }).then(() => setLoading(false));
    }

    return (
        <>
            <div className='row-one comment-container' >

                <InfiniteScroll
                    pageStart={0}
                    loadMore={() => onLoadMore()}
                    loader={<Spin size="large" />}
                    hasMore={!loader && hasMore}
                    useWindow={false}
                >

                <List
                    itemLayout="horizontal"
                    dataSource={data.comments}
                    // className='comment-container'
                    locale={{ emptyText: emptyLikes }}
                        renderItem={(comment: any) => {

                            return <TrackComment disableTrackModal={disableTrackModal} comment={comment} trackId={trackId}>
                        </TrackComment>
                    
                    }
                }
                >
                    </List> 
                </InfiniteScroll>
                
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
            {/* <Button onClick={() => onLoadMore()}>Load More</Button> */}
            </>
       

     
    )

}



export default CommentList;