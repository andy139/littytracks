import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Card, Modal, Space, notification } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, SmileOutlined } from "@ant-design/icons";
import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';
import Error from '../Shared/Error';



interface Props {
    classes? : string;
    setNewUser(name: boolean): any;

}

const LOGIN_MUTATION = gql`
  mutation ($username: String!, $password: String!){
  tokenAuth(username: $username, password: $password){
    token
  }
}
`;



const Login:React.FC<Props> = ({classes, setNewUser}) => {


    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [tokenAuth, { loading, error, called, client }] = useMutation(LOGIN_MUTATION);


    const handleSubmit = async (tokenAuth, client) => {
        console.log("Login submit")
        const res = await tokenAuth({
            variables: {
                username: username,
                password: password,
            }
        })

        localStorage.setItem('authToken', res.data.tokenAuth.token);

        client.writeData({data: {isLoggedIn: true}});

        console.log({res});
      
    }


    const FormItem = Form.Item;


    const onFinish = (values) => {
        // console.log("Received values of form: TEST ", values);
        handleSubmit(tokenAuth,client);
    };


    return (
        <div style={{ display: "flex" }}>
            <Card style={{ width: 400, margin: "auto", marginTop: 50 }}>
                <form >
                    <Form

                        name="normal_login"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}

                    >
                        <FormItem style={{ display: "flex" }}>

                            <h1>Login</h1>
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
                                disabled={loading || !username.trim() || !password.trim()}
                            >
                               Log in
                            </Button>
                        </FormItem>

                        <FormItem>
                            <Button
                                block
                                onClick={() => setNewUser(true)}

                            >
                                Don't have an account? Register now!
                            </Button>

                        </FormItem>
                    </Form>

                    {error && <Error error={error} />}

                </form>

            </Card>



        </div>
    )
}




export default Login;