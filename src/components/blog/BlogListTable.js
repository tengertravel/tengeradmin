import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams }  from "react-router-dom";
import axios from '../Axios';
import Spinner from '../spinner';
import SmallSpinner from '../smallSpinner';
import UserContext from '../../context/UserContext';
import ErrorCheck from '../ErrorCheck';
export default function BlogListTable({setForm}) {
  let { id } = useParams();
  const userCtx = useContext(UserContext);
  const [loading, setloading] = useState(false);
  const [activLoading, setActivLoading] = useState({nId:null, loading:false});
  const [blog, setBlog] = useState([]);
  const [error, setError] = useState(null);
  useEffect(()=>{
    if(id){
      setloading(true);
      axios.get('blog?userId='+id).then((result)=>{
        setBlog(result.data.data);
        setloading(false);
      }).catch((err)=>{
        setloading(false);
        setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
      })
    }
  },[])
  const activCheck = (nId,activIf) =>{
    setActivLoading({nId:nId, loading:true});
    axios.put('blog/'+nId,{activ:!activIf},{
      headers:{Authorization:`Bearer ${userCtx.userState.token}`}
    }).then((result)=>{
       let newBlogState=[];
       blog && blog.map((option,index) => {
         if(option._id === result.data.data._id){
            newBlogState.push({...option, activ:!activIf})
          }else{newBlogState.push(option)}
          return "";
        })
        setBlog(newBlogState); 
        setActivLoading({nId:null, loading:false});
      }).catch((err)=>{
        setActivLoading({nId:null, loading:false});
        setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
    });
  }
  return (
    <div className="col-lg-12">
      <div className="card">
        <div className="card-body">
        {error && <div style={{fontSize:18, color:'red'}}><strong>Алдаа гарлаа!!! {error}</strong></div>}
        {loading ? <Spinner /> :
          <table id="example1" className="table table-bordered table-striped">
            <thead><tr><th>№</th><th>Төлөв</th><th>Гарчиг</th><th>Үзэлт</th><th>Сэтгэгдэл</th><th>Зураг</th><th>Засах</th></tr></thead>
            <tbody>
              <tr style={{display:"none"}}><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
              {blog.map((option,index)=>{
                return(
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>
                    {activLoading.nId === option._id && activLoading.loading ? <SmallSpinner /> :
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
                    <td>{option.title}</td>
                    <td>{option.viewCount}</td>
                    <td><Link to={`../blogcomment/${option._id}`}>Сэтгэгдэл ({option.commnetCount && option.commnetCount.length})</Link></td>
                    <td><Link to={`../blogimages/${option._id}`}>Зураг</Link></td>
                    <td><button type="button" className="btn btn-block btn-warning btn-sm" onClick={()=>setForm({bid:option._id, ac:true})}>Засах</button></td>
                  </tr>
                )
              })}   
            </tbody>
          </table>
        }
        </div>
      </div>
    </div>
  )
}
