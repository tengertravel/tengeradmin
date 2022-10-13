import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams }  from "react-router-dom";
import UserContext from '../../context/UserContext';
import axios from '../Axios';
import ErrorCheck from '../ErrorCheck';
import CoverImgUpload from '../photoUpload/CoverImgUpload';
import ImagesUpload from '../photoUpload/ImagesUpload';
export default function BlogPhoto() {
  let { id } = useParams();
  const userCtx = useContext(UserContext);
  const [coverImgUrl, setCoverImage] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [imageProgress, setImageProgress] = useState(null);
  const [imagesProgress, setImagesProgress] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(()=>{
    if(id){
      axios.get('blog/'+id).then((result)=>{
        setCoverImage(result.data.data.coverUrl);
        setImages(result.data.data.images);
        setUserId(result.data.data.userId)
      }).catch((err)=>{setError(ErrorCheck(err,"Алдаа гарлаа!!!"));})
    }
  },[])
  const coverPhotoAdd = (photo) =>{
    if(photo){
      const fd = new FormData();
      fd.append('file', photo, photo.name);
      if(id){
        axios({url:"blog/"+id+"/coverphoto", method:'PUT', data: fd, headers:{
          Authorization:`Bearer ${userCtx.userState.token}`}
          ,onUploadProgress: progressEvent =>{
            let percentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
            setImageProgress(percentage);
          }
        }).then((result)=>{
            if(result.data.data){setCoverImage(result.data.data)}
           setImageProgress(null);
        }).catch((err)=>{
          setImageProgress(null);
          setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
        })
      }
    }
  }
  const photosAdd = (photo)=>{
    if(photo){
      const fd = new FormData();
      for (let file of photo) {
        fd.append('file', file, file.name);
      }
      if(id){
        axios({url:"blog/"+id+"/photo", method:'PUT', data: fd, headers:{
          Authorization:`Bearer ${userCtx.userState.token}`}
          ,onUploadProgress: progressEvent =>{
            let percentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
            setImagesProgress(percentage);
          }
        }).then((result)=>{
          setImages(result.data.data)
          setImagesProgress(null)
        }).catch((err)=>{
          setImagesProgress(null)
          setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
        })
      }
    }
  }
  const photoDelete = (photo)=>{
    setImages(images.filter((e) => e !== photo));
    if(id){
      axios({url:"blog/"+id+"/photo", method:'DELETE', data: {imageURL:photo}, headers:{
        Authorization:`Bearer ${userCtx.userState.token}`}}).then((result)=>{
        setImages(result.data.data)
      }).catch((err)=>{ 
        setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
      })
    }
  }

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10">
              <h1 className="m-0">Блог зураг {id ? "засах":"нэмэх"}</h1>
            </div>{/* /.col */}
            <div className="col-sm-2">
              <Link to={userId ? `../bloglist/${userId}` : `../blog`}>
                <button type="button" className="btn btn-block btn-primary btn-sm">Буцах</button>
              </Link>
            </div>
          </div>{/* /.row */}
        </div>{/* /.container-fluid */}
      </div> 
      <div className="content">
        <div className="container-fluid">
        {error && <div style={{fontSize:18, color:'red'}}><strong>Алдаа гарлаа!!! {error}</strong></div>}
          <div className="row">
            {imageProgress > 0 ?
            <>
              <div className="col-sm-5">
                <div className="progress">
                  <div className="progress-bar bg-primary progress-bar-striped" role="progressbar" style={{width: `${imageProgress}%`}} />
                </div>
              </div>
              <div className="col-sm-1"><div style={{marginTop:-5, textAlign:'left'}}>{imageProgress}%</div></div>
            </>
            :
            <CoverImgUpload title="Блогийн үндсэн зураг" imageSize={5} folderUrl="blog/cover/" photoUrl={coverImgUrl} 
              coverPhotoAdd={coverPhotoAdd}/>
            }
          </div>
          {error && <div style={{fontSize:18, color:'red'}}><strong>Алдаа гарлаа!!! {error}</strong></div>}
          {imagesProgress > 0 ?
          <div className="row">
            <div className="col-sm-5">
              <div className="progress">
                <div className="progress-bar bg-primary progress-bar-striped" role="progressbar" style={{width: `${imageProgress}%`}} />
              </div>
            </div>
            <div className="col-sm-1"><div style={{marginTop:-5, textAlign:'left'}}>{imageProgress}%</div></div>
          </div>
          :
          <ImagesUpload ptitle="Блогийн альбомд зураг нэмэх" pimageSize={3} pimglimit={10} folderUrl="blog/images/" 
            pimages={images} photosAdd={photosAdd} photoDelete={photoDelete}/>
          }
        </div>
      </div>
    </div>
  )
}
