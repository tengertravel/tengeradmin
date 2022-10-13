import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams }  from "react-router-dom";
import axios from '../Axios';
import UserContext from '../../context/UserContext';
import Spinner from '../spinner';
import AlertDialog from '../AlertDialog';
import ErrorCheck from '../ErrorCheck';
export default function News() {
  const userCtx = useContext(UserContext);
  let { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState({title:"", stitle:"", bodytext:"", subtitle:"", subbodytext:""});
  const [error, setError] = useState(null);

  useEffect(()=>{
      if(id){
      setLoading(true);
      axios.get('news/'+id).then((result)=>{
        const resultData = result.data.data;
        setNews({title:resultData.title, stitle:resultData.stitle, bodytext:resultData.bodytext, subtitle:resultData.subtitle, subbodytext:resultData.subbodytext});
        setLoading(false);
    }).catch((err)=>{ setLoading(false); setError(ErrorCheck(err,"Алдаа гарлаа!!!")); })
    }
  },[])
  const handleType = (e)=>{
      setError(null);
      const {name, value} = e.target;
      setNews((stateBefore)=>({...stateBefore, [name]:value,}));
  }
  const createDataValue = () =>{
    return{
      title:news.title,stitle:news.stitle,bodytext:news.bodytext,
      subtitle:news.subtitle,subbodytext:news.subbodytext,
    }
  }
  const saveHandle = ()=>{
    setLoading(true);
    if(id){
      axios.put("news/"+id, createDataValue(),{headers:{Authorization:`Bearer ${userCtx.userState.token}`}})
      .then((result)=>{
        setLoading(false);
        navigate("/news");
      }).catch((err)=>{
        setLoading(false);
        setError(ErrorCheck(err,"Алдаа гарлаа!!!")); 
      })
    }
  }
  const createHandle = ()=>{
    setLoading(true);
    axios.post("news", createDataValue(),{headers:{Authorization:`Bearer ${userCtx.userState.token}`}})
    .then((result)=>{
      setLoading(false);
      navigate("/news");
    }).catch((err)=>{
      setLoading(false);
      setError(ErrorCheck(err,"Алдаа гарлаа!!!")); 
    })
  }
  const deleteNews = () =>{
    setLoading(true);
    axios.delete("news/"+id, {headers:{Authorization:`Bearer ${userCtx.userState.token}`}})
    .then((result)=>{
      setLoading(false);  navigate("/news");
    }).catch((err)=>{
      setLoading(false);
      setError(ErrorCheck(err,"Алдаа гарлаа!!!")); 
    })
  }
  return (
    loading ? <Spinner />
    :
    <div className="col-12">
      <div className="card card-primary">
        <div className="card-header"><h4 className="card-title">Мэдээлэл оруулах</h4></div>
        {error && <div style={{fontSize:18, color:'red',marginLeft:20}}><strong>Алдаа гарлаа!!! {error}</strong></div>}
        <div className="card-body">
          <div className="row">
            <div className="col-sm-12">
              <label htmlFor="Selectcoin">Гарчиг</label>
              <input type="text" className={`form-control ${news.title ? "" : " is-invalid"}`} name="title" placeholder="Гарчиг" defaultValue={news.title} onChange={handleType}/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <label htmlFor="Selectrole">Тодотгол</label>
              <textarea className={`form-control ${news.stitle ? "" : " is-invalid"}`} rows={3} placeholder="Тодотгол" name="stitle" defaultValue={news.stitle} onChange={handleType} />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <label htmlFor="Selectrole">Мэдээлэл</label>
              <textarea className={`form-control ${news.bodytext ? "" : " is-invalid"}`} rows={8} placeholder="Мэдээлэл" name="bodytext" defaultValue={news.bodytext} onChange={handleType} />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <label htmlFor="Selectcoin">Дэд гарчиг</label>
              <input type="text" className={`form-control`} name="subtitle" placeholder="Дэд гарчиг" defaultValue={news.subtitle} onChange={handleType}/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <label htmlFor="Selectrole">Дэд мэдээлэл</label>
              <textarea className={`form-control`} rows={8} placeholder="Дэд мэдээлэл" name="subbodytext" defaultValue={news.subbodytext} onChange={handleType} />
            </div>
          </div>
        </div>
        <div className="card-footer">
          {id ?
            <>
              <button className={`btn btn-primary ${(news.title && news.stitle && news.bodytext) ? "" : " disabled"}`} disabled={!(news.title && news.stitle && news.bodytext)} style={{float:'right'}} onClick={saveHandle}>Хадгалах</button>
              <AlertDialog btValue="Устгах" title="Мэдээлэл" yesFunction={deleteNews}/>
            </>
          :
            <button className={`btn btn-primary ${(news.title && news.stitle && news.bodytext) ? "" : " disabled"}`} disabled={!(news.title && news.stitle && news.bodytext)} style={{float:'right'}} onClick={createHandle}>Нэмэх</button>
          }
        </div>
      </div>
    </div>
  )
}
