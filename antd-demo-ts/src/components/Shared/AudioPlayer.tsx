import React, { useState } from "react";

import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import ReactPlayer from 'react-player';


const AudioPlayer: React.FC<any> = ({url}) => {


    return (
        <span>
            <ReactPlayer url={url} height="30px" width="500px" controls={true}/>
            <div>
                Test
            </div>
        </span>
    )



}

export default AudioPlayer;
