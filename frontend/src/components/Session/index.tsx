import React, {useState} from "react";
// import Login from './Login';
import Register from './Register';
import Login from "./Login";



const IndexPage: React.FC = ({}) => {

    const [newUser, setNewUser] = useState<boolean>(true)

    return newUser ? (
    <Register setNewUser={setNewUser}/> ) : 
    (
    <Login setNewUser={setNewUser}/>
    )


}


export default IndexPage;