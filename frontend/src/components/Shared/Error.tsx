import React, { useState, useEffect } from "react";
import { Button, notification } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

interface Props {
    classes?:any;
    error?:any | null;

}


const Error:React.FC<Props> = ({classes, error}) => {
    const [open, setOpen] = useState(true);

    const openNotification = () => {
        notification.open({
            message: error.message,
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
            placement: 'bottomLeft',
        });
    };

    useEffect(() => {

        openNotification()
        return () => {
            
        }
    }, [])
 

    return(
        <div>
          
        </div>
    )




}


export default Error;
