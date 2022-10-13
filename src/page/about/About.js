import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from '../../components/Axios';
import ErrorCheck from '../../components/ErrorCheck';
import CoverImgUpload from '../../components/photoUpload/CoverImgUpload';
import UserContext from '../../context/UserContext';
export default function About() {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const [aboutImageProgress, setAboutImageProgress] = useState(null);
  const [aboutImage, setAboutImage] = useState(null);
  const [about, setAbout] = useState({loading:false,videourl:"",title:"", bodytext:""});

  const [aboutId, setAboutId] = useState(null);
  const [aboutError, setAboutError] = useState(null);
  useEffect(()=>{
    setAbout({...about,loading:true});
    axios.get("about").then((result)=>{
      const resultData = result.data.data;
      if(resultData[0]){
        setAbout({loading:false,videourl:resultData[0].videoUrl,
          title:resultData[0].title,bodytext:resultData[0].bodytext,
        })
        setAboutImage(resultData[0].imageUrl)
        setAboutId(resultData[0]._id);
      }else{ setAbout({loading:false,videourl:"",title:"", bodytext:""}); }
    }).catch((err)=>{
      setAbout({loading:false,videourl:"",title:"", bodytext:""});
      setAboutError(ErrorCheck(err,"Алдаа гарлаа!!!"));
    })
  },[]);

  const imageAdd = (photo)=>{
    if(photo){
      const fd = new FormData();
      fd.append('file', photo, photo.name);
      if(aboutId){
        axios({url:"about/"+aboutId+"/image", method:'PUT', data: fd, headers:{
          Authorization:`Bearer ${userCtx.userState.token}`}
          ,onUploadProgress: progressEvent =>{
            let percentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
            setAboutImageProgress(percentage);
          }
        }).then((result)=>{
          setAboutImage(result.data.data); setAboutImageProgress(null);
        }).catch((err)=>{
          setAboutError(ErrorCheck(err,"Алдаа гарлаа!!!"));
          setAboutImageProgress(null);
        })
      }
    }
  }


  const handleType = (e)=>{
    setAboutError(null);
    const {name, value} = e.target;
    setAbout((stateBefore)=>({...stateBefore, [name]:value,}));
  }
  const createHandle = ()=>{
    if(aboutId && about.videourl && about.title && about.bodytext){
      setAbout({...about,loading:true});
      axios.put("about/"+aboutId, {videoUrl:about.videourl,title:about.title,bodytext:about.bodytext},{
        headers:{Authorization:`Bearer ${userCtx.userState.token}`}
      }).then((result)=>{
        navigate("/")
      }).catch((err)=>{
        setAboutError(ErrorCheck(err,"Алдаа гарлаа!!!"))
      })
    }else{setAboutError("Мэдээлэл дутуу байна."); }
  }


  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-10">
              <h1 className="m-0">Бидний тухай</h1>
            </div>
            {aboutError && <div style={{fontSize:18, color:'red'}}><strong>Алдаа гарлаа!!! {aboutError}</strong></div>}
          </div>{/* /.row */}
        </div>{/* /.container-fluid */}
      </div>
      <div className="content">
        <div className="container-fluid">
          <div className="row">
          {aboutImageProgress > 0 ?
            <>
              <div className="col-sm-5">
                <div className="progress">
                  <div className="progress-bar bg-primary progress-bar-striped" role="progressbar" style={{width: `${aboutImageProgress}%`}} />
                </div>
              </div>
              <div className="col-sm-1"><div style={{marginTop:-5, textAlign:'left'}}>{aboutImageProgress}%</div></div>
            </>
            :<CoverImgUpload title="Хамт олны зураг" imageSize={4} folderUrl="about/" photoUrl={aboutImage} coverPhotoAdd={imageAdd}/>
          }
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card card-primary">
                <div className="card-header"><h4 className="card-title">Танилцуулга</h4></div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-12">
                    <label htmlFor="Selectcoin">Видео хаяг</label>
                    <input type="text" className={`form-control`} name="videourl" placeholder="Видео хаяг" defaultValue={about.videourl} onChange={handleType}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                    <label htmlFor="Selectcoin">Гарчиг</label>
                    <input type="text" className={`form-control ${about.title ? "" : " is-invalid"}`} name="title" placeholder="Гарчиг" defaultValue={about.title} onChange={handleType}/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                    <label htmlFor="Selectrole">Танилцуулга</label>
                    <textarea className={`form-control ${about.bodytext ? "" : " is-invalid"}`} rows={8} placeholder="Танилцуулга" name="bodytext" defaultValue={about.bodytext} onChange={handleType} />
                    </div>
                  </div>

                  <div className="card-footer">
                    <button className={`btn btn-primary ${(about.title && about.bodytext) ? "" : " disabled"}`} disabled={!(about.title && about.bodytext)} style={{float:'right'}} onClick={createHandle}>Хадгалах</button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
