import React, { useState, useContext, useRef } from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { Comment, Avatar, Form, Button, List, Input, Tooltip, } from 'antd';
import {  DeleteFilled } from '@ant-design/icons';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import { GET_TRACKS_QUERY } from '../../pages/Splash'
import { useQuery } from '@apollo/react-hooks';
// import './track.css';



const { TextArea } = Input;




const CREATE_SUBCOMMENT_MUTATION = gql`
	mutation($commentId: Int!, $subcomment: String!) {
		createSubcomment(commentId: $commentId, subcomment: $subcomment) {
			user{
                username
            }
		}
	}
`;

const DELETE_SUBCOMMENT_MUTATION = gql`
    mutation($subcommentId: Int!){
        deleteSubcomment(subcommentId: $subcommentId){
            user{
                username
            }
        }

    }

`;

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

const UseFocus = () => {
    const htmlElRef:any = useRef(null)
    const setFocus = () => { htmlElRef.current && htmlElRef.current.focus() }

    return [htmlElRef, setFocus]
}

const SubcommentComp = ({ comment, commentId, disableTrackModal }) => {
    const currentUser: any = useContext(UserContext);
    const [inputRef, setInputFocus] = UseFocus()
    const [deleteComment] = useMutation(DELETE_SUBCOMMENT_MUTATION, {
        refetchQueries: [{
            query: GET_SUBCOMMENTS_QUERY,
            variables: { commentId: Number(commentId) }

        }]
    });

    const timestamp = comment.createdAt
    const date = moment(timestamp + 'Z').fromNow()
    const date2 = moment(comment.createdBy);
    const formattedDate = date2.format('llll');
    const userId = comment.postedBy.id;
    const isUser = userId === currentUser.id




    let deleteCommentDiv;

    if (isUser) {
        deleteCommentDiv = (<span key="comment-basic-like">


            <span key="comment-basic-reply-to" className="reply-delete" onClick={() => {
                deleteComment({
                    variables: { subcommentId: comment.id }
                })
            }} >Delete</span>
            {/* <DeleteFilled /> */}

        </span>)
    } else {
        deleteCommentDiv = null;
    }





    return (<Comment
        author={
            <Link style={{ color: "#8dcff8" }} onClick={() => disableTrackModal()} to={`/profile/${comment.postedBy.id}`}>{comment.postedBy.username}</Link>

        }
        datetime={
            <Tooltip title={formattedDate}>
                <span>{date}</span>
            </Tooltip>
        }
        // actions={[<a key="list-loadmore-edit">Reply</a>, <span>Delete</span>]}
        actions={[
            deleteCommentDiv,
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

                {comment.subcomment}
            </p>
        }
    >



    </Comment>)


}

const Editor = ({ onChange, handleSubmit, submitting, value }) => (
    <>
        <Form size={"large"}>

            <Form.Item>
                <Input onChange={onChange} value={value} placeholder="Write a reply..." onPressEnter={() => handleSubmit()} />
            </Form.Item>

        </Form>
    </>
);



const SubcommentList: React.FC<any> = ({ commentId, updateMethod, disableTrackModal}) => {
    const currentUser: any = useContext(UserContext);

    const [submitting, changeSubmit] = useState(false);
    const [value, changeValue] = useState('');
    const [createComment] = useMutation(CREATE_SUBCOMMENT_MUTATION, {
        refetchQueries: [{
            query: GET_SUBCOMMENTS_QUERY,
            variables: {commentId: Number(commentId)}
        
        }]
    });

 

    const { data } = useQuery(GET_SUBCOMMENTS_QUERY, {
        variables: {
            commentId: Number(commentId)
        }
    })

    // const inputEl: any = useRef(null);
    
    // const onButtonClick = () => {
    //     inputEl.current.focus()
    // }




    const handleSubmit = (commentId) => {
        
        if (value.length >= 1) {
            changeSubmit(true);
            createComment({
                variables: { commentId: commentId, subcomment: value }
            }).then(() => {
                changeSubmit(false)
                changeValue('')
            })

        } 

     
    };



    if (!data) return null;

    const subcomments = data.subcomments



    debugger


    return (
        <>
            <List
                itemLayout="horizontal"
                dataSource={subcomments}
               
           
                renderItem={(comment: any) => {

                    return <SubcommentComp comment={comment} disableTrackModal={disableTrackModal} commentId={commentId}/>

                    
                }

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
                            handleSubmit={() => handleSubmit(commentId)}
                            submitting={submitting}
                            value={value}
                        />
                    }
                />


            </List>

        </>
    )

}



export default SubcommentList;