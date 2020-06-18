import React, { useState, useContext } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { Comment, Avatar, Form, Button, List, Input } from 'antd';
import moment from 'moment';
import { cpus } from 'os';
import { UserContext } from '../../App';
import { ME_QUERY } from '../../App';

import {GET_TRACKS_QUERY } from '../../pages/Splash'
const { TextArea } = Input;



// const Comments = ({ comments }) => (
//     <List
//         dataSource={comments}
//         header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
//         itemLayout="horizontal"
//         renderItem={props:any => <Comment {...props} />}
//     />
// );


const Editor = ({ onChange, handleSubmit, submitting, value }) => (
    <>
        <Form.Item>
            <TextArea rows={1} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={() => handleSubmit()}type="primary">
                Add Comment
      </Button>
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

// const DELETE_COMMENT_MUTATION = gql`
//     mutation($comment_id: Int!){

//     }

// `


const CommentList: React.FC < any > = ({ comments, trackId }) => {
    const currentUser: any = useContext(UserContext);

    const [submitting, changeSubmit] = useState(false);
    const [value, changeValue] = useState('');
    const [createComment, { data, loading }] = useMutation(CREATE_COMMENT_MUTATION, {
        refetchQueries: [{ query: GET_TRACKS_QUERY}]
    });


    const handleSubmit = (trackId) => {

        debugger

        changeSubmit(true);
        createComment({
            variables:{trackId:trackId, comment: value}
        }).then(() => {
            changeSubmit(false)
            changeValue('')
        })
    }


        
    let reversedOrder = [...comments].reverse()

    debugger

    return (
        <>
            <List
                itemLayout="horizontal"
                dataSource={reversedOrder}
                pagination={{
                    onChange: (page) => {
                        console.log(page);
                    },
                    pageSize: 4
                }}
                renderItem={(comment: any) =>
                    <Comment
                    author={comment.postedBy.username}
                    datetime={
                        <span>{comment.createdAt}</span>
                    }
                    actions={[<a key="list-loadmore-edit">Reply</a>]}
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
                    />
                
                }
            >
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
             
            </List> 

        </>
    )

}



export default CommentList;