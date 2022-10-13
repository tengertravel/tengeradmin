import React, { useContext, useEffect, useState } from 'react'
import { Link }  from "react-router-dom";
import Spinner from '../spinner'
import UserContext from '../../context/UserContext';
import axios from '../Axios';
import ErrorCheck from '../ErrorCheck';
export default function BlogDataTable() { 
  const userCtx = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [blogers, setBlogers] = useState([]);
  const [pageNumber , setPageNumber] = useState(1);
  const [pageination , setPageination] = useState(null);
  const [error, setError] = useState(null);
  useEffect(()=>{
    setLoading(true);
    axios.get(`users?role=blog&page=${pageNumber}`,{
      headers:{Authorization:`Bearer ${userCtx.userState.token}`}
    }).then((result)=>{
      setBlogers(result.data.data); setLoading(false); setPageination(result.data.pageination);
    }).catch((err)=>{
      setLoading(false); setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
    })      
  },[pageNumber]);
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
                  <th>Овог</th>
                  <th>Нэр</th>
                  <th>Утас</th>
                  <th>Блог</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{display:"none"}}><td></td><td></td><td></td><td></td><td></td></tr>
                {blogers && blogers.map((option,index) => (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{option.lastName}</td>
                    <td>{option.firstName}</td>
                    <td>{option.phone}</td>
                    <td>
                      <Link to={`../bloglist/${option._id}`}>
                        <button type="button" className="btn btn-block btn-primary btn-sm">Блог</button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        }
        </div>
      </div>
    </div>
  )
}
