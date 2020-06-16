import React, { useState } from "react";
import {Mutation} from 'react-apollo';
import {useMutation} from "@apollo/react-hooks";
import {GET_TRACKS_QUERY} from "../../pages/Splash";
import { Button, Affix, Modal, Input, Upload, message, Row, Col} from 'antd';
import axios from 'axios';
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { FileAddOutlined, FileAddFilled,UploadOutlined, LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import Error from '../Shared/Error';
import './track.css';
import {PROFILE_QUERY} from '../../pages/Profile';


const CREATE_TRACK_MUTATION = gql`
    mutation ($title: String!, $description: String!, $url: String!, $imgUrl: String!){
        createTrack(title: $title, description: $description, url: $url, imgUrl: $imgUrl){
            track{
                id
                title
                description
                url
                imgUrl
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
const CreateTrack: React.FC<any> = ({classes, userId}) => {
    let id = userId;

    if (!id) id = 21;
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file,setFile] = useState([]);
    const [progress, setProgress] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [modalState, setModal] = useState(false);
    const [url, setUrl] = useState(null);
    const [fileError, setFileError] = useState("");
    const [imageLoading, setLoading] = useState(false);
    const [imgUrl, setImgUrl] = useState("http://res.cloudinary.com/andytran/raw/upload/v1592239178/ksa9qczmaoicuqcgdo10");
    const [createTrack, {loading, error}] = useMutation(
      CREATE_TRACK_MUTATION, 
      {
        update(cache, {data: {createTrack}}) {

          const data:any = cache.readQuery({
            query: GET_TRACKS_QUERY
          })

          const tracks = data.tracks.concat(createTrack.track);
          cache.writeQuery({query: GET_TRACKS_QUERY, data: {tracks}})

        },
        refetchQueries:[{query: PROFILE_QUERY, variables:{id:id}}]
        
      }
    );

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
          setUrl(res.data.url);
          setSubmitting(false);
        } catch (err) {
           console.error("Error uploading file", err);
           setSubmitting(false);
        }
      };


       

  
    };

    const props = {
      // action: '//jsonplaceholder.typicode.com/posts/',
      accept: "audio/mp3, audio/wav",
      // disabled: !!url,
      
    };

    const handleAudioChange = info => {
        
        // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
        let fileList;
        fileList = [...info.fileList].slice(-1);
        let singleFile = fileList[0]

        // 3. Filter successfully uploaded files according to response from server
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


    const handleSubmit = (event, createTrack) => {
        event.preventDefault()
    
         
        createTrack({
            variables:{ title, description, url: url, imgUrl:imgUrl}
        }).then((data)=>{
            console.log({ data });
            setSubmitting(false);
            setModal(false);
            setTitle("");
            setDescription("");
            setUrl(null);
            setFile([]);
            setImgUrl("")
        })

    }

    
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
        setImgUrl(res.data.url);
        setLoading(false);
        setSubmitting(false);
      } catch (err) {
         console.error("Error uploading file", err);
         setLoading(false);
         setSubmitting(false);
      }
    };


  };

    const uploadButton = (
      <div>

        <Button>
            Upload Image &nbsp; {imageLoading ? <LoadingOutlined /> : <PlusOutlined />} 
        </Button>
  
      </div>
    )

       

    return (
      <>
        {/* Create Track BUtton */}

        <Affix style={{ position: "fixed", bottom: 30, right: 30, zIndex:999 }}>
          {/* <Button
            type="primary"
            icon={<FileAddFilled style={{ fontSize: "20px" }} />}
            onClick={() => setModal(true)}
          /> */}

          {modalState ? <i className="fas fa-minus-circle button-shadow" style={{fontSize:50, color:'#f4364c'}}></i> : <i className="fas fa-plus-circle button-shadow" style={{fontSize:50, color:'#0079ff'}}
          onClick={() => setModal(true)}
          >
          </i> }
         
        </Affix>

        {error ? (
          <Error error={error} />
        ) : (
          <Modal
            title={
              <div>
                <h2>Create Track</h2>
                <div>Add a Title, Description, and Audio file (Under 10 MB)</div>
              </div>
            }
            okText="Add Track"
            style={{ top: 120 }}
            width={700}
            visible={modalState}
            onOk={() => setModal(false)}
            onCancel={() => setModal(false)}
            cancelButtonProps={{ disabled: submitting }}
            okButtonProps={{
              disabled:
                submitting || !title.trim() || !description.trim() || !url,
              onClick: (e) => handleSubmit(e, createTrack),
            }}
          > 
           <Row>
              <Col 
                flex={2}
        
                
              >
                <Row justify={"center"}>
                  {imgUrl ? <img src={imgUrl} alt="avatar" style={{maxWidth: "230px", maxHeight:"230px"}} /> : null}

                </Row>
                <br/>
                <Row justify={"center"}>

                  <ImgCrop rotate>
                    <Upload
                      name="avatar"
                      listType="picture"
                      className="avatar-uploader"
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                      customRequest={uploadImage}
                      style={{zIndex:2}}
                    >
                     {uploadButton}
                    </Upload>
                    
                  </ImgCrop>

                </Row>

          
              </Col>
              <Col flex={3}>
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
                  <br/>
                  <br/>
                  <Upload {...props}  listType="picture" onChange={handleAudioChange}  customRequest={uploadAudio} fileList={file} onRemove = {() => setUrl(null)}>
                    <Button>
                      Click to Upload &nbsp; <UploadOutlined />
                    </Button>
                  <br/>
                  <br/>
                  </Upload>
            
                </Col>
            </Row>
            
            <br />
            <br />
            
          </Modal>
        )}
      </>
    );



}

export default CreateTrack;