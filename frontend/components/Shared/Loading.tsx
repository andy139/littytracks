import React from 'react';
import logo from './loader_3.gif';
import './shared.css'


const Loading:React.FC<any> =({classes}) => {

    return (
        <div className="loader-center">
            <img src={logo}></img>
        </div>
    )


}

export default Loading;