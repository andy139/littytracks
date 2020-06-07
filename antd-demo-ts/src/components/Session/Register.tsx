import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Card, Modal,Space, notification } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, SmileOutlined, PoweroffOutlined } from "@ant-design/icons";
import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';
import Error from '../Shared/Error';

interface Props {
    classes? : string;
    setNewUser(name: boolean): any;

}

const FormItem = Form.Item;

const REGISTER_MUTATION = gql `
  mutation($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      user {
        username
        email
      }
    }
  }
`;


const Register: React.FC<Props> = ({ classes, setNewUser }) => {

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("")
  const [createUser, {loading, error}] = useMutation(REGISTER_MUTATION);

  
  function success() {
    Modal.success({
      title: 'New user',
      content: (
        <div>
          <p>Successfully Created</p>
        </div>
      ),
      onOk() { setNewUser(false) },
      okText: "Login"
    });
  }

  





  const handleSubmit = async (createUser) => {
    console.log("handlesubmit")
    const res = await createUser({variables: { 
      username: username,
      email: email,
      password: password,
    }})

    // console.log({res});
    success();
  }


  const onFinish = (values) => {
    // console.log("Received values of form: TEST ", values);
    handleSubmit(createUser);
  };

  return (
    <div style={{ display: "flex" }}>
      <Card style={{ width: 400, margin: "auto", marginTop: 50 }}>
        <form onSubmit={event => handleSubmit(createUser)}>
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
                onChange={e => setUsername(e.target.value)}
              />
            </FormItem>
            <FormItem
              name="email"
              rules={[{ required: true, message: "Please input your Email!" }]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email"
                onChange={e => setEmail(e.target.value)}
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
                onChange={e => setPassword(e.target.value)}
              />
            </FormItem>
    
            <FormItem>
              <Button
                block
            
                loading={loading}
                type="primary"
                htmlType="submit"
                className="login-form-button"
                disabled={loading || !username.trim() || !email.trim() || !password.trim()}
              >
               Register
            </Button>
            </FormItem>

            <FormItem>
              <Button
                block
                onClick={() => setNewUser(false)}
                
              >
                Already have an account? Log in now!
              </Button>
              
            </FormItem>
          </Form>

          {error && <Error error={error}/>}
          
        </form>
       
      </Card>


  
    </div>
  );
};

export default Register;
