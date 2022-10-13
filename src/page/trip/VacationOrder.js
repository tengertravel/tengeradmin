import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from '../../components/Axios';
import VacationContext from '../../context/VacationContext';
import Spinner from '../../components/spinner';
import ErrorCheck from '../../components/ErrorCheck';
import UserContext from '../../context/UserContext';
export default function VacationOrder() {
  const vacationCtx = useContext(VacationContext);
  const userCtx = useContext(UserContext);
  const [loading, setloading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [order, setOrder] = useState({});
  const [cantact, setCantact] = useState(false);
  const [managerComment, setManagerComment] = useState(null);
  const [orders, setOrders] = useState([]);
  const [pageNumber , setPageNumber] = useState(1);
  const [pageination , setPageination] = useState(null);
  const [error, setError] = useState(null);
  useEffect(()=>{
    if(orderId){
      setloading(true);
      axios.get(`vacationOrders/${orderId}`,{
        headers:{Authorization:`Bearer ${userCtx.userState.token}`}
      }).then((result)=>{
        setloading(false); setOrder(result.data.data);
      }).catch((err)=>{setloading(false); setError(ErrorCheck(err,"Алдаа гарлаа!!!"));})
    }else{
        setloading(true);
        axios.get(`vacationOrders?consultant=${vacationCtx.vacationState.consultantid}&page=${pageNumber}&sort=-createdAt`,{
          headers:{Authorization:`Bearer ${userCtx.userState.token}`}
        }).then((result)=>{
          setloading(false); setOrders(result.data.data); setPageination(result.data.pageination);
        }).catch((err)=>{setloading(false); setError(ErrorCheck(err,"Алдаа гарлаа!!!"));})
    }
  },[orderId,pageNumber]);
  const orderSave =()=>{
    if(orderId){
      setloading(true);
      axios.put(`vacationOrders/${orderId}`,{cantact:cantact,managerComment:managerComment},{
        headers:{Authorization:`Bearer ${userCtx.userState.token}`}
      }).then((result)=>{
        setloading(false); setOrderId(null); setOrder({});
      }).catch((err)=>{setloading(false); setError(ErrorCheck(err,"Алдаа гарлаа!!!"));})
    }
  }
  const padTo2Digits =(num)=> {return num.toString().padStart(2, '0');}
  const formatDate = (date)=> {
    return (
      [date.getFullYear(), padTo2Digits(date.getMonth() + 1),padTo2Digits(date.getDate()),].join('-') + ' ' +
      [padTo2Digits(date.getHours()),padTo2Digits(date.getMinutes()),padTo2Digits(date.getSeconds()),].join(':')
    );
  }
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10">
              <h1 className="m-0">{vacationCtx.vacationState.mcode} кодтой аяллын захиалга</h1>
            </div>{/* /.col */}
            <div className="col-sm-2">
              {orderId ?
                <button type="button" className="btn btn-block btn-primary btn-sm" onClick={()=>setOrderId(null)}>Буцах</button>
                :
                <Link to={`../vacations/${vacationCtx.vacationState.consultantid}`}>
                  <button type="button" className="btn btn-block btn-primary btn-sm">Буцах</button>
                </Link>
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
                {orderId && 
                  <div className="card-header">
                    <h3 className="card-title">{order.vacationName}</h3>
                  </div>
                }
                <div className="card-body">
                  {error && <div style={{fontSize:18, color:'red',marginLeft:20}}><strong>Алдаа гарлаа!!! {error}</strong></div>}
                  {loading ? <Spinner /> :
                    orderId ?
                    <>
                      <div className="row">
                        <div className="col-sm-3">
                          <label htmlFor="Selectcoin">Захиалагчийн нэр</label>
                          <input type="text" className="form-control" disabled defaultValue={order.name}/>
                        </div>
                        <div className="col-sm-2">
                          <label htmlFor="Selectcoin">Утас</label>
                          <input type="text" className="form-control" disabled defaultValue={order.phone}/>
                        </div>
                        <div className="col-sm-1">
                          <label htmlFor="Selectcoin">Том хүн</label>
                          <input type="text" className="form-control" disabled defaultValue={order.adult}/>
                        </div>
                        <div className="col-sm-1">
                          <label htmlFor="Selectcoin">Хүүхэд</label>
                          <input type="text" className="form-control" disabled defaultValue={order.child}/>
                        </div>
                        <div className="col-sm-2">
                          <label htmlFor="Selectcoin">Хуваарь</label>
                          <input type="text" className="form-control" disabled defaultValue={order.timetable}/>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-12">
                          <label htmlFor="Selectrole">Тэмдэглэл</label>
                          <textarea className="form-control" disabled rows={3} placeholder="Тэмдэглэл" defaultValue={order.comment}/>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-3">
                          <label htmlFor="Selectrole">Төлөв{cantact ? "1":"0"}</label>
                          <select className="form-control" defaultValue={order.cantact} 
                            onChange={(e)=>{ e.target.value === 'true' ? setCantact(true) : setCantact(false)}}
                          >
                            <option value="false">Холбогдоогүй</option>
                            <option value="true">Холбогдсон</option>
                          </select>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-12">
                          <label htmlFor="Selectrole">Менежерийн тэмдэглэл</label>
                          <textarea className="form-control" rows={3} placeholder="Менежерийн тэмдэглэл" defaultValue={order.managerComment} onChange={(e)=>{setManagerComment(e.target.value)}}/>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-12">
                          <button className="btn btn-primary" style={{width:'100%',marginTop:20}} onClick={orderSave}>Хадгалах</button>
                        </div>
                      </div>
                    </>
                    :
                    <>
                      <select className="form-control col-sm-2" style={{marginBottom:10}} 
                        defaultValue={pageNumber} onChange={(e)=>setPageNumber(e.target.value)}
                      >
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
                            <th>№</th><th>Огноо</th><th>Аяллын нэр</th><th>Захиалагчийн нэр</th><th>Утас</th><th>Тоо</th><th>Хуваарь</th><th>Төлөв</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{display:"none"}}><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                          {orders.map((order,index)=>{
                            return(
                              <tr key={index}>
                                <td>{index+1}</td>
                                <td>{formatDate(new Date(order.createdAt))}</td>
                                <td>{order.vacationName}</td>
                                <td>{order.name}</td>
                                <td>{order.phone}</td>
                                <td>{order.adult} том {order.child ? order.child+" хүүхэд":null}</td>
                                <td>{order.timetable}</td>
                                <td>
                                  <button type="button" className={`btn btn-block ${order.cantact ? "btn-success" : "btn-warning"} btn-sm`} onClick={()=>setOrderId(order._id)}>
                                    {order.cantact ? "Холбогдсон" : "Холбогдоогүй"}
                                  </button>
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
          </div>
        </div>
      </div>
    </div>
  )
}
