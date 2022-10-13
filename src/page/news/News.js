import React from 'react'
import { Link }  from "react-router-dom";
import NewsDataTable from '../../components/news/NewsDataTable';
export default function News() {
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10">
              <h1 className="m-0">Мэдээллүүд</h1>
            </div>
            <div className="col-sm-2">
              <Link to="../newsForm"><button type="button" className="btn btn-block btn-success">Мэдээлэл нэмэх</button></Link>
            </div>
          </div>
        </div>
      </div> 
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <NewsDataTable />
          </div>
        </div>
      </div>
    </div>
  )
}
