import React from 'react'
import { Link, useParams }  from "react-router-dom";
import News from './News';
export default function FormNews() {
  let { id } = useParams();
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10">
              <h1 className="m-0">Мэдээлэл {id ? "засах":"нэмэх"}</h1>
            </div>{/* /.col */}
            <div className="col-sm-2">
              <Link to={`../news`}>
                <button type="button" className="btn btn-block btn-primary">Буцах</button>
              </Link>
            </div>
          </div>{/* /.row */}
        </div>{/* /.container-fluid */}
      </div> 
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <News/>
          </div>
        </div>
      </div>
    </div>
  )
}
