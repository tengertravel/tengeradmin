import React, { useContext, useEffect, useState } from 'react'
import axios from '../../components/Axios';
import ErrorCheck from '../../components/ErrorCheck';
import Spinner from '../../components/spinner';
import UserContext from '../../context/UserContext';
export default function TotalPriceSendMail() {

  const userCtx = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [viewPrice, setViewPrice] = useState(null);
  const [viewEmail, setViewEmail] = useState(null);
  const [pageNumber , setPageNumber] = useState(1);
  const [pageination , setPageination] = useState(null);
  const [error, setError] = useState(null);
  useEffect(()=>{
    setLoading(true);
    axios.get(`totalPriceSendMail?sort=-createdAt&page=${pageNumber}`,{ headers:{Authorization:`Bearer ${userCtx.userState.token}`}}).then((result)=>{
      setLoading(false); setData(result.data.data); setPageination(result.data.pageination);
    }).catch((err)=>{
      setLoading(false); setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
    })
  },[pageNumber])

  const handlePage = (e) =>{
    if(e.target.value){
      setPageNumber(e.target.value);
    }
  }
  const dateFormat = (date) =>{
    if(date){
        let setdate = new Date(date);  // dateStr you get from mongodb
        let y = setdate.getFullYear();
        let m = setdate.getMonth()+1; if(m<10){m = "0"+m;}
        let d = setdate.getDate(); if(d<10){d = "0"+d;}
        let h = setdate.getHours(); if(h<10){h = "0"+h;}
        let n = setdate.getMinutes(); if(n<10){n = "0"+n;}
        let s = setdate.getSeconds(); if(s<10){s = "0"+s;}
        return y+"-"+m+"-"+d+" "+h+":"+n+":"+s;
    }else{return null;}
  }
  const veiwHTML = (html,email)=>{
    if(html && email){setViewPrice(html); setViewEmail(email)}
  }
  const veiwBack = ()=>{
    setViewPrice(null); setViewEmail(null);
  }
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10">
              <h1 className="m-0">Үнийн санал авсан жагсаалт</h1>
            </div>
            <div className="col-sm-2">
              {viewPrice && <button type="button" className="btn btn-block btn-success" onClick={veiwBack}>Буцах</button>}
            </div>
          </div>
        </div>
      </div> 
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            {loading ? <Spinner /> :
              <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                {error && <div style={{fontSize:18, color:'red',marginLeft:20}}><strong>Алдаа гарлаа!!! {error}</strong></div>}
                  {viewPrice ?
                    <>
                    <div><p><strong>и-мэйл: </strong>{viewEmail}</p></div>
                    <div dangerouslySetInnerHTML={{__html: viewPrice}}></div>
                    </>
                    :
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
                        <thead><tr><th>№</th><th>и-мэйл</th><th>огноо</th><th>Үнийн санал</th></tr></thead>
                        <tbody>
                          <tr style={{display:"none"}}><td></td><td></td><td></td><td></td></tr>
                          {data.map((option,index)=>{
                            return(
                              <tr key={index}>
                                <td>{index+1}</td>
                                <td>{option.email}</td>
                                <td>{dateFormat(option.createdAt)}</td>
                                <td>
                                  <button type="button" className="btn btn-block btn-warning btn-sm" onClick={()=>veiwHTML(option.message,option.email)}>Үнийн санал</button>
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
            }
          </div>
        </div>
      </div>
    </div>
  )
}
