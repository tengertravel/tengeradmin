import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import BlogListTable from '../../components/blog/BlogListTable'
import axios from '../../components/Axios';
import UserContext from '../../context/UserContext';
import BlogForm from '../../components/blog/BlogForm';
import ErrorCheck from '../../components/ErrorCheck';
export default function blogList() {
  let { id } = useParams();
  const userCtx = useContext(UserContext);
  const [name, setName] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({bid:null, ac:false});
  useEffect(()=>{
    if(id){
      axios.get('users/'+id+"?select=lastName firstName",{
        headers:{Authorization:`Bearer ${userCtx.userState.token}`}
      }).then((result)=>{
        setName(result.data.data.firstName);
      }).catch((err)=>{
        setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
      })
    }
  },[])
  
  return (
    form.ac ? 
      <BlogForm setForm={setForm} uid={id} uname={name} bid={form.bid}/>
    :
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          {error && <div style={{fontSize:18, color:'red',marginLeft:20}}><strong>Алдаа гарлаа!!! {error}</strong></div>}
          <div className="row mb-2">
            <div className="col-sm-8"><h1 className="m-0">/{name}/ Блог</h1></div>
            <div className="col-sm-2">
              <button type="button" className="btn btn-block btn-success" onClick={()=>setForm({bid:null, ac:true})}>Блог нэмэх</button>
            </div>
            <div className="col-sm-2">
              <Link to="../blog"><button type="button" className="btn btn-block btn-primary">Буцах</button></Link>
            </div>
          </div>
        </div>
      </div> 
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <BlogListTable setForm={setForm}/>
          </div>
        </div>
      </div>
    </div>
  )
}
