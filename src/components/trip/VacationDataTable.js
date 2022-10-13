import React, { useContext, useEffect, useState } from 'react';
import { Link }  from "react-router-dom";
import Spinner from '../spinner';
import SmallSpinner from '../smallSpinner';
import axios from '../Axios';
import UserContext from '../../context/UserContext';
import ErrorCheck from '../ErrorCheck';

export default function VacationDataTable(props) {
  const userCtx = useContext(UserContext);
  const initialState = { loading: false, data:[]}
  const [vacation, setVacation] = useState(initialState);
  const [activLoading, setActivLoading] = useState({vid:null, loading:false});
  const [bannerLoading, setBannerLoading] = useState({vid:null, loading:false});
  const [bannerId, setBannerId] = useState(null);
  const [pageNumber , setPageNumber] = useState(1);
  const [pageination , setPageination] = useState(null);
  const [error, setError] = useState(null);
  useEffect(()=>{
    setVacation((stateBefore)=>({...stateBefore, loading:true})); setBannerId(null);
    axios.get(`consultants/${props.mcode}/vacations?select=_id name day timetable price createUser activ banner&page=${pageNumber}`).then((result)=>{
      const rsltdata = result.data.data;
      rsltdata && rsltdata.map((option,index) => {
        if(option.banner){setBannerId(option._id)}
         return "";
       })
        setVacation({ loading: false, data:result.data.data}); setPageination(result.data.pageination);
    }).catch((err)=>{setVacation({ loading: false, data:[] }); setError(ErrorCheck(err,"Алдаа гарлаа!!!")); })
  },[props.mcode,pageNumber]);

  const activCheck = (vId,activIf) =>{
    setActivLoading({vid:vId, loading:true});
    axios.put('vacations/'+vId,{activ:!activIf},{
      headers:{Authorization:`Bearer ${userCtx.userState.token}`}
    }).then((result)=>{
      let newVacationsState=[];
      vacation.data && vacation.data.map((option,index) => {
        if(option._id === result.data.data._id){
          newVacationsState.push({...option, activ:!activIf})
        }else{newVacationsState.push(option)}
        return "";
      })
      setVacation({ loading: false, data:newVacationsState}); setActivLoading({vid:null, loading:false});
    }).catch((err)=>{setActivLoading({vid:null, loading:false}); setError(ErrorCheck(err,"Алдаа гарлаа!!!")); });
  }
  const bannerCheck = (vId,bIf) =>{
    if(bannerId){
      if(bannerId===vId){return true}else if(bIf){return true}else{return false}
    }else{return true}
    
  }
  const bannerChange = (vId,bannerIf) =>{
    setBannerLoading({vid:vId, loading:true});
    if(bannerIf){setBannerId(null)}else{setBannerId(vId)}
    axios.put('vacations/'+vId,{banner:!bannerIf},{
      headers:{Authorization:`Bearer ${userCtx.userState.token}`}
    }).then((result)=>{
       let newVacationsState=[];
       vacation.data && vacation.data.map((option,index) => {
         if(option._id === result.data.data._id){
           newVacationsState.push({...option, banner:!bannerIf})
          }else{newVacationsState.push(option)}
          return "";
        })
        setVacation({ loading: false, data:newVacationsState}); setBannerLoading({vid:null, loading:false});
      }).catch((err)=>{setBannerLoading({vid:null, loading:false});setError(ErrorCheck(err,"Алдаа гарлаа!!!")); });
  }
  const handlePage = (e) =>{
    if(e.target.value){
      setPageNumber(e.target.value);
    }
  }
  return (
    <div className="col-lg-12">
    <div className="card">
      <div className="card-body">
      {error && <div style={{fontSize:18, color:'red'}}><strong>Алдаа гарлаа!!! {error}</strong></div>}
      {vacation.loading ? <Spinner /> :
      <>
        <select className="form-control col-sm-2" style={{marginBottom:10}}  defaultValue={pageNumber} onChange={handlePage}>
          <option value="1">Хуудас-1</option>
          {pageination && 
            pageination.pageCount ?
            [...Array(parseFloat(pageination.pageCount)-1)].map((pg, index)=>(
              <option key={index} value={index+2}>Хуудас-{index+2}</option>
            ))
            :null
          }
        </select>
        <table id="example1" className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>№</th>
              <th>Төлөв</th>
              <th>Баннер</th>
              <th>Аяллын нэр</th>
              <th>Хугацаа</th>
              <th>Хуваарь</th>
              <th>Үнэ</th>
              <th>Бэлдэх зүйлс</th>
              <th>Альбом</th>
              <th>Сэтгэгдэл</th>
              <th>Засах</th>
            </tr>
          </thead>
          <tbody>
          <tr style={{display:"none"}}><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
         {vacation.data && vacation.data.map((option,index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>
                    {activLoading.vid === option._id && activLoading.loading ? <SmallSpinner /> :
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
                  <td>
                  {bannerLoading.vid === option._id && bannerLoading.loading ? <SmallSpinner /> :
                    <div 
                      key={index} 
                      className={`custom-control custom-switch 
                        ${bannerCheck(option._id,option.banner) && ' custom-switch-off-danger custom-switch-on-success'}`
                      }
                      style={{marginLeft:"5px", textAlign:'center'}}
                    >
                      <input type="checkbox" className="custom-control-input" id={`bannerSwitch${index}`} 
                        checked={option.banner} disabled={!bannerCheck(option._id,option.banner)}
                        onChange={()=>bannerChange(option._id,option.banner)}
                      />
                      <label className="custom-control-label" htmlFor={`bannerSwitch${index}`}></label>
                    </div>
                  }
                  </td>
                  <td>{option.name}</td>
                  <td>{option.day[1]} шөнө, {option.day[0]} өдөр</td>
                  <td>
                    <Link to={`../vacationDate/${option._id}`}>
                      {
                        option.timetable.length ?
                        option.timetable.map((option, index)=>{
                          const sp = option.split("-");
                          if(sp[1]){ return index > 0 ? ", "+sp[1]+"/"+sp[2] : sp[1]+"/"+sp[2] }else{return "Null"}
                        }) : "Null"
                      }
                    </Link>
                  </td>
                  <td>
                    <Link to={`../vacationPrice/${option._id}`}>{ option.price[0] ? String(option.price[0][1]).replace(/(.)(?=(\d{3})+$)/g,'$1,') : "Null"}</Link>
                  </td>
                  <td><Link to={`../vacationProvide/${option._id}`}>Бэлдэх зүйлс</Link></td>
                  <td><Link to={`../vacationImages/${option._id}`}>Альбом</Link></td>
                  <td><Link to={`../vacationComment/${option._id}`}>Сэтгэгдэл</Link></td>
                  <td>
                    <Link to={`../vacationform/${option._id}`}>
                      <button type="button" className="btn btn-block btn-warning btn-sm">Засах</button>
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
  )
}
