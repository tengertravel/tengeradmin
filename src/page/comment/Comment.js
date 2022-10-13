import React from 'react'
import { Link } from 'react-router-dom'
import CommentDataTable from '../../components/comment/CommentDataTable'

export default function Comment() {
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10"><h1 className="m-0">Сэтгэгдэл</h1></div>
            <div className="col-sm-2">
              <Link to="../commentForm"><button type="button" className="btn btn-block btn-success">Сэтгэгдэл нэмэх</button></Link>
            </div>
          </div>
        </div>
      </div> 
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <CommentDataTable cateId={null}/>
          </div>
        </div>
      </div>
    </div>
  )
}
