import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import axios from '../../components/Axios'
import ErrorCheck from '../../components/ErrorCheck';
import Spinner from '../../components/spinner';
import UserContext from '../../context/UserContext';
export default function UserPassword() {
    const userCtx = useContext(UserContext);
    let { id } = useParams();
    const [state, setState] = useState({loading:false,email:null,code:null,role:null,error:null});
    const [newPass, setNewPass] = useState({loading:false,passOne:null,passTwo:null,resetCode:null,error:null,success:"Нууц үг шинэчлэх"});
    useEffect(()=>{
        if(id){
            setState({loading:true,email:null,code:null,error:null});
            axios.get('users/'+id,{
              headers:{Authorization:`Bearer ${userCtx.userState.token}`}
            }).then((result)=>{
              setState({loading:false,email:result.data.data.email,role:result.data.data.role,code:null,error:null});
            }).catch((err)=>{
              setState({loading:false,email:null,code:null,role:null,error:ErrorCheck(err,"Алдаа гарлаа!!!")});
            });
        }
    },[]);
    const codecreate = () =>{
        if(state.email){
            setState({loading:true,email:state.email,code:null,error:null});
            axios.post('users/forgot-password',{email:state.email}).then((result)=>{
                setState((stateBefore)=>({...stateBefore, loading:false,code:result.data.resetPasswordToken,error:null}));
            }).catch((err)=>{
              setState((stateBefore)=>({...stateBefore, loading:false,error:ErrorCheck(err,"Алдаа гарлаа!!!")}))
            })
        }
    }
    const createPass = () =>{
        if(newPass.resetCode){
            if(newPass.passOne && newPass.passTwo){
                if(newPass.passOne === newPass.passTwo){
                    setNewPass((stateBefore)=>({...stateBefore, loading:true,error:null}));
                    axios.post('users/reset-password',{email:state.email,reset_code:newPass.resetCode,password:newPass.passOne})
                    .then((result)=>{
                        setNewPass((stateBefore)=>({...stateBefore, loading:false,error:null,success:"Нууц үг амжиттай солигдлоо."}));
                    }).catch((err)=>{
                        setNewPass((stateBefore)=>({...stateBefore, loading:false,error:ErrorCheck(err,"Алдаа гарлаа!!!")}));
                    });
                }else{setNewPass((stateBefore)=>({...stateBefore, loading:false,error:"Шинэ нууц үг буруу байна."}))}
            }else{setNewPass((stateBefore)=>({...stateBefore, loading:false,error:"Шинэ нууц үгээ оруулна уу."}))}
        }else{setNewPass((stateBefore)=>({...stateBefore, loading:false,error:"Нууц үг шинэчлэх код байхгүй байна."}))}       
    }
    const handleType = (e) =>{
        const {name, value} = e.target;
        setNewPass((stateBefore)=>({...stateBefore, [name]:value, error:null}));
      }
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10">
              <h1>Нууц үг солих</h1>
            </div>{/* /.col */}
            <div className="col-sm-2">
              <Link  to={`../${state.role === 'user' ? "users":"admin"}`}><button type="button" className="btn btn-block btn-primary btn-sm">Буцах</button></Link>
            </div>
          </div>{/* /.row */}
        </div>{/* /.container-fluid */}
      </div> 
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              {state.loading ? <Spinner /> :
              <>
                <div className="card card-primary">
                  <div className="card-header">
                    <h3 className="card-title">
                      <span style={{color:'red', marginRight:5}}>{state.error}</span> 
                      {state.email} хаягтай нууц үг шинэчлэх код: {state.code}
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-4">
                        <input type="email" className="form-control" disabled={true} placeholder="email" defaultValue={state.email}/>
                      </div>
                      <div className="col-sm-8">
                        <button className="btn btn-primary" style={{float:'left'}} onClick={codecreate}>Нууц үг шинэчлэх код авах</button>
                      </div>
                    </div>
                  </div>
                </div>
                {newPass.loading ? <Spinner /> :
                  <div className="card card-primary">
                    <div className="card-header">
                      <h3 className="card-title"><span style={{color:'red', marginRight:5}}>{newPass.error}</span>{newPass.success}</h3>
                    </div>
                    {newPass.success === "Нууц үг шинэчлэх" &&
                      <div className="card-body">
                        <div className="row">
                          <div className="col-sm-4">
                            <label htmlFor="profileimage">Нууц үг шинэчлэх кодоо оруулна уу</label>
                            <input type="number" className="form-control" name="resetCode" placeholder="code" onChange={handleType}/>
                            <label htmlFor="profileimage">Шинэ нууц үгээ оруулна уу</label>
                            <input type="password" className="form-control" name="passOne" onChange={handleType}/>
                            <label htmlFor="profileimage">Шинэ нууц үгээ давтан оруулна уу</label>
                            <input type="password" className="form-control" name="passTwo" onChange={handleType}/>
                            <button className="btn btn-primary" style={{float:'right',marginTop:20}} onClick={createPass}>Нууц үг шинэчлэх</button>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                }
              </>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
