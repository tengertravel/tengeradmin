import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from '../../components/Axios';
import CommentDataTable from '../../components/comment/CommentDataTable';
import CommentForm from '../../components/comment/CommentForm';
import VacationContext from '../../context/VacationContext';
export default function VacationComment() {
  const { id } = useParams();
  const vacationCtx = useContext(VacationContext);
  const [form, setForm] = useState({mid:null, ac:false});
  const [vacationName, setVacationName] = useState(null);
  useEffect(()=>{
    if(id){
        axios.get("vacations/"+id+"?select=name").then((result)=>{
          const resultData = result.data.data;
          setVacationName(resultData.name)
        }).catch((err)=>{
            setVacationName(null)
        })
    }
  },[]);
  return (
    form.ac ? 
      <CommentForm pcate={1} mid={form.mid} psetForm={setForm}/>
    :
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-8">
              <h1 className="m-0">{vacationName} сэтгэгдэл</h1>
            </div>
            <div className="col-sm-2">
              <button type="button" className="btn btn-block btn-success" onClick={()=>setForm({mid:null, ac:true})}>Сэтгэгдэл нэмэх</button>
            </div>
            <div className="col-sm-2">
              <Link to={`../vacations/${vacationCtx.vacationState.consultantid}`}>
                <button type="button" className="btn btn-block btn-primary">Буцах</button>
              </Link>
            </div>
          </div>{/* /.row */}
        </div>{/* /.container-fluid */}
      </div> 
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <CommentDataTable cateId={id} psetForm={setForm}/>
          </div>
        </div>
      </div>
    </div>
  )
}
