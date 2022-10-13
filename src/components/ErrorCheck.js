import React from 'react';
import { Navigate } from "react-router-dom";

export default function ErrorCheck(err,msg) {
    if(!err.response)
    return msg
    if(!err.response.data)
    return msg
    if(!err.response.data.error)
    return msg
    if(!err.response.data.error.message)
    return msg
    if(err.response.data.error.message === 'jwt expired'){
        return <Navigate to="/logout" replace />
    }else{
        return err.response.data.error.message;
    }
    
}
