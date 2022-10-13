import React, { useContext, useEffect, useState } from 'react'
import { Link }  from "react-router-dom";
import axios from '../Axios';
import Spinner from '../spinner';
import SmallSpinner from '../smallSpinner';
import UserContext from '../../context/UserContext';
import ErrorCheck from '../ErrorCheck';
export default function FaqDataTable() {
  const userCtx = useContext(UserContext);
  const [activLoading, setActivLoading] = useState({fId:null, loading:false});
  const [loading, setloading] = useState(false);
  const [faq, setFaq] = useState([]);
  const [pageNumber , setPageNumber] = useState(1);
  const [pageination , setPageination] = useState(null);
  const [error, setError] = useState(null);
  useEffect(()=>{
    setloading(true);
    axios.get(`FAQ?page=${pageNumber}`).then((result)=>{
      setloading(false); setFaq(result.data.data); setPageination(result.data.pageination);
    }).catch((err)=>{
      setloading(false); setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
    })
  },[pageNumber])
  const activCheck = (fId,activIf) =>{
    setActivLoading({fId:fId, loading:true});
    axios.put('FAQ/'+fId,{activ:!activIf},{
      headers:{Authorization:`Bearer ${userCtx.userState.token}`}
    }).then((result)=>{
      let newFAQState=[];
      faq && faq.map((option,index) => {
        if(option._id === result.data.data._id){
          newFAQState.push({...option, activ:!activIf})
        }else{newFAQState.push(option)}
        return "";
      })
      setFaq(newFAQState); setActivLoading({fId:null, loading:false});
    }).catch((err)=>{
      setActivLoading({fId:null, loading:false});
      setError(ErrorCheck(err,"Алдаа гарлаа!!!")); 
    });
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
        {error && <div style={{fontSize:18, color:'red',marginLeft:20}}><strong>Алдаа гарлаа!!! {error}</strong></div>}
        {loading ? <Spinner /> :
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
              <thead><tr><th>№</th><th>Төлөв</th><th>Асуулт</th><th>Үзэлт</th><th>Засах</th></tr></thead>
              <tbody>
                <tr style={{display:"none"}}><td></td><td></td><td></td><td></td><td></td></tr>
                {faq.map((option,index)=>{
                  return(
                    <tr key={index}>
                      <td>{index+1}</td>
                      <td>
                      {activLoading.fId === option._id && activLoading.loading ? <SmallSpinner /> :
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
                      <td>{option.ask}</td>
                      <td>{option.viewCount}</td>
                      <td>
                        <Link to={`../FaqForm/${option._id}`}>
                          <button type="button" className="btn btn-block btn-warning btn-sm">Засах</button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}   
              </tbody>
            </table>
          </>
        }
        </div>
      </div>
    </div>
  )
}
