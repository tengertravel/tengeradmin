import React from 'react'

export default function AlertDialog({btValue, title, yesFunction}) {
  return (
    <>
    <button type="button" className="btn btn-primary btn-danger" data-toggle="modal" data-target="#modal-default">{btValue}</button>
    <div className="modal fade" id="modal-default">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">{title}</h4>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">Устгах даа итгэлтэй байна уу?</div>
          <div className="modal-footer justify-content-between">
            <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={yesFunction}>Тийм</button>
            <button type="button" className="btn btn-success" data-dismiss="modal">Үгүй</button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
