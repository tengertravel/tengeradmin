import React, { useContext } from 'react';
import { Link, useParams }  from "react-router-dom";
import FormVacation from '../../components/trip/FormVacation';
import VacationContext from '../../context/VacationContext';
export default function VacationForm() {
  let { id } = useParams();
  const vacationCtx = useContext(VacationContext);
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10">
              <h1 className="m-0">{vacationCtx.vacationState.mcode} кодтой аялал {id ? "засах":"нэмэх"}</h1>
            </div>{/* /.col */}
            <div className="col-sm-2">
              <Link to={`../vacations/${vacationCtx.vacationState.consultantid}`}>
                <button type="button" className="btn btn-block btn-primary btn-sm">Буцах</button>
              </Link>
            </div>
          </div>{/* /.row */}
        </div>{/* /.container-fluid */}
      </div> 
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <FormVacation/>
          </div>
        </div>
      </div>
    </div>
  )
}
