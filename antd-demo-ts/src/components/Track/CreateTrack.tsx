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
    const [progress, setProgress] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [modalState, setModal] = useState(false);
    const [url, setUrl] = useState(null);
    const [createTrack, {loading, error}] = useMutation(CREATE_TRACK_MUTATION)

    const uploadAudio = async (options) => {
        setSubmitting(true);
      const { onSuccess, onError, file, onProgress } = options;
      const fmData = new FormData();
      const config = {
        headers: { "content-type": "multipart/form-data" },
        onUploadProgress: (event) => {
          const percent = Math.floor((event.loaded / event.total) * 100);
          setProgress(percent);
          if (percent === 100) {
            setTimeout(() => setProgress(0), 1000);
          }
          onProgress({ percent: (event.loaded / event.total) * 100 });
        },
      };

      debugger
      fmData.append("file", file);
      fmData.append("resource_type", "raw");
      fmData.append("upload_preset", "music-app");
      fmData.append("cloud_name", "andytran");
      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/andytran/raw/upload",
          fmData,
          config
        );

        onSuccess("Ok");
        console.log("server res: ", res);
        setUrl(res.data.url);
        setSubmitting(false);
      } catch (err) {
         console.error("Error uploading file", err);
         setSubmitting(false);
      }
    };

    const props = {
      // action: '//jsonplaceholder.typicode.com/posts/',
      accept: "audio/mp3, audio/wav",
      
    };

    const handleAudioChange = info => {
        debugger;
        const selectedFile = info.fileList[0]

        setFile(selectedFile);

    };


    // const handleAudioUpload = async () => {
    //     try {
    //         const data = new FormData()
    //         data.append("file", file)
    //         data.append("resource_type","raw")
    //         data.append('upload_preset',"music-app")
    //         data.append("cloud_name","andytran")
    //         const res = await axios.post(
    //           "https://api.cloudinary.com/v1_1/andytran/raw/upload",
    //           data
    //         );
    //         return res.data.url
    
    //     } catch(err) {
    //         console.error('Error uploading file', err)
    //         setSubmitting(false);
    //     }
    // }

    const handleSubmit = (event, createTrack) => {
        event.preventDefault()
    
        debugger
        createTrack({
            variables:{ title, description, url: url}
        }).then((data)=>{
            console.log({ data });
            setSubmitting(false);
            setModal(false);
            setTitle("");
            setDescription("");
            setFile("");
        })

    }

    



    return (
      <>
        {/* Create Track BUtton */}

        <Affix style={{ position: "fixed", bottom: 30, right: 100, zIndex:999 }}>
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></Input>
            <br />
            <br />
            <Input.TextArea
              prefix="Description"
              allowClear
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <br />
            <br />
            <Upload {...props} listType="picture" onChange={handleAudioChange} customRequest={uploadAudio}>
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