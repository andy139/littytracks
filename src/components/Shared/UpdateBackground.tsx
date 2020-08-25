import React from 'react';

import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import {
    Button
} from 'antd'


const UpdateBackground: React.FC<any> = ({ currentUser, backgroundNum, setBackgroundNum}) => {
    const [updateBackground, { data, loading }] = useMutation(UPDATE_BACKGROUND_MUTATION);



    const handleSubmit = (event, updateBackground) => {
        event.preventDefault()
        const currBackground = backgroundGifs[backgroundNum]

        updateBackground({
            variables:{backgroundUrl: currBackground}
        }).then(() => {
            if (backgroundNum === backgroundGifs.length - 1) {
                setBackgroundNum(0)
            } else {
                setBackgroundNum(backgroundNum + 1)
            }
        })
    }

    return (
        <div>
            <Button style={{
                margin: '10px',
            }}type="primary" shape="round" onClick={(e) => handleSubmit(e, updateBackground)}>
                Change Background
            </Button>
        </div>
    )
}

const UPDATE_BACKGROUND_MUTATION = gql`
  mutation($backgroundUrl: String!) {
    updateBackground(backgroundUrl:$backgroundUrl){
      userProfile{
        backgroundUrl
        user{
          username
        }
      }
    }
  }
`
export const backgroundGifs = [
    'https://66.media.tumblr.com/900d93b71b6061e043a0aaa2f91a025e/fcf075c8db503555-f4/s540x810/ea7b280580ad959eac6e3d81304bc55b0d34d726.gif',
    'https://66.media.tumblr.com/1b9859af9aecd7ca666df0015aa1cb10/tumblr_oras0eWIDg1vhvnzyo1_500.gif',
    'https://66.media.tumblr.com/d90f205bed27f5a7480616237e93143a/tumblr_ovtfzbaGUR1vu5dwpo1_500.gif',
    'https://66.media.tumblr.com/75b6803d9d1e84cfa2db697b9239c13e/tumblr_on533uMc731utwxd1o1_500.gif',
    'https://66.media.tumblr.com/68b6f2ae22f5c2c80384affc385d1f8e/tumblr_owcib08z7g1vur2auo1_500.gif',
    'https://66.media.tumblr.com/ff3dbf048d78c4ac623178fab00078f6/tumblr_pg1yi12uiU1tcvan1o1_540.gif',
    'https://66.media.tumblr.com/08a708f46a33f81701f0e016f01a5b6d/tumblr_pxmj3f9uUF1rldv4go1_400.gif',
    'https://66.media.tumblr.com/8ad1daf5cdd6a52495104f749ffdd5f7/tumblr_ph89ylzo9g1rzlojlo1_540.gif',
    'https://66.media.tumblr.com/d757c71b9d3b703a96af6dada4f7e49a/tumblr_p8ofbvhm4s1wxdq3zo1_500.gif',
    'https://66.media.tumblr.com/eb1d86f747efdd869aecd1f8be75260c/tumblr_p54ik4BRAj1tcvan1o1_500.gif',
    'https://64.media.tumblr.com/6faca5a9e75a1b5d5467b6c88db0a42c/tumblr_pjw8tt7hT41wxdq3zo1_500.gif', 
    'https://66.media.tumblr.com/8d8900cf8d145f0e13f2f12e9356d31f/tumblr_p1wy9bLWUD1wzmqr6o1_1280.gif',
    'https://66.media.tumblr.com/90449b68fe3b0c86803d889e0a910938/tumblr_os9gi9Mq6q1ui7oe1o1_540.gif',
    'https://66.media.tumblr.com/e111098a9b4e59aa6d9ffda5770f3444/tumblr_oy7m9lNGxR1wd3n3jo1_500.gif',
    'https://66.media.tumblr.com/fc5c77a25c284b8f06dd5ef877cc032a/9e5df7d0382bfe2e-ae/s540x810/f65338b55162867e9801a67bd3b2f392fd9501bf.gifv',
]

export default UpdateBackground;