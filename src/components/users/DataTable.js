import React, { useContext, useEffect, useState } from 'react'
import { Link }  from "react-router-dom";
import Spinner from '../spinner'
import UserContext from '../../context/UserContext';
import axios from '../Axios';
import FormUser from './FormUser';
import ErrorCheck from '../ErrorCheck';
export default function DataTable(props) { 
  const userCtx = useContext(UserContext);
  const [formAc, setFormAc] = useState({uId:null,activ:false});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [rules , setRules] = useState(props.roles);
  const [pageNumber , setPageNumber] = useState(1);
  const [pageination , setPageination] = useState(null);
  const roleValue = (rules === "admin" && "Админ") || (rules === "guide" && "Хөтөч") || (rules === "user" && "Хэрэглэгч");
  const [searchPhone, setSearchPhone] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchData, setSearchData] = useState([]);

  useEffect(()=>{setRules(props.roles);},[props.roles]);

  useEffect(()=>{
    // const script = document.createElement('script'); script.src = 'js/init_datatable.js';  script.async = true; document.body.appendChild(script);
    let roleSort = "";
    if(rules === 'admin'){roleSort=`?role=admin&role=manager&role=consultant&role=operator&page=${pageNumber}`}
    else if(rules === 'user'){roleSort=`?role=user&role=blog&page=${pageNumber}`}
    else if(rules === 'guide'){roleSort=`?role=guide&page=${pageNumber}`}
    setLoading(true);
    axios.get(`users${roleSort}`,{ headers:{Authorization:`Bearer ${userCtx.userState.token}`}})
    .then((result)=>{
      setLoading(false); setData(result.data.data); setPageination(result.data.pageination);
    }).catch((err)=>{setLoading(false); setError(ErrorCheck(err,"Алдаа гарлаа!!!"));})      
  },[formAc.activ,pageNumber]);
  const handlePage = (e) =>{
    if(e.target.value){
      setPageNumber(e.target.value);
    }
  }
  const handlePhone = (e) =>{
    if(e.target.value.length <= 8){
      setSearchPhone(e.target.value);
    }
  }
  const phoneBtn = () =>{
    if(searchPhone > 60000000){
      setSearchLoading(true);
      axios.get(`users?phone=${searchPhone}`,{ headers:{Authorization:`Bearer ${userCtx.userState.token}`}})
      .then((result)=>{
        setSearchLoading(false); setSearchData(result.data.data);
      }).catch((err)=>{setSearchLoading(false); setError(ErrorCheck(err,"Алдаа гарлаа!!!"));}) 
    }
  }
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-9">
              <h1 className="m-0">{roleValue}</h1>
            </div>
            <div className="col-sm-3">
              {formAc.activ ? 
                <button type="button" className="btn btn-block btn-primary" onClick={()=>{setFormAc({uId:null,activ:false})}}>Буцах</button>
              :
                <button type="button" className="btn btn-block btn-success" onClick={()=>{setFormAc({uId:null,activ:true})}}>{roleValue} нэмэх</button>
              }
            </div>
          </div>{/* /.row */}
        </div>{/* /.container-fluid */}
      </div> 
      <div className="content">
        <div className="container-fluid">
          <div className="row">
          {formAc.activ ? 
            <FormUser roles={rules} userid={formAc.uId} setFormAc={setFormAc}/> 
            :
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                {error && <div style={{fontSize:18, color:'red',marginLeft:20}}><strong>Алдаа гарлаа!!! {error}</strong></div>}
                {loading ? <Spinner /> :
                  <>
                    <div className="row">
                      <div className="col-sm-2">
                        <select className="form-control" style={{marginBottom:10}}  defaultValue={pageNumber} onChange={handlePage}>
                          <option value="1">Хуудас-1</option>
                          { pageination && 
                            pageination.pageCount ?
                            [...Array(parseFloat(pageination.pageCount)-1)].map((pg, index)=>(
                              <option key={index} value={index+2}>Хуудас-{index+2}</option>
                            ))
                            :null
                          }
                        </select>
                      </div>
                      <div className="col-sm-2">
                        <input type="number" className="form-control" value={searchPhone ? searchPhone : ""} placeholder="Утасны дугаар" onChange={handlePhone}/>
                      </div>
                      <div className="col-sm-2">
                        <input type="button" className="btn btn-block btn-warning" value="Хайх" onClick={phoneBtn}/>
                      </div>
                    </div>
                    {searchLoading ? <Spinner /> :
                    searchData[0] && 
                      <table id="example1" className="table table-bordered table-striped" style={{marginBottom:10}}>
                        <thead>
                          <tr>
                            <th>№</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Lastname</th>
                            <th>Firstname</th>
                            <th>Phone</th>
                            <th>Edit</th>
                            <th>Password</th>
                          </tr>
                        </thead><tbody>
                          <tr style={{display:"none"}}><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                          {searchData.map((option,index) => (
                            <tr key={index}>
                              <td>{index+1}</td>
                              <td>{option.role}</td>
                              <td>{option.email}</td>
                              <td>{option.lastName}</td>
                              <td>{option.firstName}</td>
                              <td>{option.phone}</td>
                              <td><button type="button" className="btn btn-block btn-primary btn-sm" onClick={()=>{setFormAc({uId:option._id,activ:true})}}>Edit</button></td>
                              <td>
                                <Link to={`../userpassword/${option._id}`}>
                                  <button type="button" className="btn btn-block btn-warning btn-sm">Password</button>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    }
                    <table id="example1" className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>№</th>
                          <th>Role</th>
                          <th>Email</th>
                          <th>Lastname</th>
                          <th>Firstname</th>
                          <th>Phone</th>
                          <th>Edit</th>
                          <th>Password</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{display:"none"}}><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        {data && data.map((option,index) => (
                          <tr key={index}>
                            <td>{index+1}</td>
                            <td>{option.role}</td>
                            <td>{option.email}</td>
                            <td>{option.lastName}</td>
                            <td>{option.firstName}</td>
                            <td>{option.phone}</td>
                            <td><button type="button" className="btn btn-block btn-primary btn-sm" onClick={()=>{setFormAc({uId:option._id,activ:true})}}>Edit</button></td>
                            <td>
                              <Link to={`../userpassword/${option._id}`}>
                                <button type="button" className="btn btn-block btn-warning btn-sm">Password</button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                }
                </div>
              </div>
            </div>
          }
          </div>
        </div>
      </div>
    </div>
  )
}
