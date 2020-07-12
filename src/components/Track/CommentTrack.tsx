import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Space, Modal, Row, Col, Divider, Spin } from 'antd';
import { UserContext } from '../../App';
import { gql } from 'apollo-boost';
import { ME_QUERY } from '../../App';

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
		refetchQueries: [ { query: ME_QUERY } ]
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
            {/* <Modal
                title={
                    <div>
                        <h2>{track.title}</h2>
                    </div>
                }
                onCancel={() => setModal(false)}
                style={{ top: 120 }}
                width={700}
                visible={modalState}>
                
                <Row>
                    <Col flex={3}>3 / 5</Col>
                    <Col flex={2}>3 / 5
                     
                     <img
                            width={225}
                            alt="logo"
                            style={{
                                float: "right"
                            }}
                            src={
                                track.imgUrl ? (
                                    track.imgUrl
                                ) : (
                                        'http://res.cloudinary.com/andytran/raw/upload/v1592239178/ksa9qczmaoicuqcgdo10'
                                    )
                            }
                        />
                    </Col>
                </Row>

            </Modal> */}
        </>
     
	);
};

export default CommentTrack;
