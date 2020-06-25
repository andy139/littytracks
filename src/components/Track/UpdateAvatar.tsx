import React, { useState, useContext} from "react";
import {UserContext} from '../../App';
import {Mutation} from 'react-apollo';
import {useMutation} from "@apollo/react-hooks";
import {GET_TRACKS_QUERY} from "../../pages/Splash";
import { Button, Affix, Modal, Input, Upload, message, Row, Col, Spin} from 'antd';
import axios from 'axios';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { FileAddOutlined, FileAddFilled,UploadOutlined, LoadingOutlined, PlusOutlined} from '@ant-design/icons';

import Error from '../Shared/Error';
import './track.css';
import ImgCrop from 'antd-img-crop';
import {PROFILE_QUERY} from '../../pages/Profile';


const UPDATE_AVATAR_MUTATION = gql `
  mutation($avatarUrl: String!) {
    updateProfile(avatarUrl:$avatarUrl){
      userProfile{
        avatarUrl
        user{
          username
        }
      }
    }
  }
`

const UpdateAvatar: React.FC<any> = ({classes, userId, profileId}) => {

  const currentUser:any = useContext(UserContext);
  const isCurrentUser = currentUser.id === userId

  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [modalState, setModal] = useState(false);
  const [url, setUrl] = useState(null);
  const [fileError, setFileError] = useState("");
  const [imageLoading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState("http://res.cloudinary.com/andytran/raw/upload/v1592239178/ksa9qczmaoicuqcgdo10");
  const [updateAvatar, {loading, error}] = useMutation(
    UPDATE_AVATAR_MUTATION,{
      refetchQueries:[{query: PROFILE_QUERY, variables:{id:userId}}]
    }
    
  )

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const uploadImage = async (options) => {
    setLoading(true);
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

  const fileSizeLimit = 3000000 //3mb

  if (file.size > fileSizeLimit){
    console.error("File too big");
    onError("File too big")
    setLoading(false);
   
  } else {
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/andytran/raw/upload",
        fmData,
        config
      );

      onSuccess("Successfully uploaded to server");
      console.log("server res: ", res);
      setImgUrl(res.data.url);
      updateAvatar({
        variables:{avatarUrl: res.data.url}
      }).then(() => {
        setLoading(false);
      })
     
      
    } catch (err) {
       console.error("Error uploading file", err);
       setLoading(false);
      
    }
  };


};

  if (!isCurrentUser) return null;

  return(

    <ImgCrop 
      rotate
      shape='round'>
        <Upload
          name="avatar"
          listType="picture"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={beforeUpload}
          customRequest={uploadImage}
          style={{zIndex:2}}
        >
          <Button style={{marginLeft:50}} disabled={imageLoading}>
           {imageLoading?  <LoadingOutlined/> : null}  &nbsp;Change Avatar
          </Button>
        </Upload>
                    
      </ImgCrop>
 

  )
    



}

export default UpdateAvatar;