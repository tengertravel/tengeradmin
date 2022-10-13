import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import axios from '../../components/Axios';
import ErrorCheck from '../../components/ErrorCheck';
import CoverImgUpload from '../../components/photoUpload/CoverImgUpload';
import ImagesUpload from '../../components/photoUpload/ImagesUpload';
import UserContext from '../../context/UserContext';
import VacationContext from '../../context/VacationContext';
export default function VacationImage() {
  let { id } = useParams();
  const vacationCtx = useContext(VacationContext);
  const userCtx = useContext(UserContext);
  const [vname, setVname] = useState(null);
  const [vnbackgroundImage, setVnbackgroundImage] = useState(null);
  const [vcoverprogress, setVcoverprogress] = useState(null);
  const [vnbannerImage, setVnbannerImage] = useState(null);
  const [vbannerprogress, setVbannerprogress] = useState(null);
  const [vnimages, setVnimages] = useState([]);
  const [vimagesprogress, setVimagesprogress] = useState(null);
  const [error, setError] = useState(null);
  const [vcovererror, setVCoverError] = useState(null);
  const [vbannererror, setVBannerError] = useState(null);
  useEffect(()=>{
    if(id){
      axios.get("vacations/"+id).then((result)=>{
        const resultData = result.data.data;
        setVname(resultData.name);
        if(resultData.backgroundImage){setVnbackgroundImage(resultData.backgroundImage);}
        if(resultData.bannerImage){setVnbannerImage(resultData.bannerImage);}
        setVnimages(resultData.images)
      }).catch((err)=>{
        setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
      })
    }
  },[vcoverprogress,vbannerprogress,vimagesprogress]);

  const deleteImage =(image)=>{
    setVnimages(vnimages.filter((e) => e !== image));
    if(id){
      axios({url:"vacations/"+id+"/photo", method:'DELETE', data: {imageURL:image}, headers:{
        Authorization:`Bearer ${userCtx.userState.token}`}}).then((result)=>{

      }).catch((err)=>{ 
        setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
      })
    }
  }

  const coverImageAdd = (photo)=>{
    if(photo){
      const fd = new FormData();
      fd.append('file', photo, photo.name);
      if(id){
        axios({url:"vacations/"+id+"/coverphoto", method:'PUT', data: fd, headers:{
          Authorization:`Bearer ${userCtx.userState.token}`}
          ,onUploadProgress: progressEvent =>{
            let percentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
            setVcoverprogress(percentage);
          }
        }).then((result)=>{
          setVcoverprogress(null);
        }).catch((err)=>{
          setVCoverError(ErrorCheck(err,"Алдаа гарлаа!!!")); 
          setVcoverprogress(null);
        })
      }
    }
  }
  const bannerImageAdd = (photo)=>{
    if(photo){
      const fd = new FormData();
      fd.append('file', photo, photo.name);
      if(id){
        axios({url:"vacations/"+id+"/bannerphoto", method:'PUT', data: fd, headers:{
          Authorization:`Bearer ${userCtx.userState.token}`}
          ,onUploadProgress: progressEvent =>{
            let percentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
            setVbannerprogress(percentage);
          }
        }).then((result)=>{
          setVbannerprogress(null);
        }).catch((err)=>{
          setVBannerError(ErrorCheck(err,"Алдаа гарлаа!!!")); 
          setVbannerprogress(null);
        })
      }
    }
  }
  const imageAdd = (photo)=>{
    if(photo){
      const fd = new FormData();
      for (let file of photo) {
        fd.append('file', file, file.name);
      }
      if(id){
        axios({url:"vacations/"+id+"/photo", method:'PUT', data: fd, headers:{
          Authorization:`Bearer ${userCtx.userState.token}`}
          ,onUploadProgress: progressEvent =>{
            let percentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
            setVimagesprogress(percentage);
          }
        }).then((result)=>{
          setVimagesprogress(null)
        }).catch((err)=>{
          setError(ErrorCheck(err,"Алдаа гарлаа!!!"));
          setVimagesprogress(null)
        })
      }
    }
  }
  

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10">
              <h1 className="m-0">{vacationCtx.vacationState.mcode} кодтой {vname}</h1>
            </div>{/* /.col */}
            <div className="col-sm-2">
              <Link to={`../vacations/${vacationCtx.vacationState.consultantid}`}>
                <button type="button" className="btn btn-block btn-primary btn-sm">Буцах</button>
              </Link>
            </div>
          </div>{/* /.row */}
        </div>{/* /.container-fluid */}
      </div>
      <div className="content">
        <div className="container-fluid">
          {vcovererror && <div style={{fontSize:18, color:'red'}}><strong>Алдаа гарлаа!!! {vcovererror}</strong></div>}
          <div className="row">
          {vcoverprogress > 0 ?
            <>
              <div className="col-sm-5">
                <div className="progress">
                  <div className="progress-bar bg-primary progress-bar-striped"  
                    role="progressbar" style={{width: `${vcoverprogress}%`}}
                  />
                </div>
              </div>
              <div className="col-sm-1"><div style={{marginTop:-5, textAlign:'left'}}>{vcoverprogress}%</div></div>
            </>
            :
            <CoverImgUpload title="Хөтөлбөрийн үндсэн зураг" imageSize={3} folderUrl="vtCover/" 
              photoUrl={vnbackgroundImage}coverPhotoAdd={coverImageAdd}
            />
          }
          </div>
          {vbannererror && <div style={{fontSize:18, color:'red'}}><strong>Алдаа гарлаа!!! {vbannererror}</strong></div>}
          <div className="row">
          {vbannerprogress > 0 ?
            <>
              <div className="col-sm-5">
                <div className="progress">
                  <div className="progress-bar bg-primary progress-bar-striped"  
                    role="progressbar" style={{width: `${vbannerprogress}%`}}
                  />
                </div>
              </div>
              <div className="col-sm-1"><div style={{marginTop:-5, textAlign:'left'}}>{vbannerprogress}%</div></div>
            </>
            :
            <CoverImgUpload title="Хөтөлбөрийн баннер зураг" imageSize={5} folderUrl="vtBanner/" 
              photoUrl={vnbannerImage} coverPhotoAdd={bannerImageAdd}
            />
          }
          </div>
          {error && <div style={{fontSize:18, color:'red'}}><strong>Алдаа гарлаа!!! {error}</strong></div>}
          {vimagesprogress > 0 ?
            <>
              <div className="col-sm-5">
                <div className="progress">
                  <div className="progress-bar bg-primary progress-bar-striped"  
                    role="progressbar" style={{width: `${vimagesprogress}%`}}
                  />
                </div>
              </div>
              <div className="col-sm-1"><div style={{marginTop:-5, textAlign:'left'}}>{vimagesprogress}%</div></div>
            </>
            :
            <ImagesUpload ptitle="Аяллын альбомд зураг нэмэх" pimageSize={3} pimglimit={30} 
              folderUrl="vt/" pimages={vnimages} photosAdd={imageAdd} photoDelete={deleteImage}
            />
          }
        </div>
      </div>
    </div>
  )
}