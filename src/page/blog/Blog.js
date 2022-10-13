import React from 'react'
import BlogDataTable from '../../components/blog/BlogDataTable'

export default function blog() {
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10"><h1 className="m-0">Блог</h1></div>
          </div>
        </div>
      </div> 
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <BlogDataTable />
          </div>
        </div>
      </div>
    </div>
  )
}
