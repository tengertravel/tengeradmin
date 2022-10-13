import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams }  from "react-router-dom";
import VacationDataTable from '../../components/trip/VacationDataTable';
import axios from '../../components/Axios';
import VacationContext from '../../context/VacationContext';
import ErrorCheck from '../../components/ErrorCheck';
export default function Vacations() {
  const vacationCtx = useContext(VacationContext);
  let { id } = useParams();
  const initialState = {
    loading: false,
    code:null
  }
  const [consultant, setConsultant] = useState(initialState);
  const [error, setError] = useState(null);
  useEffect(()=>{
    axios.get(`consultants/${id}`).then((result)=>{
      setConsultant({loading: true, code:result.data.data.code});
      vacationCtx.consultantCall(result.data.data.code,result.data.data.id)
    }).catch((err)=>{
      setConsultant({loading: true, code:null});
      setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
    })
  },[id]);
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-8">
              <h1 className="m-0">{consultant.code} Аяллын менежерийн аяллууд</h1>
            </div>
            <div className="col-sm-2">
              <Link to="../vacationOrder"><button type="button" className="btn btn-block btn-success">Аяллын захиалга</button></Link>
            </div>
            <div className="col-sm-2">
              <Link to="../vacationForm"><button type="button" className="btn btn-block btn-info">Аялал нэмэх</button></Link>
            </div>
          </div>
        </div>
      </div> 
      <div className="content">
        <div className="container-fluid">
          {error && <div style={{fontSize:18, color:'red'}}><strong>Алдаа гарлаа!!! {error}</strong></div>}
          <div className="row">
            <VacationDataTable mcode={id}/>
          </div>
        </div>
      </div>
    </div>
  )
}
