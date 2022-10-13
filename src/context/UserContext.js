import React, { useState } from 'react';
import axios from '../components/Axios';

const UserContext = React.createContext();
const initialState = {
    loading: false,
    userId: null,
    token: null,
    role:null,
    firstName:null,
    profileImg:null,
    errorCode:null,
    error: null,
}

export const UserStore = (props) =>{
    const [userState, setUserState] = useState(initialState);
    const loginUser = (email, password) =>{
        setUserState({...userState, loading:true });
        //const data = {email,password,returnToken:true};
        axios.post('users/login',{
        email: email,
        password: password
        }).then((result) => {
            const resultData = result.data.data;
            if(resultData.role === 'admin' || resultData.role === 'operator' || resultData.role === 'manager' || resultData.role === 'consultant'){
                setUserState({...userState, 
                    loading:false,token:result.data.token,userId:resultData._id,
                    role:resultData.role,firstName:resultData.firstName,
                    error:null
                });
                localStorage.setItem("token",result.data.token);
                localStorage.setItem("userId",resultData._id);
                localStorage.setItem("role",resultData.role);
                localStorage.setItem("firstName",resultData.firstName);
            }else{
                setUserState({...userState, loading:false,token:null,userId:null, error:"и-мэйл болон нууц үг буруу байна."});
            }
        }).catch((err) => {
            let errMessage="Алдаа."; console.log(err)
            if(err.response.data){ if(err.response.data.error){errMessage = err.response.data.error.message;}}
            setUserState({...userState, loading:false,token:null,userId:null, error:errMessage});
        });
    }
    const loginErrorClear = () =>{
        setUserState(initialState);
    }
    const logout = () =>{
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        localStorage.removeItem("firstName");
        setUserState(initialState);
    }
    const loginSucess = (uToken,uId,uRole,uFName)=>{
        setUserState({...userState, 
            loading:false,token:uToken,userId:uId,
            role:uRole,firstName:uFName,
            error:null
        });
        return true;
    }

    return(
        <UserContext.Provider value={{ userState, loginUser, loginErrorClear, logout, loginSucess }}>
            {props.children}
        </UserContext.Provider>
    );
}

export default UserContext;