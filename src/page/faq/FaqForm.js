import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from '../../components/Axios';
import UserContext from '../../context/UserContext';
import Spinner from '../../components/spinner';
import AlertDialog from '../../components/AlertDialog';
import ErrorCheck from '../../components/ErrorCheck';
export default function FaqForm() {
  let { id } = useParams();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [faq, setFaq] = useState({ask:"", answer:""});
  const [error, setError] = useState(null);
  useEffect(()=>{
    if(id){
      setLoading(true);
      axios.get("FAQ/"+id).then((result)=>{
        setLoading(false); setFaq({ask:result.data.data.ask, answer:result.data.data.answer});
      }).catch((err)=>{
        setLoading(false); setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
      })
    }
  },[])
  const handleType = (e)=>{
    setError(null);
    const {name, value} = e.target;
    setFaq((stateBefore)=>({...stateBefore, [name]:value,}));
  }
  const createHandle = ()=>{
    setLoading(true);
    axios.post("FAQ",{ask: faq.ask, answer: faq.answer},{headers:{Authorization:`Bearer ${userCtx.userState.token}`}})
    .then((result)=>{
      setLoading(false); console.log(result);
      navigate("/faq");
    }).catch((err)=>{
      setLoading(false); setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
    })
  }
  const saveHandle = ()=>{
    if(id){
      setLoading(true);
      axios.put("FAQ/"+id,{ask: faq.ask, answer: faq.answer},{headers:{Authorization:`Bearer ${userCtx.userState.token}`}})
      .then((result)=>{
        setLoading(false); navigate("/faq");
      }).catch((err)=>{
        setLoading(false); setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
      })
    }
  }
  const deleteHandle = ()=>{
    setLoading(true);
    axios.delete("FAQ/"+id, {headers:{Authorization:`Bearer ${userCtx.userState.token}`}})
    .then((result)=>{
      setLoading(false); navigate("/faq");
    }).catch((err)=>{
      setLoading(false); setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
    })
  }

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10"><h1 className="m-0">Асуулт хариулт {id ? "засах":"нэмэх"}</h1></div>{/* /.col */}
            <div className="col-sm-2">
              <Link to={`../faq`}><button type="button" className="btn btn-block btn-primary">Буцах</button></Link>
            </div>
          </div>{/* /.row */}
        </div>{/* /.container-fluid */}
      </div> 
      <div className="content">
        <div className="container-fluid">
          {loading ? <Spinner /> :
            <div className="row">
              <div className="col-12">
                <div className="card card-primary">
                  {error && <div style={{fontSize:18, color:'red',marginLeft:20}}><strong>Алдаа гарлаа!!! {error}</strong></div>}
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-12">
                        <label htmlFor="Selectcoin">Асуулт</label>
                        <input type="text" className={`form-control${faq.ask ? "" : " is-invalid"}`} 
                          name="ask" placeholder="Асуулт" defaultValue={faq.ask} onChange={handleType}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-12">
                        <label htmlFor="Selectrole">Хариулт</label>
                        <textarea className={`form-control${faq.answer ? "" : " is-invalid"}`} rows={8} 
                          name="answer" placeholder="Хариулт"  defaultValue={faq.answer} onChange={handleType}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                  {id ?
                    <>
                      <button className={`btn btn-primary ${(faq.ask && faq.answer) ? "" : " disabled"}`} 
                        disabled={!(faq.ask && faq.answer)} style={{float:'right'}} onClick={saveHandle}
                      >Хадгалах</button>
                      <AlertDialog btValue="Устгах" title="Асуулт хариулт" yesFunction={deleteHandle}/>
                    </>
                  :
                    <button className={`btn btn-primary ${(faq.ask && faq.answer) ? "" : " disabled"}`} 
                      disabled={!(faq.ask && faq.answer)} style={{float:'right'}} onClick={createHandle}
                    >Нэмэх</button>
                  }
                  </div>
                </div>
              </div>
            </div>
          }
          
        </div>
      </div>
    </div>
  )
}
