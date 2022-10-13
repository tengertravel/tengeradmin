import React, { useContext, useState } from 'react';
import UserContext from '../context/UserContext';
import Spinner from '../components/spinner'
export default function Login() {
  
  const userCtx = useContext(UserContext);
  const [emailPassword, setEmailPassword] = useState({
    email:null,
    password:null,
  });
  const handleType = (e) =>{
    const {name, value} = e.target;
    setEmailPassword((stateBefore)=>({...stateBefore, [name]:value}));
    userCtx.loginErrorClear();
  }
  const handleSubmit = () =>{
    userCtx.loginUser(emailPassword.email,emailPassword.password);
  }

    return (
      <div className="row" style={{alignItems:"center",justifyContent:"center",minHeight:"60vh"}}>
        <div style={{width:450}}>
        {userCtx.userState.loading ? <Spinner /> :
          <div className="card card-info">
            <div className="card-header">
              <h3 className="card-title">Нэвтрэх хэсэг</h3>
            </div>
            <div className="card-body">
              <div className="form-group row">
                <label htmlFor="inputEmail3" className="col-sm-3 col-form-label">И-МЭЙЛ</label>
                <div className="col-sm-9">
                  <input type="email" className="form-control" name="email" placeholder="И-МЭЙЛ" onChange={handleType}/>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="inputPassword3" className="col-sm-3 col-form-label">НУУЦ ҮГ</label>
                <div className="col-sm-9">
                  <input type="password" className="form-control" name="password" placeholder="НУУЦ ҮГ"  onChange={handleType}/>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button className="button is-link" onClick={handleSubmit}>Нэвтрэх</button>
              { userCtx.userState.error && (<span style={{color:"#dc3545", textAlign:'center', fontWeight:'bold', marginLeft:"10%"}}>{userCtx.userState.error}</span>) }
            </div>
          </div>
        }

          
        </div>
      </div>
    )
  }
