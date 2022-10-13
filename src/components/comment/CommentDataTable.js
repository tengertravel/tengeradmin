import React, { useContext, useEffect, useState } from 'react'
import axios from '../Axios';
import UserContext from '../../context/UserContext';
import Spinner from '../spinner';
import SmallSpinner from '../smallSpinner';
import ErrorCheck from '../ErrorCheck';
export default function CommentDataTable({cateId, psetForm}) {
  const userCtx = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState([]);
  const [pageNumber , setPageNumber] = useState(1);
  const [pageination , setPageination] = useState(null);
  const [error, setError] = useState(null);
  const [activLoading, setActivLoading] = useState({cId:null, loading:false});
  useEffect(()=>{
    let axiosUrl = `comment?page=${pageNumber}`; if(cateId){ axiosUrl = `comment?page=${pageNumber}&cateId=`+cateId; }
    setLoading(true);
    axios.get(axiosUrl).then((result)=>{setLoading(false); setComment(result.data.data); setPageination(result.data.pageination);
    }).catch((err)=>{setLoading(false); setError(ErrorCheck(err,"Алдаа гарлаа!!!"));})
  },[pageNumber])

  const activCheck = (cId,activIf) =>{
    setActivLoading({cId:cId, loading:true});
    axios.put('comment/'+cId,{activ:!activIf},{
      headers:{Authorization:`Bearer ${userCtx.userState.token}`}
    }).then((result)=>{
       let newCommentState=[];
       comment && comment.map((option,index) => {
         if(option._id === result.data.data._id){
            newCommentState.push({...option, activ:!activIf})
          }else{newCommentState.push(option)}
          return "";
        })
        setComment(newCommentState); 
        setActivLoading({cId:null, loading:false});
      }).catch((err)=>{
        setActivLoading({cId:null, loading:false});
        setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
    });
  }

  const padTo2Digits =(num)=> {return num.toString().padStart(2, '0');}
  const formatDate = (date)=> {
    return (
      [date.getFullYear(), padTo2Digits(date.getMonth() + 1),padTo2Digits(date.getDate()),].join('-') + ' ' +
      [padTo2Digits(date.getHours()),padTo2Digits(date.getMinutes()),padTo2Digits(date.getSeconds()),].join(':')
    );
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
        {error && <div style={{fontSize:18, color:'red'}}><strong>Алдаа гарлаа!!! {error}</strong></div>}
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
              <thead>
                <tr>
                  <th>№</th>
                  <th>Төлөв</th>
                  <th>Төрөл</th>
                  <th>Нэр</th>
                  <th>Огноо</th>
                  <th>Засах</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{display:"none"}}><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                {comment && comment.map((option,index) =>(
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>
                    {activLoading.cId === option._id && activLoading.loading ? <SmallSpinner /> :
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
                    <td>{(option.cate === 1 && "Аялал") || (option.cate === 2 && "Мэдээлэл") || (option.cate === 3 && "Блог")}</td>
                    <td>{option.userId.firstName+" "+option.userId.lastName}</td>
                    <td>{formatDate(new Date(option.createdAt))}</td>
                    <td>
                      {cateId &&
                      <button type="button" className="btn btn-block btn-primary btn-sm" onClick={()=>psetForm({mid:option._id, ac:true})}>Edit</button>
                      }
                    </td>
                  </tr>
                  )
                )}
              </tbody>
            </table>
          </>
        }
        </div>
      </div>
    </div>
  )
}
