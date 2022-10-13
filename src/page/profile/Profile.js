import React, { useContext, useState } from 'react'
import FormUser from '../../components/users/FormUser'
import UserContext from '../../context/UserContext';
export default function Profile() {
  const userCtx = useContext(UserContext);
  const [userid] = useState(userCtx.userState.userId)
  const [role] = useState(userCtx.userState.role)
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10">
              <h1 className="m-0">Хувийн мэдээлэл</h1>
            </div>
            <div className="col-sm-2">
              
            </div>
          </div>
        </div>
      </div> 
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <FormUser roles={role} userid={userid}/>
          </div>
        </div>
      </div>
    </div>
  )
}
