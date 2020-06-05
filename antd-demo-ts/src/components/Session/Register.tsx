import React from "react";
import { Form, Input, Button, Checkbox, Card } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import {Mutation} from 'react-apollo';
import gql from 'apollo-boost';

interface Props {
    classes? : string;
    setNewUser? : string;

}

const FormItem = Form.Item;


const Register: React.FC<Props> = ({ classes, setNewUser }) => {

   const onFinish = (values) => {
     console.log("Received values of form: ", values);
   };

   return (
     <div style={{ display: "flex" }}>
       <Card style={{ width: 400, margin: "auto", marginTop: 50 }}>
         <Form
           name="normal_login"
           className="login-form"
           initialValues={{ remember: true }}
           onFinish={onFinish}
         >
           <FormItem style={{ display: "flex" }}>
        
             <h1>Register</h1>
           </FormItem>
           <FormItem
             name="username"
             rules={[
               { required: true, message: "Please input your Username!" },
             ]}
           >
             <Input
               prefix={<UserOutlined className="site-form-item-icon" />}
               placeholder="Username"
             />
           </FormItem>
           <FormItem
             name="Email"
             rules={[{ required: true, message: "Please input your Email!" }]}
           >
             <Input
               prefix={<MailOutlined className="site-form-item-icon" />}
               placeholder="Email"
             />
           </FormItem>
           <FormItem
             name="password"
             rules={[
               { required: true, message: "Please input your Password!" },
             ]}
           >
             <Input
               prefix={<LockOutlined className="site-form-item-icon" />}
               type="password"
               placeholder="Password"
             />
           </FormItem>
           <FormItem>
             <a className="login-form-forgot" href="">
               Forgot password
             </a>
           </FormItem>
           <FormItem>
             <Button
               type="primary"
               htmlType="submit"
               className="login-form-button"
             >
               Register
             </Button>
           </FormItem>

           <FormItem>
             Or <a href="">login now!</a>
           </FormItem>
         </Form>
       </Card>
     </div>
   );
};

export default Register;
