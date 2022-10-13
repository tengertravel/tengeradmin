import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import axios from '../../components/Axios';
import UserContext from '../../context/UserContext';
import VacationContext from '../../context/VacationContext';
import DraggableList from '../../components/drag/DraggableList';
import ErrorCheck from '../../components/ErrorCheck';
export default function VacationProvide() {
  let { id } = useParams();
  const vacationCtx = useContext(VacationContext);
  const userCtx = useContext(UserContext);
  const [vprovide, setVprovide] = useState({name:null,provide:[]});
  const [error, setError] = useState(null);
  useEffect(()=>{
    if(id){
      axios.get("vacations/"+id).then((result)=>{
        const resultData = result.data.data;
        setVprovide({ name:resultData.name, provide:resultData.provide, })
      }).catch((err)=>{
        setVprovide({name:null,provide:[]});
        setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
      })
    }
  },[]);

  const savehandle =(newProvide)=>{
    if(id){
      axios.put("vacations/"+id, {provide:[...newProvide]},{
        headers:{Authorization:`Bearer ${userCtx.userState.token}`}
      }).then((result)=>{
      }).catch((err)=>{
        setVprovide({name:null,provide:[]});
        setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
      })
    }
  }

  const provideValue = useRef();
  const provideAdd = ()=>{
    if(provideValue.current.value){
        let newnew =[...vprovide.provide]; newnew.push(provideValue.current.value); provideValue.current.value="";
        setVprovide({name:vprovide.name,provide:newnew});
        savehandle(newnew);
    }
  }

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10">
              <h1 className="m-0">{vacationCtx.vacationState.mcode} кодтой {vprovide.name}</h1>
            </div>{/* /.col */}
            <div className="col-sm-2">
              <Link to={`../vacations/${vacationCtx.vacationState.consultantid}`}>
                <button type="button" className="btn btn-block btn-primary btn-sm">Буцах</button>
              </Link>
            </div>
          </div>{/* /.row */}
        </div>{/* /.container-fluid */}
      </div> 
      <div className="content">
        <div className="container-fluid">
          {error && <div style={{fontSize:18, color:'red'}}><strong>Алдаа гарлаа!!! {error}</strong></div>}
          <div className="row">
            <div className="col-lg-12">
              <div className="card card-primary">
                <div className="card-header">
                  <h3 className="card-title">Аялалд бэлдэх зүйлс</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-5">
                      <div className="input-group input-group-sm">
                        <input type="text" ref={provideValue} className="form-control" />
                        <span className="input-group-append">
                        <button type="button" className="btn btn-info btn-flat" onClick={provideAdd}>Нэмэх</button>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-6">
                      <label htmlFor="Selectrole">Бэлдэх зүйлс</label>
                        <DraggableList data={vprovide.provide} provideSave={savehandle} provideCate={1}/>
                      <ul>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}