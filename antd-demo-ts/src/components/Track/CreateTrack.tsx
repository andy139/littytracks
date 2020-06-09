import React, { useState } from "react";
import {Mutation} from 'react-apollo';
import {useMutation} from "@apollo/react-hooks";
import { Button, Affix, Modal, Input, Upload, message} from 'antd';
import axios from 'axios';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { FileAddOutlined, FileAddFilled,UploadOutlined} from '@ant-design/icons';
import Error from '../Shared/Error';


const CREATE_TRACK_MUTATION = gql`
    mutation ($title: String!, $description: String!, $url: String!){
        createTrack(title: $title, description: $description, url: $url){
            track{
                id
                title
                description
                url
            }
        }

    }


`
const CreateTrack: React.FC<any> = ({classes}) => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file,setFile] = useState("")
    const [submitting, setSubmitting] = useState(false);
    const [modalState, setModal] = useState(false);
    const [createTrack, {loading, error}] = useMutation(CREATE_TRACK_MUTATION)



    const props = {
        // action: '//jsonplaceholder.typicode.com/posts/',
        accept:"audio/mp3, audio/wav",
        multiple: false,

    };

    const handleAudioChange = event => {
        debugger;
        const selectedFile = event.fileList[0];

        console.log(selectedFile);

    
        setFile(selectedFile);

    };


    const handleAudioUpload = async () => {
        try {
            const data = new FormData()
            data.append('file', file)
            data.append('resource_type', 'raw')
            data.append('upload_present', 'music-app')
            data.append('cloud_name', 'andytran')
            debugger
            const res = await axios.post('https://api.cloudinary.com/v1_1/andytran/raw/upload', data)
            return res.data.url
    
        } catch(err) {
            console.error('Error uploading file', err)
            setSubmitting(false);
        }
    }

    const handleSubmit = async (event, createTrack) => {
        event.preventDefault()
        setSubmitting(true);
        const uploadedUrl = await handleAudioUpload()

        debugger
        createTrack({
            variables:{ title, description, url: uploadedUrl}
        }).then(()=>{
            setSubmitting(false)
        })

    }

    



    return (
      <>
        {/* Create Track BUtton */}

        <Affix style={{ position: "fixed", bottom: 30, right: 100 }}>
          <Button
            type="primary"
            icon={<FileAddFilled style={{ fontSize: "16px" }} />}
            onClick={() => setModal(true)}
          />
        </Affix>

        {error ? (
          <Error error={error} />
        ) : (
          <Modal
            title={
              <div>
                <h2>Create Track</h2>
                <div>Add a title, description, and audio file</div>
              </div>
            }
            okText="Add Track"
            style={{ top: 120 }}
            visible={modalState}
            onOk={() => setModal(false)}
            onCancel={() => setModal(false)}
            cancelButtonProps={{ disabled: submitting }}
            okButtonProps={{
              disabled:
                submitting || !title.trim() || !description.trim() || !file,
              onClick: (e) => handleSubmit(e, createTrack),
            }}
          >
            <Input
              prefix="Title"
              onChange={(e) => setTitle(e.target.value)}
            ></Input>
            <br />
            <br />
            <Input.TextArea
              prefix="Description"
              allowClear
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
            />
            <br />
            <br />
            <Upload 
                {...props} 
                listType="picture"
                onChange={handleAudioChange}
               
            
            >
              <Button>
                Click to Upload &nbsp; <UploadOutlined />
              </Button>
            </Upload>
          </Modal>
        )}

  
      </>
    );



}

export default CreateTrack;