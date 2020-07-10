import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, Modal, Space, notification, Divider, Row, Col, } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SmileOutlined, PoweroffOutlined } from '@ant-design/icons';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import Error from '../Shared/Error';
import { LOGIN_MUTATION } from '../Session/Login';
import './session.css';

interface Props {
	classes?: string;
	setNewUser(name: boolean): any;
}

const FormItem = Form.Item;

const REGISTER_MUTATION = gql`
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
	const [ username, setUsername ] = useState<string>('');
	const [ email, setEmail ] = useState<string>('');
	const [ password, setPassword ] = useState<string>('');
	const [ createUser, { loading, error } ] = useMutation(REGISTER_MUTATION);
	const [tokenAuth, { client }] = useMutation(LOGIN_MUTATION, {
		onError(err) {
			console.log(err);
		}
	});

	function success() {
		Modal.success({
			title: 'New user',
			content: (
				<div>
					<p>Successfully Created</p>
				</div>
			),
			onOk() {
				setNewUser(false);
			},
			okText: 'Login'
		});
	}
	
	const loginDemoUser = async (tokenAuth, client) => {

		try {
			const res = await tokenAuth({
				variables: {
					username: 'MusicLover415',
					password: 'password'
				}
			});


			localStorage.setItem('authToken', res.data.tokenAuth.token);
			client.writeData({ data: { isLoggedIn: true } });
			console.log({ res });
		} catch (e) {


			// console.log(e)
		}



	}



	const handleSubmit = (createUser) => {
		console.log('handlesubmit');
		createUser({
			variables: {
				username: username,
				email: email,
				password: password
			}
		})
			.then(() => {
				success();
			})
			.catch((e) => {});
	};

	const onFinish = (values) => {
		// console.log("Received values of form: TEST ", values);
		handleSubmit(createUser);
  };
  
  const validateMessages = {
    required: '${name} is required!',
    types: {
      email: `The input is not a valid email!`,
    },

  };


	return (
	
		<div className='background-div'>
			<Row justify='center' style={{marginTop: 30}}>
				<img src="https://django-app-images.s3-us-west-1.amazonaws.com/largelogo.png" style={{ width: 450 }} />
			</Row>
			<Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}>
				
    		</Divider>

			<Row>
				<Card style={{ width: 400, margin: 'auto', marginTop: 90, opacity:0.9 }}>
					<form onSubmit={(event) => handleSubmit(createUser)}>
						<Form name="normal_login" className="login-form" initialValues={{ remember: true }} onFinish={onFinish} validateMessages={validateMessages} >
							<FormItem style={{ display: 'flex' }}>
								<h1>Register</h1>
							</FormItem>
							<FormItem name="username" rules={[{ required: true, message: 'Please input your Username!' }]}>
								<Input
									prefix={<UserOutlined className="site-form-item-icon" />}
									placeholder="Username"
									onChange={(e) => setUsername(e.target.value)}
									autoComplete="new-password"
								/>
							</FormItem>
							<FormItem name="Email" rules={[{ required: true, type: 'email' }]}>
								<Input
									prefix={<MailOutlined className="site-form-item-icon" />}
									placeholder="Email"
									onChange={(e) => setEmail(e.target.value)}
									autoComplete="new-password"
								/>
							</FormItem>

							<FormItem name="password"
								rules={[{ required: true, message: 'Please input your Password!' }]}
								hasFeedback
							>
								<Input.Password
									prefix={<LockOutlined className="site-form-item-icon" />}
									type="password"
									placeholder="Password"
									onChange={(e) => setPassword(e.target.value)}
									autoComplete="new-password" 
								/>
							</FormItem>



							<Form.Item
								name="confirm"

								dependencies={['password']}
								hasFeedback
								rules={[
									{
										required: true,
										message: 'Please confirm your password!',
									},
									({ getFieldValue }) => ({
										validator(rule, value) {
											if (!value || getFieldValue('password') === value) {
												return Promise.resolve();
											}
											return Promise.reject('The two passwords that you entered do not match!');
										},
									}),
								]}
							>
								<Input.Password
									prefix={<LockOutlined className="site-form-item-icon" />}
									type="password"
									placeholder="Confirm Password" />
							</Form.Item>

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
							<Divider> OR </Divider>
							<FormItem>
								<Button
									block

									type="primary"

									className="login-form-button"
									onClick={(e) => loginDemoUser(tokenAuth, client)}

								>
									Log in with Demo User
								</Button>
							</FormItem>


							<FormItem>
								<Button block onClick={() => setNewUser(false)}>
									Already have an account? Log in now!
							</Button>
							</FormItem>
						</Form>

						{error && <Error error={error} />}
					</form>
				</Card>
			</Row>
	
		</div>

	);
};

export default Register;
