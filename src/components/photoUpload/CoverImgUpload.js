import React, { useState, useRef } from 'react'

export default function CoverImgUpload({title, imageSize, folderUrl, photoUrl,coverPhotoAdd}) {
  const [hostImageUrl] = useState("https://tengerapi.com/photos/");
  const [onImage, setOnImage] = useState(hostImageUrl+"no-image.png");

  const onSelectImage = (e) =>{
    let imagesArray = "";
    if(e.target.files){
      const selectedFiles = e.target.files;
      const selectedFilesArray = Array.from(selectedFiles);
      if(selectedFilesArray[0].size < (imageSize*1000000)){imagesArray=URL.createObjectURL(selectedFilesArray[0]);}
    }
    if(imagesArray){setOnImage(imagesArray)}else{setOnImage(hostImageUrl+"no-image.png")}
  }
  const imageRef = useRef()
  const imageAdd = () =>{
    if(imageRef.current && imageRef.current.files[0]){
       coverPhotoAdd(imageRef.current.files[0]);
       setOnImage(hostImageUrl+"no-image.png");
    }
  }
  return (
    <div className="col-lg-12">
      <div className="card card-primary">
        <div className="card-header"><h3 className="card-title">{title}</h3></div>
        <div className="card-body">
          <div className="row">
            <div className="col-sm-5">
              <section>
                <label 
                  style={{ 
                    display:'flex',justifyContent:'center',alignItems:'center',
                    border:'1px dotted black',borderRadius:'5px',cursor:'pointer',height:'40px'
                  }}
                >{title === 'Хөтөлбөрийн баннер зураг' ? 'Баннер' : 'Үндсэн'} зураг сонгох {imageSize}MB дээш зураг сонгогдохгүй!
                  <input type="file" ref={imageRef} name="coverimage" style={{display:'none'}} 
                    onChange={onSelectImage} accept='image/jpg, image/jpeg, image/png'
                  />
                </label>
              </section>
            </div>
            {onImage !== hostImageUrl+"no-image.png" && 
              <div className="col-sm-5">
                <button type="button" className="btn btn-info btn-flat" onClick={imageAdd} style={{height:'40px', borderRadius:'5px'}}>
                  Хадгалах
                </button>
              </div>
            }
          </div>
          <div className="row" style={{marginTop:15}}>
            {onImage &&
              <div className="col-sm-6"><img src={onImage} className="img-fluid mb-12" alt="white sample" /></div>
            }
            {photoUrl &&
              <div className="col-sm-6">
                <img src={`${hostImageUrl}${folderUrl}${photoUrl}`} className="img-fluid mb-12" alt="white sample" />
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
