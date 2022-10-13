import React, { useContext, useEffect, useState } from 'react'
import { Link }  from "react-router-dom";
import UserContext from '../../context/UserContext';
import axios from '../../components/Axios';
import ImagesUpload from '../../components/photoUpload/ImagesUpload';
import ErrorCheck from '../../components/ErrorCheck';
export default function TotalGallery() {
  const userCtx = useContext(UserContext);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [imagesProgress, setImagesProgress] = useState(null);
  useEffect(()=>{
    axios.get('totalGallery/63031e8821308e86ff6c9b78').then((result)=>{
      setImages(result.data.data.imagesUrl);
    }).catch((err)=>{setError(ErrorCheck(err,"Алдаа гарлаа!!!"));})
  },[])
  
  const photosAdd = (photo)=>{
    if(photo){
      const fd = new FormData();
      for (let file of photo) {
        fd.append('file', file, file.name);
      }
      axios({url:"totalGallery/63031e8821308e86ff6c9b78", method:'PUT', data: fd, headers:{
        Authorization:`Bearer ${userCtx.userState.token}`}
        ,onUploadProgress: progressEvent =>{
          let percentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
          setImagesProgress(percentage);
        }
      }).then((result)=>{
          setImages(result.data.data)
          setImagesProgress(null)
      }).catch((err)=>{
          setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
          setImagesProgress(null)
      })
    }
  }
  const photoDelete = (photo)=>{
    setImages(images.filter((e) => e !== photo));
    axios({url:"totalGallery/63031e8821308e86ff6c9b78", method:'DELETE', data: {imageURL:photo}, headers:{
      Authorization:`Bearer ${userCtx.userState.token}`}}).then((result)=>{
      setImages(result.data.data)
    }).catch((err)=>{ 
      setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
    })
  }

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10">
              <h1 className="m-0">Тотал альбом</h1>
            </div>{/* /.col */}
            <div className="col-sm-2">
              <Link to={`../`}>
                <button type="button" className="btn btn-block btn-primary">Буцах</button>
              </Link>
            </div>
          </div>{/* /.row */}
        </div>{/* /.container-fluid */}
      </div> 
      <div className="content">
        <div className="container-fluid">
          {error && <div style={{fontSize:18, color:'red'}}><strong>Алдаа гарлаа!!! {error}</strong></div>}
          {imagesProgress > 0 ?
          <div className="row">
            <div className="col-sm-5">
              <div className="progress">
                <div className="progress-bar bg-primary progress-bar-striped" role="progressbar" style={{width: `${imagesProgress}%`}} />
              </div>
            </div>
            <div className="col-sm-1"><div style={{marginTop:-5, textAlign:'left'}}>{imagesProgress}%</div></div>
          </div>
          :
          <ImagesUpload ptitle="Тотал альбомд зураг нэмэх" pimageSize={3} pimglimit={40} folderUrl="totalGallery/" 
            pimages={images} photosAdd={photosAdd} photoDelete={photoDelete}/>
          }
        </div>
      </div>
    </div>
  )
}
