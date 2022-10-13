import React, { useContext, useEffect, useState } from 'react'
import axios from '../Axios';
import UserContext from '../../context/UserContext';
import Spinner from '../spinner';
import AlertDialog from '../AlertDialog';
import ErrorCheck from '../ErrorCheck';
export default function BlogForm({setForm, uid, uname, bid}) {
  const userCtx = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState({title:"", stitle:"", bodytext:"", subtitle:"", subbodytext:""});
  const [error, setError] = useState(null);

  useEffect(()=>{
    if(bid){
      setLoading(true);
      axios.get("blog/"+bid).then((result)=>{
        setLoading(false);
        const resultData = result.data.data;
        setBlog({title:resultData.title, stitle:resultData.stitle, bodytext:resultData.bodytext, subtitle:resultData.subtitle, subbodytext:resultData.subbodytext})
      }).catch((err)=>{
        setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
        setLoading(false);
      })
    }
  },[])
  const handleType = (e)=>{
    setError(null);
    const {name, value} = e.target;
    setBlog((stateBefore)=>({...stateBefore, [name]:value,}));
  }
  const createDataValue = () =>{
    return{
      userId:uid,title:blog.title,stitle:blog.stitle,bodytext:blog.bodytext,
      subtitle:blog.subtitle,subbodytext:blog.subbodytext,
    }
  }
  const saveHandle = ()=>{
    setLoading(true);
    if(bid){
      axios.put("blog/"+bid, createDataValue(),{headers:{Authorization:`Bearer ${userCtx.userState.token}`}})
      .then((result)=>{
        setLoading(false);
        setForm({bid:null, ac:false})
      }).catch((err)=>{
        setLoading(false);
        setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
      })
    }
  }
  const createHandle = ()=>{
    setLoading(true);
    axios.post("blog", createDataValue(),{headers:{Authorization:`Bearer ${userCtx.userState.token}`}})
    .then((result)=>{
      setLoading(false);
      setForm({bid:null, ac:false});
    }).catch((err)=>{
      setLoading(false);
      setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
    })
  }
  const deleteBlog = () =>{
      if(bid){
      setLoading(true);
      axios.delete("blog/"+bid, {headers:{Authorization:`Bearer ${userCtx.userState.token}`}})
      .then((result)=>{
        setLoading(false);
        setForm({bid:null, ac:false});
      }).catch((err)=>{
        setLoading(false);
        setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
      })
    }
  }
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10">
              <h1 className="m-0">/{uname}/ Блог {bid ? "засах":"нэмэх"}</h1>
            </div>{/* /.col */}
            <div className="col-sm-2">
              <button type="button" className="btn btn-block btn-primary" onClick={()=>{setForm({bid:null, ac:false})}}>Буцах</button>
            </div>
          </div>{/* /.row */}
        </div>{/* /.container-fluid */}
      </div> 
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            {loading ? <Spinner /> :
            <div className="col-12">
              <div className="card card-primary">
                <div className="card-header"><h4 className="card-title">Блог оруулах</h4></div>
                {error && <div style={{fontSize:18, color:'red',marginLeft:20}}><strong>Алдаа гарлаа!!! {error}</strong></div>}
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-12">
                      <label htmlFor="Selectcoin">Гарчиг</label>
                      <input type="text" className={`form-control ${blog.title ? "" : " is-invalid"}`}  maxlength="90"
                        name="title" placeholder="Гарчгийн урт 90 тэмдэгт" defaultValue={blog.title} onChange={handleType}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                      <label htmlFor="Selectrole">Тодотгол</label>
                      <textarea className={`form-control ${blog.stitle ? "" : " is-invalid"}`} 
                        rows={3} placeholder="Тодотгол" name="stitle" defaultValue={blog.stitle} onChange={handleType}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                      <label htmlFor="Selectrole">Блог</label>
                      <textarea className={`form-control ${blog.bodytext ? "" : " is-invalid"}`} 
                        rows={8} placeholder="Мэдээлэл" name="bodytext" defaultValue={blog.bodytext} onChange={handleType}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                      <label htmlFor="Selectcoin">Дэд гарчиг</label>
                      <input type="text" className={`form-control`} name="subtitle" 
                        placeholder="Дэд гарчиг" defaultValue={blog.subtitle} onChange={handleType}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                      <label htmlFor="Selectrole">Дэд блог</label>
                      <textarea className={`form-control`} rows={8} name="subbodytext"
                        placeholder="Дэд мэдээлэл" defaultValue={blog.subbodytext} onChange={handleType} 
                      />
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                {bid ?
                  <>
                    <button className={`btn btn-primary ${(blog.title && blog.stitle && blog.bodytext) ? "" : " disabled"}`} 
                      disabled={!(blog.title && blog.stitle && blog.bodytext)} style={{float:'right'}} onClick={saveHandle}
                    >Хадгалах</button>
                    <AlertDialog btValue="Устгах" title="Блог" yesFunction={deleteBlog}/>
                  </>
                :
                  <button className={`btn btn-primary ${(blog.title && blog.stitle && blog.bodytext) ? "" : " disabled"}`} 
                    disabled={!(blog.title && blog.stitle && blog.bodytext)} style={{float:'right'}} onClick={createHandle}
                  >Нэмэх</button>
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
