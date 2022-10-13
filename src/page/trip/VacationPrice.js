import React, { useContext, useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from '../../components/Axios';
import UserContext from '../../context/UserContext';
import VacationContext from '../../context/VacationContext';
import Spinner from '../../components/spinner';
import ErrorCheck from '../../components/ErrorCheck';
export default function VacationPrice() {
  let { id } = useParams();
  const vacationCtx = useContext(VacationContext);
  const userCtx = useContext(UserContext);
  const [vPrice, setVPrice] = useState({loading:false,name:null,price:[]});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(()=>{
    if(id){
      setVPrice({...vPrice,loading:true});
        axios.get("vacations/"+id).then((result)=>{
          const resultData = result.data.data;
          setVPrice({
            loading:false,
            name:resultData.name,
            price:resultData.price
          })
        }).catch((err)=>{
          setVPrice({loading:false,name:null,price:[]});
          setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
        })
    }
  },[]);
  const pricerefticket = useRef();
  const pricerefone = useRef(); const poneone = useRef();  const ponetwo = useRef(); const ponethree = useRef(); const ponefour = useRef();
  const pricereftwo = useRef(); const ptwoone = useRef();  const ptwotwo = useRef(); const ptwothree = useRef(); const ptwofour = useRef();
  const handleType = ()=>{
    if(ptwoone.current.value === ""){
      pricerefone.current.value=""; 
      pricereftwo.current.value=""; ptwotwo.current.value=""; ptwothree.current.value=""; ptwofour.current.value="";
    }
    let handleValue = [
      [pricerefone.current.value, poneone.current.value, ponetwo.current.value, ponethree.current.value, ponefour.current.value,],
      [pricereftwo.current.value, ptwoone.current.value, ptwotwo.current.value, ptwothree.current.value, ptwofour.current.value,],
      [pricerefticket.current.value]
    ];
    setVPrice({name:vPrice.name, price:handleValue,})
  }
  const saveHandle = () =>{
    if(id && vPrice.price[0] && vPrice.price[0][1]){
      //setVPrice({...vPrice,loading:true});
      axios.put("vacations/"+id, {price:[...vPrice.price]},{
        headers:{Authorization:`Bearer ${userCtx.userState.token}`}
      }).then((result)=>{
        setVPrice({...vPrice,loading:false});
        navigate("/vacations/"+vacationCtx.vacationState.consultantid)
      }).catch((err)=>{
        setVPrice({loading:false,name:null,price:[]});
        setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
      })
    }
  }
  const saveHandleCheck = () =>{
    if(vPrice.price[0] && vPrice.price[0][1]){return false;}else{return true;}
  }
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10">
              <h1 className="m-0">Үнэ засварлах: {vacationCtx.vacationState.mcode} кодтой {vPrice.name}</h1>
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
                  <h3 className="card-title">Аяллын үнэ</h3>
                </div>
                {vPrice.loading ? <Spinner /> :
                <>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-2">
                      <select ref={pricerefticket} className={`form-control`} defaultValue={""+vPrice.price[2]} name="ticket" onChange={handleType}>
                        <option value="">Аяллын үнэ</option>
                        <option value="2">Аяллын үнэ + тийз</option>
                      </select>
                      </div>
                      <div className="col-sm-5">
                        <div className="row">
                          <div className="col-sm-12">
                            <input type="text"
                              className={
                                `form-control ${(vPrice.price[0] && vPrice.price[1]) && (vPrice.price[1][1] && vPrice.price[0][0] === "") ? " is-invalid" : ""}`
                              } 
                              ref={pricerefone} placeholder="Үнийн тайлбар" defaultValue={vPrice.price[0] && vPrice.price[0][0]} 
                              onChange={handleType}
                            />
                          </div>
                        </div>
                        
                      </div>
                      <div className="col-sm-5">
                        <div className="row">
                          <div className="col-sm-12">
                            <input type="text" 
                              className={
                                `form-control ${vPrice.price[1] && (vPrice.price[1][1] && vPrice.price[1][0] === "") ? " is-invalid" : ""}`
                              } 
                              ref={pricereftwo} placeholder="Үнийн тайлбар" defaultValue={vPrice.price[1] && vPrice.price[1][0]}
                              onChange={handleType}
                            />
                          </div>
                        </div>
                        
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                      <div className="row">
                          <div className="col-sm-7" style={{marginLeft:30, marginTop:10}}>
                            <input type="text" className={`form-control`} style={{textAlign:'right'}} disabled={true} placeholder={"Том хүн"} />
                          </div>
                          <div className="col-sm-3" style={{marginLeft:10, marginTop:10}}>
                            <input type="number" className={`form-control ${vPrice.price[0] && vPrice.price[0][1] ? "" : " is-invalid"}`} 
                              style={{textAlign:'left'}} ref={poneone} placeholder="Үнэ" 
                              defaultValue={vPrice.price[0] && vPrice.price[0][1]}
                              onChange={handleType}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-7" style={{marginLeft:30, marginTop:10}}>
                            <input type="text" className={`form-control`} style={{textAlign:'right'}} 
                              disabled={true} placeholder="Ганцаараа 1 өрөөнд орох бол"
                            />
                          </div>
                          <div className="col-sm-3" style={{marginLeft:10, marginTop:10}}>
                            <input type="number" className={`form-control ${vPrice.price[0] && vPrice.price[0][2] ? "" : " is-invalid"}`} 
                              style={{textAlign:'left'}} ref={ponetwo} placeholder="Үнэ" defaultValue={vPrice.price[0] && vPrice.price[0][2]}
                              onChange={handleType}
                            />
                          </div>
                        </div>   
                        <div className="row">
                          <div className="col-sm-7" style={{marginLeft:30, marginTop:10}}>
                            <input type="text" className={`form-control`} style={{textAlign:'right'}} 
                              disabled={true} placeholder="Хүүхэд /12 нас хүртэлх/"
                            />
                          </div>
                          <div className="col-sm-3" style={{marginLeft:10, marginTop:10}}>
                            <input type="number" className={`form-control ${vPrice.price[0] && vPrice.price[0][3] ? "" : " is-invalid"}`} 
                              style={{textAlign:'left'}} ref={ponethree} placeholder="Үнэ" defaultValue={vPrice.price[0] && vPrice.price[0][3]}
                              onChange={handleType}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-7" style={{marginLeft:30, marginTop:10}}>
                            <input type="text" className={`form-control`} style={{textAlign:'right'}} 
                              disabled={true} placeholder="Зочид буудалд оргүй"
                            />
                          </div>
                          <div className="col-sm-3" style={{marginLeft:10, marginTop:10}}>
                            <input type="number" className={`form-control ${vPrice.price[0] && vPrice.price[0][4] ? "" : " is-invalid"}`} 
                              style={{textAlign:'left'}} ref={ponefour} placeholder="Үнэ" defaultValue={vPrice.price[0] && vPrice.price[0][4]}
                              onChange={handleType}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                      <div className="row">
                          <div className="col-sm-7" style={{marginLeft:30, marginTop:10}}>
                            <input type="text" className={`form-control`} style={{textAlign:'right'}} 
                              disabled={true} placeholder="Том хүн"
                            />
                          </div>
                          <div className="col-sm-3" style={{marginLeft:10, marginTop:10}}>
                            <input type="number" 
                              className={
                                `form-control ${vPrice.price[1] && (vPrice.price[1][1] && vPrice.price[1][1] === "") ? " is-invalid" : ""}`
                              }  
                              style={{textAlign:'left'}} ref={ptwoone} placeholder="Үнэ" defaultValue={vPrice.price[1] && vPrice.price[1][1]}
                              onChange={handleType}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-7" style={{marginLeft:30, marginTop:10}}>
                            <input type="text" className={`form-control`} style={{textAlign:'right'}} 
                              disabled={true} placeholder="Ганцаараа 1 өрөөнд орох бол"
                            />
                          </div>
                          <div className="col-sm-3" style={{marginLeft:10, marginTop:10}}>
                            <input type="number" 
                              className={
                                `form-control ${vPrice.price[1] && (vPrice.price[1][1] && vPrice.price[1][2] === "") ? " is-invalid" : ""}`
                              }
                              style={{textAlign:'left'}} ref={ptwotwo} placeholder="Үнэ" defaultValue={vPrice.price[1] && vPrice.price[1][2]}
                              onChange={handleType}
                            />
                          </div>
                        </div>   
                        <div className="row">
                          <div className="col-sm-7" style={{marginLeft:30, marginTop:10}}>
                            <input type="text" className={`form-control`} style={{textAlign:'right'}} 
                              disabled={true} placeholder="Хүүхэд /12 нас хүртэлх/"
                            />
                          </div>
                          <div className="col-sm-3" style={{marginLeft:10, marginTop:10}}>
                            <input type="number"
                              className={
                                `form-control ${vPrice.price[1] && (vPrice.price[1][1] && vPrice.price[1][3] === "") ? " is-invalid" : ""}`
                              } 
                              style={{textAlign:'left'}} ref={ptwothree} placeholder="Үнэ" defaultValue={vPrice.price[1] && vPrice.price[1][3]}
                              onChange={handleType}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-sm-7" style={{marginLeft:30, marginTop:10}}>
                              <input type="text" className={`form-control`} style={{textAlign:'right'}} 
                                disabled={true} placeholder="Зочид буудалд оргүй"
                              />
                          </div>
                          <div className="col-sm-3" style={{marginLeft:10, marginTop:10}}>
                              <input type="number"
                                className={
                                  `form-control ${vPrice.price[1] && (vPrice.price[1][1] && vPrice.price[1][4] === "") ? " is-invalid" : ""}`
                                }
                                style={{textAlign:'left'}} ref={ptwofour} placeholder="Үнэ" defaultValue={vPrice.price[1] && vPrice.price[1][4]}
                                onChange={handleType}
                              />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button className={`btn btn-primary ${saveHandleCheck() ? " disabled" : ""}`} style={{float:'right'}} 
                    disabled={saveHandleCheck()} onClick={saveHandle}>Хадгалах</button>
                  </div>
                </>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
