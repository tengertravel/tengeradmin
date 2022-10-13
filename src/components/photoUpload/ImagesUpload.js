import React, { useState } from 'react'

export default function ImagesUpload({ptitle, pimageSize, pimglimit, folderUrl, pimages, photosAdd, photoDelete}) {
  const [hostImageUrl] = useState("https://tengerapi.com/photos/");
  const [onImages, setOnImages] = useState([]);

  const onSelectImages = (e) =>{
    const imagesArray = [];
    if(e.target.files){
      const selectedFiles = e.target.files;
      const selectedFilesArray = Array.from(selectedFiles);
      selectedFilesArray.map((file) =>{
        if(file.size < (pimageSize*1000000)){imagesArray.push(file);}
        return null;
      })
    }
    imagesArray ? setOnImages(imagesArray) : setOnImages([])
  }
  const imagesAdd = () =>{
    if(onImages){
      photosAdd(onImages)
    }
  }
  const deleteImage = (imageurl) =>{
    if(imageurl){
      photoDelete(imageurl)
    }
  }
  return (
    <div>
      <div className="row">
        <div className="col-12">
          <div className="card card-primary">
            <div className="card-header"><h4 className="card-title">{ptitle}</h4></div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-5">
                    {pimages.length >= pimglimit ?
                      <div style={{color:'red'}}>Зургийн тоо {pimglimit} болсон тул зураг нэмэх боломжгүй.</div>
                    :
                      <section>
                        <label 
                          style={{ 
                            display:'flex',justifyContent:'center',alignItems:'center',
                            border:'1px dotted black',borderRadius:'5px',cursor:'pointer',height:'40px'
                          }}
                          >Зураг сонгох {pimageSize}MB дээш зураг сонгогдохгүй!
                          <input type="file" name="coverimage" style={{display:'none'}} multiple
                            onChange={onSelectImages} accept='image/jpg, image/jpeg, image/png'
                        />
                        </label>
                      </section>
                    }
                  
                </div>
                <div className="col-sm-5">
                  {onImages.length > 0 && 
                    (onImages.length > pimglimit - pimages.length ? (<div style={{color:'red'}}>{pimglimit - pimages.length} дээш зураг нэгэн зэрэг нэмэх боломжгүй. {onImages.length - (pimglimit - pimages.length)} зургийг устгана уу</div>)
                    :(
                      <button type="button" className="btn btn-info btn-flat" style={{height:'40px', borderRadius:'5px'}}
                        onClick={imagesAdd}>Нэмэх
                      </button>
                    ))
                  }
                </div>
              </div>
              <div className="row" style={{marginTop:15}}>
                {onImages &&
                  onImages.map((image,index)=>{
                    return(
                      <div key={index} className="col-sm-2">
                        <img src={URL.createObjectURL(image)} className="img-fluid mb-2" alt="black sample" style={{height:'200px', marginTop:'5px'}}/>
                        <div className="row">
                          <div className="col-sm-6">{index+1}</div>
                          <div className="col-sm-6">
                            <button 
                              style={{position:'absolute',bottom:0, right:0,cursor:'pointer',border:'none',color:'white',backgroundColor:'lightcoral'}}
                              onClick={()=>setOnImages(onImages.filter((e) => e !== image))}
                            >Delete
                            </button>
                          </div>
                        </div>
                      </div>     
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card card-primary">
            <div className="card-header"><h4 className="card-title">{pimglimit} дээш зураг орох боломжгүй</h4></div>
            <div className="card-body">
              <div className="row" style={{marginTop:15}}>
                {pimages &&
                  pimages.map((image,index)=>{
                    return(
                      <div key={index} className="col-sm-2">
                        <img src={`${hostImageUrl}${folderUrl}${image}`} className="img-fluid mb-2" alt="black sample" style={{height:'200px', marginTop:'5px'}}/>
                        <div className="row">
                          <div className="col-sm-6">{index+1}</div>
                          <div className="col-sm-6">
                            <button 
                              style={{position:'absolute',bottom:0, right:0,cursor:'pointer',border:'none',color:'white',backgroundColor:'lightcoral'}}
                              onClick={()=>deleteImage(image)}
                            >Delete
                            </button>
                          </div>
                        </div>
                      </div>   
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
