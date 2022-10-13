import React, { useContext, useEffect, useState } from 'react'
import axios from '../Axios';
import { Link, useParams }  from "react-router-dom";
import UserContext from '../../context/UserContext';
import Spinner from '../spinner';
import SmallSpinner from '../smallSpinner';
import AlertDialog from '../AlertDialog';
import ErrorCheck from '../ErrorCheck';
export default function CommentForm({pcate, mid, psetForm}) {
  let { id } = useParams();
  const userCtx = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [searchNumber, setSearchNumber] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [userName, setUserName] = useState({imageUrl:null, name:null});
  
  const [comment, setComment] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(()=>{
    if(mid){
      setLoading(true);
      axios.get('comment/'+mid).then((result)=>{
        const resultData = result.data.data;
        setLoading(false); setUserId(resultData.userId); setComment(resultData.comment);
        userValue(resultData.userId);
      }).catch((err)=>{setLoading(false); setError(ErrorCheck(err,"Алдаа гарлаа!!!"));})
    }
  },[]);

  const userValue = (uId)=>{
    if(uId){
      setSearchLoading(true);
      axios.get('users/'+uId+'?select=_id lastName firstName profileImage',{
        headers:{Authorization:`Bearer ${userCtx.userState.token}`}
      }).then((result)=>{
        const resultData = result.data.data;
        setSearchLoading(false);
        setUserName({imageUrl:resultData.profileImage, name:resultData.firstName+" "+resultData.lastName});
      }).catch((err)=>{setSearchLoading(false); setError(ErrorCheck(err,"Алдаа гарлаа!!!"));})
    }
  }

  const phoneSearch = (e) =>{
    if(e.target.value.length === 8){
      setSearchLoading(true);
      axios.get('users?select=_id lastName firstName profileImage&role=user&role=blog&phone='+e.target.value,{
            headers:{Authorization:`Bearer ${userCtx.userState.token}`}
      }).then((result)=>{
        const resultData = result.data.data[0]; setSearchLoading(false);
        if(resultData){
          setUserId(resultData._id); setUserName({imageUrl:resultData.profileImage, name:resultData.firstName+" "+resultData.lastName});
        }else{setUserId(null); setUserName({imageUrl:null, name:null}); setSearchNumber(e.target.value); e.target.value="";}
      }).catch((err)=>{setSearchLoading(false); setError(ErrorCheck(err,"Алдаа гарлаа!!!"));})
    }
  }

  const createDataValue = () =>{
    return {cate:pcate,comment:comment,userId:userId,cateId:id,}
  }
  const createComment = ()=>{
    if(id){
      setLoading(true);
      axios.post("comment", createDataValue(),{headers:{Authorization:`Bearer ${userCtx.userState.token}`}})
      .then((result)=>{
        setLoading(false);
        psetForm({mid:null, ac:false})
      }).catch((err)=>{
        setLoading(false);
        setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
      })
    }
  }
  const saveComment = ()=>{
    if(mid){
      setLoading(true);
      axios.put("comment/"+mid, {"comment":comment},{headers:{Authorization:`Bearer ${userCtx.userState.token}`}})
      .then((result)=>{
        setLoading(false);
        psetForm({mid:null, ac:false})
      }).catch((err)=>{
        setLoading(false); setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
      })
    }
  }
  const deleteComment = ()=>{
    if(mid){
      setLoading(true);
      axios.delete("comment/"+mid, {headers:{Authorization:`Bearer ${userCtx.userState.token}`}})
      .then((result)=>{
        setLoading(false); psetForm({mid:null, ac:false});
      }).catch((err)=>{
        setLoading(false); setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
      })
    }
  }

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10">
              <h1 className="m-0">{(pcate === 2 && "Мэдээлэлд") || (pcate === 3 && "Блогийн")} сэтгэгдэл {mid ? "засах":"нэмэх"}</h1>
            </div>{/* /.col */}
            <div className="col-sm-2">
            {pcate === 2 || pcate === 3 ?
              <button type="button" className="btn btn-block btn-primary" onClick={()=>psetForm({mid:null, ac:false})}>Буцах</button>:
              <Link to={`../comment`}>
                <button type="button" className="btn btn-block btn-primary btn-sm">Буцах</button>
              </Link>
            }
            </div>
          </div>{/* /.row */}
        </div>{/* /.container-fluid */}
      </div> 
      <div className="content">
        <div className="container-fluid">
        {error && <div style={{fontSize:18, color:'red',marginLeft:20}}><strong>Алдаа гарлаа!!! {error}</strong></div>}
        {loading ? <Spinner /> :
        <>
          <div className="row">
            <div className="col-sm-2">
              <label htmlFor="Selectrole">Хэрэглэгч хайх</label>
              <input type="number" disabled={mid?true:false} className={`form-control`} name="userId" max={8} placeholder="Утасны дугаар" onChange={phoneSearch}/>
            </div>
            <div className="col-sm-3">
              <label htmlFor="Selectrole">Хэрэглэгч</label>
              {searchLoading ? <SmallSpinner />:
              userId ?
                <div style={{display:'flex', flexDirection:'row'}}>
                  {/* <div>zurag{userName.imageUrl}</div> */}
                  <div>:{userName.name}</div>
                </div>
               :<><div style={{color:'red'}}>{searchNumber}</div><div style={{color:'red'}}>Хэргэлэгч олдсонгүй</div></>
              }
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <label htmlFor="Selectrole">Сэтгэгдэл</label>
              <textarea className={`form-control ${comment ? "" : " is-invalid"}`} 
                rows={3} placeholder="Сэтгэгдэл" name="v" defaultValue={comment} onChange={(e)=>{setComment(e.target.value)}}
              />
            </div>
          </div>
          <div className="card-footer">
          {mid ?
            <>
              <button className={`btn btn-primary ${(userId && pcate && id && comment) ? "" : " disabled"}`}
                disabled={!(userId && pcate && id && comment)} style={{float:'right'}} onClick={saveComment}>Хадгалах</button>
              <AlertDialog btValue="Устгах" title="Сэтгэгдэл" yesFunction={deleteComment}/>
            </>
          :
            <button className={`btn btn-primary ${(userId && pcate && id && comment) ? "" : " disabled"}`} 
              disabled={!(userId && pcate && id && comment)} style={{float:'right'}} onClick={createComment}>
            Нэмэх</button>
          }
          </div>
        </>
        }
        </div>
      </div>
    </div>
  )
}
