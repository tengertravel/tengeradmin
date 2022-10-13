import React, { useContext, useEffect, useState } from 'react'
import Spinner from '../../components/spinner'
import UserContext from '../../context/UserContext';
import axios from '../../components/Axios'
import ErrorCheck from '../../components/ErrorCheck';
import SmallSpinner from '../../components/smallSpinner';
export default function Meneger() { 
  const userCtx = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [formAc, setFormAc] = useState({uId:null,activ:false});
  const [formState, setFormState] = useState([]);
  const [data, setData] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [error, setError] = useState(null);
  const [activLoading, setActivLoading] = useState({cid:null, loading:false});

  useEffect(()=>{
    if(formAc.activ){
        setLoading(true);
        axios.get(`consultants/${formAc.uId}`,{ headers:{Authorization:`Bearer ${userCtx.userState.token}`}})
        .then((result)=>{
          setLoading(false); setFormState(result.data.data);
        }).catch((err)=>{setError(ErrorCheck(err,"Алдаа гарлаа!!!"));})

        axios.get(`users?role=consultant&select=cyrillicName`,{ headers:{Authorization:`Bearer ${userCtx.userState.token}`}})
        .then((result)=>{
          setLoading(false); setConsultants(result.data.data);
        }).catch((err)=>{setError(ErrorCheck(err,"Алдаа гарлаа!!!"));})
    }else{
        setLoading(true);
        axios.get(`consultants?sort=code`,{ headers:{Authorization:`Bearer ${userCtx.userState.token}`}})
        .then((result)=>{
          setLoading(false); setData(result.data.data);
        }).catch((err)=>{setError(ErrorCheck(err,"Алдаа гарлаа!!!"));})  
    }

  },[formAc.activ]);
  const handleSave = (e)=>{
    if(formAc.activ && formState._id && e.target.value){
        setLoading(true);
        axios.put(`consultants/${formState._id}`,{adminId:e.target.value},{ headers:{Authorization:`Bearer ${userCtx.userState.token}`}})
        .then((result)=>{
          setLoading(false); setFormAc({uId:null,activ:false});
        }).catch((err)=>{setError(ErrorCheck(err,"Алдаа гарлаа!!d!"));})
    }
  }
  const activCheck = (cId,activIf) =>{
    setActivLoading({cid:cId, loading:true});
    axios.put('consultants/'+cId,{activ:!activIf},{
      headers:{Authorization:`Bearer ${userCtx.userState.token}`}
    }).then((result)=>{
      let newVacationsState=[];
      data && data.map((option,index) => {
        if(option._id === result.data.data._id){
          newVacationsState.push({...option, activ:!activIf})
        }else{newVacationsState.push(option)}
        return "";
      })
      setData(newVacationsState); setActivLoading({cid:null, loading:false});
    }).catch((err)=>{setActivLoading({cid:null, loading:false}); setError(ErrorCheck(err,"Алдаа гарлаа!!!")); });
  }
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-9">
              <h1 className="m-0">Менежер</h1>
            </div>
            <div className="col-sm-3">
              {formAc.activ && 
                <button type="button" className="btn btn-block btn-primary" onClick={()=>{setFormAc({uId:null,activ:false})}}>Буцах</button>
              }
            </div>
          </div>{/* /.row */}
        </div>{/* /.container-fluid */}
      </div> 
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                {error && <div style={{fontSize:18, color:'red',marginLeft:20}}><strong>Алдаа гарлаа!!! {error}</strong></div>}
                {loading ? <Spinner /> :
                formAc.activ ?
                  <div className="row">
                    <div className="col-sm-2">
                      <label htmlFor="Selectrole">Код:{formState.code && formState.code}</label>
                      <select className={`form-control`} value={formState.adminId ? formState.adminId._id : ""} onChange={handleSave}>
                        <option value="">Сонгох</option>
                        {
                          consultants.map((option,index) => (
                            <option key={index} value={option._id}>{option.cyrillicName}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>
                : 
                  <table id="example1" className="table table-bordered table-striped">
                    <thead>
                      <tr><th>№</th><th>Disabled</th><th>Code</th><th>Name</th><th>Edit</th></tr>
                    </thead>
                    <tbody>
                      <tr style={{display:"none"}}><td></td><td></td><td></td><td></td><td></td></tr>
                        {data && data.map((option,index) => (
                          <tr key={index}>
                            <td>{index+1}</td>
                            <td>
                              {activLoading.cid === option._id && activLoading.loading ? <SmallSpinner /> :
                                <div 
                                  key={index} 
                                  className="custom-control custom-switch custom-switch-off-danger custom-switch-on-success" 
                                  style={{marginLeft:"5px", textAlign:'center'}}
                                >
                                  <input type="checkbox" className="custom-control-input" id={`customSwitch${index}`} 
                                    checked={option.activ} onChange={()=>activCheck(option._id,option.activ)}
                                  />
                                  <label className="custom-control-label" htmlFor={`customSwitch${index}`}></label>
                                </div>
                              }
                            </td>
                            <td>{option.code}</td>
                            <td>{option.adminId && option.adminId.cyrillicName}</td>
                            <td>
                            <button type="button" className="btn btn-block btn-primary btn-sm" 
                              onClick={()=>{setFormAc({uId:option._id,activ:true})}}
                            >Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
