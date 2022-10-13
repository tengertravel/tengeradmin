import React, { useEffect,useState, useContext, Fragment, useRef } from 'react';
import { useNavigate, useParams }  from "react-router-dom";
import axios from '../Axios';
import Spinner from '../spinner';
import VacationContext from '../../context/VacationContext';
import DraggableList from '../drag/DraggableList';
import UserContext from '../../context/UserContext';
import AlertDialog from '../AlertDialog';
import ErrorCheck from '../ErrorCheck';

export default function FormVacation() {
  const vacationCtx = useContext(VacationContext);
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  let { id } = useParams();
  const vacationInachal = {
    loading:false,
    cCode: null,
    consultant: null,
    name: null,
    itinerary: null,
    guide:null,
    content: null,
    day: [],
    program: [],
    priceIncluded: [["Хөтөлбөрт заагдсан үзвэр, үйлчилгээний зардал","Хөтөлбөрт заагдсан хоолны зардал","Жуулчны автобусны үйлчилгээний зардал","Аяллын хөтчийн үйлчилгээний зардал","Гадаадад зорчигчийн иж бүрэн даатгалын хураамж"],["Аяллын үнэд багтсан зүйлс-ээс бусад зардал","Хувийн хэрэгцээний зардал"]],
    description:null,
    sequence:null,
    rating:null,
    touristicCount:null,
    error:null,
  }
  const [state, setState] = useState(vacationInachal);
  const [guide, setGuide] = useState([]);

  useEffect(()=>{
    if(id){
      setState({...vacationInachal,loading:true});
      axios.get("vacations/"+id).then((result)=>{
        const resultData = result.data.data;
        setState({...vacationInachal,
          loading:false,
          cCode:resultData.cCode,
          consultant:resultData.consultant,
          name:resultData.name,
          itinerary:resultData.itinerary,
          guide:resultData.guide && resultData.guide._id,
          content:resultData.content,
          day:resultData.day,
          program:resultData.program,
          priceIncluded:resultData.priceIncluded,
          description: resultData.description,
          sequence: resultData.sequence,
          rating:resultData.rating,
          touristicCount:resultData.touristicCount,
          error:null,
        });
        
      }).catch((err)=>{
        setState({...vacationInachal,error:ErrorCheck(err,"Алдаа гарлаа!!!")})
      });
      
    }else{
      vacationCtx.vacationState.consultantid && vacationCtx.vacationState.mcode && setState({...vacationInachal,cCode: vacationCtx.vacationState.mcode, consultant:vacationCtx.vacationState.consultantid})
    }
  },[id]);
  useEffect(()=>{
    axios.get(`users/guide`)
    .then((result)=>{
      setGuide(result.data.data);
    }).catch((err)=>{
      setState((stateBefore)=>({...stateBefore, loading:false,error:ErrorCheck(err,"Алдаа гарлаа!!!")}));
    });
  },[]);
  
  const dayfun = (day) =>{
    const dayarr = [];
    for(var i = 1; i <=day; i++) {
      var obj = {}; obj['value'] = i;
      dayarr.push(obj);
    }
    return dayarr;
  }
  const days = []; const nights = [];
  for(var i = 1; i <=20; i++) {
    var obj = {}; obj['value'] = i; obj['label'] = i+" Өдөр";
    days.push(obj);
    var nobj = {}; nobj['value'] = i; nobj['label'] = i+" Шөнө";
    nights.push(nobj);
  }
  const handleType = (e) =>{
    const {name, value} = e.target;
    setState((stateBefore)=>({...stateBefore, [name]:value, error:null}));
  }
  const handleDay = (e) =>{
    const {name, value} = e.target;
    if(name === 'day'){
      setState((stateBefore)=>({...stateBefore, day:[value, state.day[1]], error:null}));
    }else if(name === 'night'){
      setState((stateBefore)=>({...stateBefore, day:[state.day[0], value], error:null}));
    }
  }
  const handleProgram = () =>{
    const programDays =[];
    state.day[0] && dayfun(state.day[0]).map((option,index) => {
      let food = "";
      if(document.getElementById(`${index}customCheckbox1`).checked){food="1";}else{food="0";}
      if(document.getElementById(`${index}customCheckbox2`).checked){food=food+",1";}else{food=food+",0";}
      if(document.getElementById(`${index}customCheckbox3`).checked){food=food+",1";}else{food=food+",0";}
      programDays.push([document.getElementById(`itinerDay_${index}`).value,document.getElementById(`program_${index}`).value,food])
      return "";
    })
    setState((stateBefore)=>({...stateBefore, program:programDays, error:null}));
  }
  const piOne = useRef();
  const piTwo = useRef();
  const priceIncludClick = (c) =>{
    if(c === 1){
      let piOnevalue = [...state.priceIncluded[0]];
      if(piOne.current.value){piOnevalue.push(piOne.current.value); piOne.current.value=""; }
      setState((stateBefore)=>({...stateBefore, priceIncluded:[piOnevalue,state.priceIncluded[1]], error:null}));
    }else if(c === 2){
      let piTwovalue = [...state.priceIncluded[1]];
      if(piTwo.current.value){piTwovalue.push(piTwo.current.value); piTwo.current.value="";}
      setState((stateBefore)=>({...stateBefore, priceIncluded:[state.priceIncluded[0],piTwovalue], error:null}));
    }
  }

  const databaseValue = () =>{
    return{
      cCode:state.cCode,
      name:state.name,
      itinerary:state.itinerary,
      guide:state.guide,
      content:state.content,
      day:state.day,
      program:state.program,
      priceIncluded:state.priceIncluded,
      description:state.description,
      rating:state.rating,
      touristicCount:state.touristicCount,
    }
  }
  const saveHandle = () =>{
    setState((stateBefore)=>({...stateBefore, loading:true}));
    axios.put("vacations/"+id, databaseValue(),{
      headers:{Authorization:`Bearer ${userCtx.userState.token}`}
    }).then((result)=>{
      setState({...vacationInachal, loading:false});
      navigate("/vacations/"+vacationCtx.vacationState.consultantid)
    }).catch((err)=>{
      setState((stateBefore)=>({...stateBefore, loading:false,error:ErrorCheck(err,"Алдаа гарлаа!!!")}));
    })
  }
  const createdatabaseValue = () =>{
    return{
      cCode:state.cCode,
      consultant:state.consultant,
      name:state.name,
      itinerary:state.itinerary,
      itineraryId:"odoogoorbaihgui",
      content:state.content,
      day:state.day,
      program:state.program,
      priceIncluded:state.priceIncluded,
      description:state.description,
      backgroundImage:"",
      viewCount:1,
      rating:state.rating,
      touristicCount:state.touristicCount,
    }
  }
  const createHandle = () =>{
    setState((stateBefore)=>({...stateBefore, loading:true}));
    axios.post("vacations/", createdatabaseValue(),{
      headers:{Authorization:`Bearer ${userCtx.userState.token}`}
    }).then((result)=>{
      setState({...vacationInachal, loading:false});
      
      navigate("/vacations/"+vacationCtx.vacationState.consultantid)
    }).catch((err)=>{
      setState((stateBefore)=>({...stateBefore, loading:false,error:ErrorCheck(err,"Алдаа гарлаа!!!")}));
    })
  }
  const deleteHandle = () =>{
    if(vacationCtx.vacationState.mcode === state.cCode || userCtx.userState.role === 'admin'){
      setState((stateBefore)=>({...stateBefore, loading:true}));
      axios.delete('vacations/'+id,{
        headers:{Authorization:`Bearer ${userCtx.userState.token}`}
      }).then((result)=>{ 
        setState({...vacationInachal, loading:false}); navigate("/vacations/"+vacationCtx.vacationState.consultantid);
      }).catch((err)=>{
        setState({...vacationInachal, loading:false,error:ErrorCheck(err,"Алдаа гарлаа!!!")})
      })
    }else{setState((stateBefore)=>({...stateBefore, loading:false,error:"Таны эрх хүрэхгүй байна."}));}
  }
  const allowCheck = ()=>{
    if(state.name && state.day[0] && state.day[1] && state.itinerary && state.content){return false}else{return true}
  }
  const handleSequence = (e)=>{
    if(id){
      axios.put("vacations/"+id+"/sequence", {sNumber: e.target.value},{
        headers:{Authorization:`Bearer ${userCtx.userState.token}`}
      }).then((result)=>{
        navigate("/vacations/"+vacationCtx.vacationState.consultantid)
      }).catch((err)=>{
        setState((stateBefore)=>({...stateBefore, loading:false,error:ErrorCheck(err,"Алдаа гарлаа!!!")}));
      })
    }
  }

  return (
    <div className="col-lg-12">
    {state.loading ? <Spinner /> :
      <div className="card card-primary">
        <div className="card-header">
          <h3 className="card-title"><span style={{color:'red', marginRight:5}}>{state.error}{state.error && <br/>}</span>
            Аяллын мэдээллийг үнэн зөв, бүрэн бөглөнө үү.
          </h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-sm-6">
              <label htmlFor="Selectrole">Аяллын нэр</label>
              <input type="text" className={`form-control ${state.name ? "" : " is-invalid"}`} name="name" placeholder="Аяллын нэр" defaultValue={state.name} onChange={handleType}/>
            </div>
            <div className="col-sm-6">
              <label htmlFor="Selectcoin">Чиглэл</label>
              <input type="text" className={`form-control ${state.itinerary ? "" : " is-invalid"}`} name="itinerary" placeholder="Чиглэл" defaultValue={state.itinerary} onChange={handleType}/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2">
              <label htmlFor="Selectrole">Дараалал</label>
              <select className={`form-control`} defaultValue={state.sequence} onChange={handleSequence}>
                <option value="">Сонгох</option>
                <option value="1">1</option><option value="2">2</option><option value="3">3</option>
                <option value="4">4</option><option value="5">5</option><option value="6">6</option>
               </select>
            </div>
            <div className="col-sm-2">
              <label htmlFor="Selectrole">Үнэлгээ</label>
              <select className={`form-control`} defaultValue={state.rating} name="rating" onChange={handleType}>
                <option value="">Сонгох</option>
                <option value="0.5">0.5</option><option value="1">1</option><option value="1.5">1.5</option>
                <option value="2">2</option><option value="2.5">2.5</option><option value="3">3</option>
                <option value="3.5">3.5</option><option value="4">4</option><option value="4.5">4.5</option>
                <option value="5">5</option>
               </select>
            </div>
            <div className="col-sm-2">
              <label htmlFor="Selectrole">Аялсан</label>
              <input type="number" className="form-control" name="touristicCount" defaultValue={state.touristicCount} onChange={handleType}/>
            </div>
            <div className="col-sm-2">
              <label htmlFor="Selectrole">Өдөр {state.day[0]}</label>
              <select className={`form-control ${state.day[0] ? "" : " is-invalid"}`} 
                id="roleSelectss" name="day" defaultValue={state.day[0]} onChange={handleDay}
              >
              <option value="">Сонгох</option>
              {days.map((option,index) => (
                <option value={option.value} key={index}>{option.label}</option>
              ))}
              </select>
            </div>
            <div className="col-sm-2">
              <label htmlFor="Selectrole">Шөнө {state.day[1]}</label>
              <select className={`form-control ${state.day[1] ? "" : " is-invalid"}`} id="roleSelectss" name="night" defaultValue={state.day[1]} onChange={handleDay}>
              <option value="">Сонгох</option>
              {nights.map((option,index) => (
                <option value={option.value} key={index}>{option.label}</option>
              ))}
              </select>
            </div>
            <div className="col-sm-2">
              <label htmlFor="Selectcoin">Хөтөч</label>
              <select className={`form-control`} name="guide" value={state.guide ? state.guide : ""} onChange={handleType}>
                <option value="">Сонгох</option>
                {guide.map((option,index) => (
                  <option value={option._id} key={index}>{option.firstName}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <label htmlFor="Selectrole">Аяллын онцлог</label>
              <textarea className={`form-control ${state.content ? "" : " is-invalid"}`} rows={3} placeholder="Аяллын онцлог" name="content" defaultValue={state.content} onChange={handleType} />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card" style={{marginTop:"5px"}}>
                <div className="card-header d-flex p-0">
                  <label htmlFor="Selectrole">Аяллын хөтөлбөр</label>
                  <ul className="nav nav-pills ml-auto p-2">
                  {state.day[0] && dayfun(state.day[0]).map((option,index) => (
                    <Fragment key={index}>
                    <li className="nav-item">
                      <a className={`nav-link ${option.value === 1 && 'active'}`} href={`#tab_${option.value}`} data-toggle="tab">{option.value}-р өдөр</a>
                    </li>
                    </Fragment>
                  ))}
                  </ul>
                </div>
                <div className="card-body">
                  <div className="tab-content">
                  {state.day[0] && dayfun(state.day[0]).map((option,index) => (
                    <div key={index} className={`tab-pane ${option.value === 1 && 'active'}`} id={`tab_${option.value}`}>
                      <div style={{display:'flex', flexDirection:'row'}}>
                        <input type="text" 
                          className="form-control col-sm-6" 
                          style={{marginRight:10,marginBottom:10}} 
                          id={`itinerDay_${index}`} name={`itinerDay_${index}`} 
                          defaultValue={state.program[index] && state.program[index][0]}
                          placeholder={`${option.value}-р өдрийн чиглэл`}
                          onChange={handleProgram}
                        />
                      <div className="custom-control custom-checkbox">
                        <input className="custom-control-input" type="checkbox" 
                          id={`${index}customCheckbox1`} name={`dayFoodOne_${index}`}
                          checked={state.program[index] && state.program[index][2].split(',')[0] === "1" ? true : false}
                          onChange={handleProgram}
                        />
                        <label htmlFor={`${index}customCheckbox1`} className="custom-control-label">Өглөөний цай</label>
                      </div>
                      <div className="custom-control custom-checkbox" style={{marginLeft:30}}>
                        <input className="custom-control-input" type="checkbox" 
                          id={`${index}customCheckbox2`} name={`dayFoodTwo_${index}`}
                          checked={state.program[index] && state.program[index][2].split(',')[1] === "1" ? true : false}
                          onChange={handleProgram}
                        />
                        <label htmlFor={`${index}customCheckbox2`} className="custom-control-label">Өдрийн хоол</label>
                      </div>
                      <div className="custom-control custom-checkbox" style={{marginLeft:30}}>
                        <input className="custom-control-input" type="checkbox" 
                          id={`${index}customCheckbox3`} name={`dayFoodThree_${index}`} 
                          checked={state.program[index] && state.program[index][2].split(',')[2] === "1" ? true : false}
                          onChange={handleProgram}
                        />
                        <label htmlFor={`${index}customCheckbox3`} className="custom-control-label">Оройн хоол</label>
                      </div>
                      </div>
                      <textarea className="form-control" rows={8} placeholder={`${option.value}-р өдөр`} 
                      id={`program_${index}`} 
                      defaultValue={state.program[index] && state.program[index][1]} onChange={handleProgram}
                      />
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <label htmlFor="Selectrole">Аяллын үнэд багтсан зүйлс</label>
              <div className="input-group input-group-sm">
                <input ref={piOne} type="text" className="form-control" />
                <span className="input-group-append">
                  <button type="button" className="btn btn-info btn-flat" onClick={()=>priceIncludClick(1)}>Нэмэх</button>
                </span>
              </div>
              <DraggableList data={state.priceIncluded[0]} priceIncluded={setState} vacationState={(1,state)} priceIncludedCate={1}/>
            </div>
            <div className="col-sm-6">
              <label htmlFor="Selectrole">Аяллын үнэд багтаагүй зүйлс</label>
              <div className="input-group input-group-sm">
                <input ref={piTwo} type="text" className="form-control" />
                <span className="input-group-append">
                  <button type="button" className="btn btn-info btn-flat" onClick={()=>priceIncludClick(2)}>Нэмэх</button>
                </span>
              </div>
              <DraggableList data={state.priceIncluded[1]} priceIncluded={setState} vacationState={(1,state)} priceIncludedCate={2}/>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <label htmlFor="Selectrole">Тайлбар</label>
              <textarea className={`form-control ${state.description ? "" : " is-invalid"}`} rows={3} placeholder="Тайлбар" name="description" defaultValue={state.description} onChange={handleType} />
            </div>
          </div>
        </div>
        <div className="card-footer">
        {state.cCode &&
          id ? 
            vacationCtx.vacationState.mcode === state.cCode || userCtx.userState.role === 'admin' ?
            <>
              <button className={`btn btn-primary ${allowCheck() ? " disabled" : ""}`} disabled={allowCheck()} style={{float:'right'}} onClick={saveHandle}>Засах</button>
              <AlertDialog btValue="Устгах" title="Аялал" yesFunction={deleteHandle}/>
            </>
            :null
          : 
          userCtx.userState.role === 'admin' || userCtx.userState.role === 'consultant' ?
            <button className={`btn btn-primary ${allowCheck() ? " disabled" : ""}`} disabled={allowCheck()} style={{float:'right'}} onClick={createHandle}>Нэмэх</button>
          :null
        }
        </div>
      </div>
    }
    </div>
  )
}
