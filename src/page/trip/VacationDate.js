import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import axios from '../../components/Axios';
import ErrorCheck from '../../components/ErrorCheck';
import UserContext from '../../context/UserContext';
import VacationContext from '../../context/VacationContext';
export default function VacationDate() {
  let { id } = useParams();
  const vacationCtx = useContext(VacationContext);
  const userCtx = useContext(UserContext);
  const [vdate, setVdate] = useState({name:null,days:[]});
  const [error, setError] = useState(null);
  useEffect(()=>{
    if(id){
        axios.get("vacations/"+id).then((result)=>{
          const resultData = result.data.data;
          setVdate({
            name:resultData.name,
            days:resultData.timetable,
          })
        }).catch((err)=>{
          setVdate({name:null,days:[]});
          setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
        })
    }
  },[]);

  const savehandle =(newDays)=>{
    if(id){
      axios.put("vacations/"+id, {timetable:[...newDays]},{
        headers:{Authorization:`Bearer ${userCtx.userState.token}`}
      }).then((result)=>{
      }).catch((err)=>{
        setVdate({name:null,days:[]});
        setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
      })
    }
  }

  const nowDate = ()=>{
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    return yyyy+"-"+mm+"-"+dd;
  }
  const dateValue = useRef();
  const dayAdd = ()=>{
    if(dateValue.current.value){
        let newnew =[...vdate.days]; newnew.push(dateValue.current.value); dateValue.current.value="";
        newnew.sort(); let uniqueChars = [...new Set(newnew)];
        setVdate({name:vdate.name,days:uniqueChars});
        savehandle(uniqueChars);
    }
  }
  const dayDelete = (ind) =>{
    let ddsss = vdate.days;
    if (ind > -1) { // only splice array when item is found
      ddsss.splice(ind, 1); // 2nd parameter means remove one item only
    }
    setVdate({name:vdate.name,days:ddsss});
    savehandle(ddsss);
  }

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10">
              <h1 className="m-0">Хуваарь засварлах: {vacationCtx.vacationState.mcode} кодтой {vdate.name}</h1>
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
        {error && <div style={{fontSize:18, color:'red',marginLeft:20}}><strong>Алдаа гарлаа!!! {error}</strong></div>}
          <div className="row">
            <div className="col-lg-12">
              <div className="card card-primary">
                <div className="card-header">
                  <h3 className="card-title">Аялал гарах хуваарь.</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-4">
                      <div className="input-group input-group-sm">
                        <input type="date" ref={dateValue} className="form-control" min={nowDate()} />
                        <span className="input-group-append">
                        <button type="button" className="btn btn-info btn-flat" onClick={dayAdd}>Нэмэх</button>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-2">
                      <label htmlFor="Selectrole">Хуваариуд</label>
                      <ul>
                        {
                          vdate.days.map((option,index)=>(
                            <li key={index}>{option}
                              <button className='btn btn-danger btn-xs' style={{padding:"0px 5px", marginLeft:"5px"}} onClick={()=>dayDelete(index)}>X</button>
                            </li>  
                          ))
                        }
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
