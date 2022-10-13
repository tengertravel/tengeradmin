import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CommentDataTable from '../comment/CommentDataTable';
import CommentForm from '../comment/CommentForm';

export default function BlogComment() {
  const { id } = useParams();
  const [form, setForm] = useState({mid:null, ac:false});
  return (
    form.ac ? 
      <CommentForm pcate={3} mid={form.mid} psetForm={setForm}/>
    :
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-8">
              <h1 className="m-0">Блогийн сэтгэгдэл</h1>
            </div>
            <div className="col-sm-2">
              <button type="button" className="btn btn-block btn-success" onClick={()=>setForm({mid:null, ac:true})}>Сэтгэгдэл нэмэх</button>
            </div>
            <div className="col-sm-2">
              <Link to={`../blog`}>
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
