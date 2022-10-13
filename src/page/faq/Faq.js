import React from 'react'
import { Link } from 'react-router-dom'
import FaqDataTable from '../../components/faq/FaqDataTable'

export default function Faq() {
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10">
              <h1 className="m-0">Асуулт хариулт</h1>
            </div>
            <div className="col-sm-2">
              <Link to="../faqForm"><button type="button" className="btn btn-block btn-success">Асуулт хариулт нэмэх</button></Link>
            </div>
          </div>
        </div>
      </div> 
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <FaqDataTable />
          </div>
        </div>
      </div>
    </div>
  )
}
