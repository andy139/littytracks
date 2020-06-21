import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, Modal, Space, notification } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SmileOutlined } from '@ant-design/icons';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { GoogleLogin } from 'react-google-login';
import Error from '../Shared/Error';

interface Props {
	classes?: string;
	setNewUser(name: boolean): any;
}

const LOGIN_MUTATION = gql`
	mutation($username: String!, $password: String!) {
		tokenAuth(username: $username, password: $password) {
			token
		}
	}
`;

const Login: React.FC<Props> = ({ classes, setNewUser }) => {
	const [ username, setUsername ] = useState<string>('');
	const [ password, setPassword ] = useState<string>('');
	const [ tokenAuth, { loading, error, called, client } ] = useMutation(LOGIN_MUTATION, {
		onError(err) {
			console.log(err);
		}
    });
    
    const responseGoogle = (response) => {
        console.log(response);
        console.log(response.profileObj);
    }



	const handleSubmit = async (tokenAuth, client) => {
		
        try {
            const res = await tokenAuth({
                variables: {
                    username: username,
                    password: password
                }
            });
            localStorage.setItem('authToken', res.data.tokenAuth.token);
            client.writeData({ data: { isLoggedIn: true } });
            console.log({ res });
        } catch (e) {

            debugger
            // console.log(e)
        }
	
	};

	const FormItem = Form.Item;

	const onFinish = (values) => {
        // console.log("Received values of form: TEST ", values);
        console.log('Success:', values);
		handleSubmit(tokenAuth, client);
    };
    
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

	return (
		<div style={{ display: 'flex' }}>
			<Card style={{ width: 400, margin: 'auto', marginTop: 100 }}>
				<form>
                    <Form name="normal_login" className="login-form" initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed}>
						<FormItem style={{ display: 'flex' }}>
							<h1>Login</h1>
						</FormItem>
						<FormItem name="username" rules={[ { required: true, message: 'Please input your Username!' } ]}>
							<Input
								prefix={<UserOutlined className="site-form-item-icon" />}
								placeholder="Username"
								onChange={(e) => setUsername(e.target.value)}
							/>
						</FormItem>

						<FormItem name="password" rules={[ { required: true, message: 'Please input your Password!' } ]}>
							<Input
								prefix={<LockOutlined className="site-form-item-icon" />}
								type="password"
								placeholder="Password"
								onChange={(e) => setPassword(e.target.value)}
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
                        {/* <Form.Item name="remember" valuePropName="checked">
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item> */}


                        <FormItem>
                            <GoogleLogin
                                clientId="618494483889-5shti92eipmtv80db71o8rb4isp1ctfj.apps.googleusercontent.com"
                                buttonText="Login"
                                onSuccess={responseGoogle}
                                onFailure={responseGoogle}
                                cookiePolicy={'single_host_origin'}
                            />
							<Button block onClick={() => setNewUser(true)}>
								Don't have an account? Register now!
							</Button>
						</FormItem>
					</Form>

					{error && <Error error={error} />}
				</form>
			</Card>
		</div>
	);
};

export default Login;
