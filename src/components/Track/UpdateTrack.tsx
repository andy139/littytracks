import React, { useState, useContext, useEffect, useRef } from "react";
import {Mutation} from 'react-apollo';
import {useMutation} from "@apollo/react-hooks";
import {GET_TRACKS_QUERY} from "../../pages/Splash";
import { Button, Affix, Modal, Input, Upload, message} from 'antd';
import axios from 'axios';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { FileAddOutlined, FileAddFilled,UploadOutlined, EditOutlined} from '@ant-design/icons';
import Error from '../Shared/Error';
import {UserContext} from '../../App';
import './track.css';


const UPDATE_TRACK_MUTATION = gql`
      mutation ($trackId: Int!, $title: String!, $description: String!, $url: String!, $imgUrl: String!, $artistName: String!){
        updateTrack(
            trackId: $trackId,
            title: $title,
            url: $url,
            imgUrl: $imgUrl, 
            artistName:$artistName
            description:$description

        )
        {
        track {
            id
            title
            description
            url
            likes {
                id
                
            }
            postedBy {
                id
                username
            }
        }
    }

    }
`


const UpdateTrack: React.FC<any> = ({classes, track}) => {
    const currentUser:any = useContext(UserContext)
    const [title, setTitle] = useState(track.title);
    const [description, setDescription] = useState(track.description);
    const [file,setFile] = useState([]);
    const [progress, setProgress] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [modalState, setModal] = useState(false);
    const [url, setUrl] = useState(track.url);
    const [fileError, setFileError] = useState("")
    const [updateTrack, {loading, error}] = useMutation(UPDATE_TRACK_MUTATION)
    const [artistName, setArtistName] = useState(track.artistName);
    const [imgUrl, setImgUrl] = useState(track.imageUrl);

    
  debugger


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

       
      fmData.append("file", file);
      fmData.append("resource_type", "raw");
      fmData.append("upload_preset", "music-app");
      fmData.append("cloud_name", "andytran");


      // check how big size is

      const fileSizeLimit = 10000000 //10mb

      if (file.size > fileSizeLimit){
        console.error("File too big");
        onError("File too big")
        setSubmitting(false);
      } else {
        try {
          const res = await axios.post(
            "https://api.cloudinary.com/v1_1/andytran/raw/upload",
            fmData,
            config
          );
  
          onSuccess("Successfully uploaded to server");
          console.log("server res: ", res);
          setUrl(res.data.secure_url);
          setSubmitting(false);
        } catch (err) {
           console.error("Error uploading file", err);
           setSubmitting(false);
        }
      };

    
    };

    const props = {
      accept: "audio/mp3, audio/wav",
      
    };

    const handleAudioChange = info => {

        let fileList;
        fileList = [...info.fileList].slice(-1);
        let singleFile = fileList[0]

        const fileSizeLimit = 10000000 //10mb

        fileList = fileList.map(file => {
          if (file.size > fileSizeLimit){
            file.status = 'error'
            file.name = `File too big, please upload file under 10 MB`
          }
          return file;
        })

        console.log(fileList)


        if (singleFile && singleFile.size > fileSizeLimit){
          setFileError(`${singleFile.name}: File to large`)
        } else {
          setFileError('');
        }

        setFile(fileList);
       
       
    

        
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

    const handleSubmit = (event, updateTrack) => {
        event.preventDefault()
    
         
        updateTrack({
          variables: { trackId: track.id, title, description, url: url, imgUrl: track.imgUrl, artistName: track.artistName}
        }).then((data)=>{
            console.log({ data });
            setSubmitting(false);
            setModal(false);
            setTitle(title);
            setDescription(description);
            setUrl(url);
            setImgUrl(imgUrl)
            setArtistName(artistName)
            setFile([]);
        })

    }

    

    
    const isCurrentUser = currentUser.id === track.postedBy.id;
    if (!isCurrentUser) return null;


     
    return (

      <>
        {/* Create Track BUtton */}
        <Button type="primary" shape="circle" icon={<EditOutlined /> } onClick={() => setModal(true)}></Button>
       

        {error ? (
          <Error error={error} />
        ) : (
          <Modal
            title={
              <div>
                <h2>Update Track</h2>
                <div>Add a Title, Description, and Audio file (Under 10 MB)</div>
              </div>
            }
            okText="Update Track"
            style={{ top: 120 }}
            visible={modalState}
            onOk={() => setModal(false)}
            onCancel={() => setModal(false)}
            cancelButtonProps={{ disabled: submitting }}
            okButtonProps={{
              disabled:
                submitting || !title.trim() || !description.trim() || !url,
              onClick: (e) => handleSubmit(e, updateTrack),
            }}
          >
            <h4>Title</h4>
            <Input
              
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></Input>
            <br />
            <br />
            <h4>Description</h4>
            <Input.TextArea
              prefix="Description"
              allowClear
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <br />
            <br />
            <Upload {...props}  listType="picture" onChange={handleAudioChange}  customRequest={uploadAudio} fileList={file}>
              <Button>
                Click to Upload &nbsp; <UploadOutlined />
              </Button>
            </Upload>
          </Modal>
        )}
      </>
    );



}

export default UpdateTrack;

