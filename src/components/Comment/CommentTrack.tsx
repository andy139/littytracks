import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Space, Modal, Row, Col, Divider, Spin } from 'antd';
import { UserContext } from '../../App';
import { gql } from 'apollo-boost';
import { ME_QUERY } from '../../App';
import { GET_TRACKS_QUERY } from '../../pages/Splash'

const IconText:any = ({ icon, text }) => (
	<Space>
		{icon}
		{text}
	</Space>
);

const CREATE_COMMENT_MUTATION = gql`
	mutation($trackId: Int!) {
		createComment(trackId: $trackId) {
			track {
				id
				comments {
					comment
				}
			}
		}
	}
`;



const CommentTrack: React.FC<any> = ({ track, commentCount, setModal}) => {
	const [ createComment, { data, loading } ] = useMutation(CREATE_COMMENT_MUTATION, {
        refetchQueries: [{ query: GET_TRACKS_QUERY } ]
    });
    


    return (
        <>
            <IconText
                icon={
                    <Button
                        type="text"
                        shape="circle"
                        onClick={() => setModal(true)}

                    >
                        <MessageOutlined

                            style={{ fontSize: '20px', color: '#08c' }}

                        />
                    </Button>
                }

                text={commentCount}
            >


            </IconText>

        </>
     
	);
};

export default CommentTrack;
