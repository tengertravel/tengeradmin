import React, { useEffect,useState,useRef, useContext } from 'react';
import axios from '../Axios';
import Spinner from '../spinner';
import UserContext from '../../context/UserContext';
import AlertDialog from '../AlertDialog';
import ErrorCheck from '../ErrorCheck';
import { useNavigate } from 'react-router-dom';
export default function FormUser(props) {
  const [hostImageUrl] = useState("https://tengerapi.com/photos/");
  const [onImage, setOnImage] = useState(null);
  const [vprofileprogress, setVprofileprogress] = useState(null);
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const userInachal = {
    userid:null,
    role:"",
    coin: 0,
    profileimage:null,
    lastname:"",
    firstname:"",
    cyrillicName:"",
    registernumber:["","",""],
    email:"",
    phone:"",
    gender:"",
    birthdate:"",
    passport:["","",""],
    address:["","","",""],
    error:null,
    loading:false
  }
  const [state, setState]= useState(userInachal);
  const [note, setNote]= useState("");
  const [empValueArr, setEmpValueArr]= useState(["","","",""]);

  const districtdiv = useRef();
  const khoroodiv = useRef();
  const sumdiv = useRef();

  useEffect(() => {
    if(props.userid){
      setState({...state, loading:true});
      axios.get('users/'+props.userid,{
        headers:{Authorization:`Bearer ${userCtx.userState.token}`}
      })
      .then((result) => {
        const UResult = result.data.data;
        let birthdate = ""+UResult.birthdate;
        birthdate = birthdate.substring(0, 10);
        if(birthdate === "null"){birthdate = "";}
        const registernumber = ""+UResult.registernumber;
        const passportend = ""+UResult.passportend;
        const passport = ""+UResult.passportnumber;
        setState({
          userid: UResult._id,
          role: UResult.role,
          coin: UResult.coin,
          profileimage: UResult.profileImage,
          lastname: UResult.lastName,
          firstname: UResult.firstName,
          cyrillicName: UResult.cyrillicName,
          registernumber: registernumber.substring(2) === "defined" ? ["","",""]: [registernumber.substring(0,1),registernumber.substring(1,2),registernumber.substring(2)],
          email: UResult.email,
          phone: UResult.phone,
          gender: UResult.gender,
          birthdate: birthdate,
          passport: [passport.substring(0, 1),passport.substring(1),passportend.substring(0, 10)],
          address: UResult.address,
          error: null,
          loading: false
        });
        if(UResult.role === "consultant"){setNote(UResult.note)}
        if(UResult.role === "guide" || UResult.role === "consultant"){setEmpValueArr([...UResult.employeeValue])}
      })
      .catch((err) => {
        let errMessage="Алдаа.";
      if(err.response.data.error){errMessage = err.response.data.error.message;}
        setState({...userInachal, loading:false,error:errMessage})
      });
    }
  },[props.userid]);
  const [ser] = useState(['А','Б','В','Г','Д','Е','Ё','Ж','З','И','Й','К','Л','М','Н','О','Ө','П','Р','С','Т','У','Ү','Ф','Х','Ц','Ч','Ш','Щ','Ъ','Ы','Ь','Э','Ю','Я']);
  const [aimagsum,setAimagsum] = useState([]);
  const address = {
    ulaanbaatar:['Хан-Уул','Сүхбаатар','Сонгинохайрхан','Баянзүрх','Баянгол','Чингэлтэй','Налайх','Багануур','Багахангай'],
    arkhangai:['Батцэнгэл','Булган','Жаргалант','Ихтамир','Тариат','Төвшрүүлэх','Хайрхан','Хангай',' Хашаат','Хотонт','Цахир','Цэнхэр','Цэцэрлэг','Чулуут','Эрдэнэбулган','Эрдэнэмандал','Өгийнуур','Өлзийт','Өндөр-Улаан'],
    baynulgii:['Алтай сум','Алтанцөгц сум','Баяннуур','Бугат','Булган','Буянт','Дэлүүн','Ногооннуур','Сагсай','Цагааннуур','Толбо сум','Улаанхус','Цэнгэл','Өлгий сум'],
    baynkhongor:['Баацагаан','Баян-Овоо','Баян-Өндөр','Баянбулаг','Баянговь','Баянлиг','Баянхонгор','Баянцагаан','Богд','Бууцагаан','Бөмбөгөр','Галуут','Гурванбулаг','Жаргалант','Жинст','Заг','Хүрээмарал','Шинэжинст','Эрдэнэцогт','Өлзийт'],
    bulgan:['Баян-Агт','Баяннуур','Бугат','Булган','Бүрэгхангай','Гурванбулаг','Дашинчилэн','Могод','Орхон','Рашаант','Сайхан','Сэлэнгэ','Тэшиг','Хангал','Хишиг-Өндөр','Хутаг-Өндөр'],
    gobialtai:['Алтай','Баян-Уул','Бигэр','Бугат','Дарви','Дэлгэр','Есөнбулаг','Жаргалан','Тайшир','Тонхил','Төгрөг','Халиун','Хөхморьт','Цогт','Цээл','Чандмань','Шарга','Эрдэнэ'],
    gobisumber:['Сүмбэр сум','Баянтал','Шивээговь'],
    darhan:['Дархан','Хонгор','Орхон','Шарынгол'],
    dornogobi:['Сайншанд','Алтанширээ','Даланжаргалан','Дэлгэрэх','Замын-Үүд','Иххэт','Мандах','Өргөн','Сайхандулаан','Улаанбадрах','Хатанбулаг','Хөвсгөл','Эрдэнэ','Айраг'],
    dornod:['Баяндун','Баянтүмэн','Баян-Уул','Булган','Гурванзагал','Дашбалбар','Матад','Сэргэлэн','Халхгол','Хөлөнбуйр','Хэрлэн','Цагаан-Овоо','Чойбалсан','Чулуунхороот'],
    dundgobi:['Адаацаг','Баянжаргалан','Говь-Угтаал','Гурвансайхан','Дэлгэрхангай','Дэлгэрцогт','Дэрэн','Луус','Өлзийт','Өндөршил','Сайхан-Овоо','Сайнцагаан','Хулд сум','Цагаандэлгэр','Эрдэнэдалай'],
    zavkhan:['Алдархаан','Асгат','Баянтэс','Баянхайрхан','Дөрвөлжин','Завханмандал','Идэр','Их-Уул',' Нөмрөг','Отгон','Сантмаргац','Сонгино','Тосонцэнгэл','Түдэвтэй','Тэлмэн','Тэс','Улиастай','Ургамал','Цагаанхайрхан','Цагаанчулуут','Цэцэн-Уул','Шилүүстэй','Эрдэнэхайрхан','Яруу'],
    orkhon:['Баян-Өндөр','Жаргалант'],
    selenge:['Алтанбулаг','Баруунбүрэн','Баянгол','Ерөө','Жавхлант','Зүүнбүрэн','Мандал','Орхон','Орхонтуул','Сант','Сайхан','Сүхбаатар','Түшиг','Хүдэр','Хушаат','Цагааннуур','Шаамар'],
    sukhbaatar:['Асгат','Баруун-Урт','Баяндэлгэр','Дарьганга','Мөнххаан','Наран','Онгон','Сүхбаатар','Түвшинширээ','Түмэнцогт','Уулбаян','Халзан','Эрдэнэцагаан'],
    tuv:['Алтанбулаг','Аргалант','Архуст','Батсүмбэр','Баян','Баяндэлгэр','Баянжаргалан','Баян-Өнжүүл','Баянхангай','Баянцагаан','Баянцогт','Баянчандмань','Борнуур','Бүрэн','Дэлгэрхаан','Жаргалант','Заамар','Зуунмод','Лүн','Мөнгөнморьт','Өндөрширээт','Сүмбэр','Сэргэлэн','Угтаалцайдам','Цээл','Эрдэнэ','Эрдэнэсант'],
    uvs:['Баруунтуруун','Бөхмөрөн','Давст','Завхан','Зүүнговь','Зүүнхангай','Малчин','Наранбулаг','Өлгий','Өмнөговь','Өндөрхангай','Сагил','Тариалан','Тэс','Түргэн','Улаангом','Ховд','Хяргас','Цагаанхайрхан'],
    khovd:['Алтай','Булган','Буянт','Дарви','Дөргөн','Дуут','Жаргалант','Зэрэг','Манхан','Мөнххайрхан','Мөст','Мянгад','Үенч','Ховд','Чандмань','Цэцэг','Эрдэнэбүрэн'],
    khentii:['Батноров','Батширээт','Баян-Адрага','Баянхутаг','Баянмөнх','Баян-Овоо','Биндэр','Дадал','Дархан','Дэлгэрхаан','Галшар','Жаргалтхаан','Хэрлэн','Мөрөн','Норовлин','Өмнөдэлгэр','Цэнхэрмандал','Бор-Өндөр'],
    khuvsgul:['Алаг-Эрдэнэ','Арбулаг','Баянзүрх','Бүрэнтогтох','Галт','Жаргалант','Их-Уул','Мөрөн','Рашаант','Рэнчинлхүмбэ','Тариалан','Тосонцэнгэл','Төмөрбулаг','Түнэл','Улаан-Уул','Ханх','Хатгал','Цагааннуур','Цагаан-Уул','Цагаан-Үүр','Цэцэрлэг','Чандмань-Өндөр','Шинэ-Идэр','Эрдэнэбулган'],
    uvurkhangai:['Арвайхээр','Баруунбаян-Улаан','Бат-Өлзий','Баян-Өндөр','Баянгол','Богд','Бүрд','Гучин-Ус','Есөнзүйл','Зүүнбаян-Улаан','Нарийнтээл','Өлзийт','Сант','Тарагт','Төгрөг','Уянга','Хайрхандулаан','Хархорин','Хужирт'],
    umnugobi:['Баяндалай','Баян-Овоо','Булган','Гурвантэс','Даланзадгад','Мандал-Овоо','Манлай','Ноён','Номгон','Сэврэй','Ханбогд','Ханхонгор','Хүрмэн','Цогт-Овоо','Цогтцэций'],
  }
  const city = [
    {label:'Архангай',value:'arkhangai'},{label:'Баян-Өлгий',value:'baynulgii'},{label:'Баянхонгор',value:'baynkhongor'},
    {label:'Булган',value:'bulgan'},{label:'Говь-Алтай',value:'gobialtai'},{label:'Говьсүмбэр',value:'gobisumber'},
    {label:'Дархан-Уул',value:'darhan'},{label:'Дорноговь',value:'dornogobi'},{label:'Дорнод',value:'dornod'},
    {label:'Дундговь',value:'dundgobi'},{label:'Завхан',value:'zavkhan'},{label:'Орхон',value:'orkhon'},
    {label:'Сэлэнгэ',value:'selenge'},{label:'Сүхбаатар',value:'sukhbaatar'},{label:'Төв',value:'tuv'},
    {label:'Увс',value:'uvs'},{label:'Ховд',value:'khovd'},{label:'Хэнтий',value:'khentii'},
    {label:'Хөвсгөл',value:'khuvsgul'},{label:'Өвөрхангай',value:'uvurkhangai'},{label:'Өмнөговь',value:'umnugobi'}
  ];

  const district = ['Хан-Уул','Сүхбаатар','Сонгинохайрхан','Баянзүрх','Баянгол','Чингэлтэй','Налайх','Багануур','Багахангай'];
  const horoo = [];
  for(var i = 1; i <=50; i++) {
    var obj = {}; obj['value'] = i+"-р хороо"; obj['label'] = i+"-р хороо";
    horoo.push(obj);
  }
  const citychange = (e)=>{
    const {name, value} = e.target;
    districtdiv.current.value=""; khoroodiv.current.value=""; sumdiv.current.value="";
    if(name==="addresscity"&&value==="Улаанбаатар"){
      districtdiv.current.style.display=""; khoroodiv.current.style.display=""; sumdiv.current.style.display="none"; 
      setAimagsum([]);
    }else{
      districtdiv.current.style.display="none"; khoroodiv.current.style.display="none";  sumdiv.current.style.display="";
      const aimagsumar=[]; address[value].map((option) => aimagsumar.push(option))
      setAimagsum(aimagsumar);
    }
    setState({...state, address:[value,state.address[1],state.address[2],state.address[3]], error:null,success:null});
  }
  const addresschange = (e) =>{
    const {name, value} = e.target; let selectedaddress=[];
    if(name==="addressdistrict"){ selectedaddress=[state.address[0],value,state.address[2],state.address[3]] }
    else if(name==="addresskhoroo"){ selectedaddress=[state.address[0],state.address[1],value,state.address[3]] }
    else if(name==="addresssum"){ selectedaddress=[state.address[0],value,state.address[2],state.address[3]] }
    else if(name==="addresstext"){ selectedaddress=[state.address[0],state.address[1],state.address[2],value] }
    setState({...state, address:selectedaddress, error:null,success:null});
  }
  const handleType = (e) =>{
    const {name, value} = e.target;
    if(name==='passportser'){ 
      setState((stateBefore)=>({...stateBefore, passport:[value,state.passport[1],state.passport[2]], error:null})); 
    }else if(name==='passportnumber'){ 
      setState((stateBefore)=>({...stateBefore, passport:[state.passport[0],value,state.passport[2]], error:null})); 
    }else if(name==='passportend'){ 
      setState((stateBefore)=>({...stateBefore, passport:[state.passport[0],state.passport[1],value], error:null})); 
    }else if(name==='serOne'){ 
      setState((stateBefore)=>({...stateBefore, registernumber:[value,state.registernumber[1],state.registernumber[2]], error:null})); 
    }else if(name==='serTwo'){ 
      setState((stateBefore)=>({...stateBefore, registernumber:[state.registernumber[0],value,state.registernumber[2]], error:null})); 
    }else if(name==='registernumber'){ 
      setState((stateBefore)=>({...stateBefore, registernumber:[state.registernumber[0],state.registernumber[1],value], error:null})); 
    }else{ setState((stateBefore)=>({...stateBefore, [name]:value, error:null,success:null})); }
  }
  const databaseValue = ()=>{
    const ppdate = new Date(state.passport[2]); let passportDate = ppdate.toDateString();
    if(passportDate==='Invalid Date'){ passportDate = null; }
    return {
      role: state.role,
      coin: state.coin,
      lastName: state.lastname,
      firstName: state.firstname,
      cyrillicName: state.cyrillicName,
      registernumber: state.registernumber[0]+state.registernumber[1]+state.registernumber[2],
      email: state.email,
      phone: state.phone,
      gender: state.gender,
      birthdate: state.birthdate,
      passportnumber: state.passport[0]+state.passport[1],
      passportend: passportDate,
      address: [state.address[0],state.address[1],state.address[2],state.address[3]],
      note: note,
      employeeValue: empValueArr
    }
  }
  const saveHandle = () =>{
    if(props.userid){
      setState((stateBefore)=>({...stateBefore, loading:true}));
      axios.put('users/'+props.userid, databaseValue(),{
        headers:{Authorization:`Bearer ${userCtx.userState.token}`}
      }).then((result)=>{ 
        setState({...userInachal, loading:false});
        props.setFormAc ? props.setFormAc({uId:null,activ:false}) : navigate('/')
      })
      .catch((err)=>{
        setState((stateBefore)=>({...stateBefore, loading:false,error:ErrorCheck(err,"Алдаа гарлаа!!!")}))
      })
    }
  }
  const createHandle = () =>{
    setState((stateBefore)=>({...stateBefore, loading:true}));
    axios.post('users/register', databaseValue(),{
      headers:{Authorization:`Bearer ${userCtx.userState.token}`}
    }).then((result)=>{ 
      setState({...userInachal, loading:false}); 
      props.setFormAc ? props.setFormAc({uId:null,activ:false}) : navigate('/')
    })
    .catch((err)=>{
      setState((stateBefore)=>({...stateBefore, loading:false,error:ErrorCheck(err,"Алдаа гарлаа!!!")}))
    })
  }
  const deleteHandle = () =>{
    if(props.userid){
      if(userCtx.userState.role === 'admin'){
        setState((stateBefore)=>({...stateBefore, loading:true}));
        axios.delete('users/'+props.userid,{
          headers:{Authorization:`Bearer ${userCtx.userState.token}`}
        }).then((result)=>{ 
          setState({...userInachal, loading:false}); 
          props.setFormAc ? props.setFormAc({uId:null,activ:false}) : navigate('/')
        })
        .catch((err)=>{
          setState((stateBefore)=>({...stateBefore, loading:false,error:ErrorCheck(err,"Алдаа гарлаа!!!")}))
        })
      }else{setState((stateBefore)=>({...stateBefore, error:"Энэ үйлдлийг хийхэд таны эрх хүрэхгүй байна."}))}
    }
  }
  
  const handleEmpValue = (e)=>{
    if(e.target.name === "workingDate"){setEmpValueArr([e.target.value,empValueArr[1],empValueArr[2],empValueArr[3]])}
    if(e.target.name === "emplanguage"){setEmpValueArr([empValueArr[0],e.target.value,empValueArr[2],empValueArr[3]])}
    if(e.target.name === "touristicCount"){setEmpValueArr([empValueArr[0],empValueArr[1],e.target.value,empValueArr[3]])}
    if(e.target.name === "empStar"){setEmpValueArr([empValueArr[0],empValueArr[1],empValueArr[2],e.target.value])}
  }
  const onSelectImage = (e)=>{
    let imagesArray = "";
    if(e.target.files){
      const selectedFiles = e.target.files;
      const selectedFilesArray = Array.from(selectedFiles);
      if(selectedFilesArray[0].size < 3000000){imagesArray=URL.createObjectURL(selectedFilesArray[0]);}
    }
    if(imagesArray){setOnImage(imagesArray)}else{setOnImage(null)}
  }
  const imageRef = useRef();
  const saveProfileImage = ()=>{
    if(imageRef.current && imageRef.current.files[0]){
      const photo = imageRef.current.files[0];
      const fd = new FormData();
      fd.append('file', photo, photo.name);
      if(state.userid){
        axios({url:"users/"+state.userid+"/profileImage", method:'PUT', data: fd, headers:{
          Authorization:`Bearer ${userCtx.userState.token}`}
          ,onUploadProgress: progressEvent =>{
            let percentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
            setVprofileprogress(percentage);
          }
        }).then((result)=>{
          setVprofileprogress(null);
        }).catch((err)=>{
          setVprofileprogress(null);
        })
      }
    }
  }
  return (
  <div className="col-lg-8">
    {state.loading ? <Spinner /> :
    <div className="card card-primary">
      <div className="card-header">
        <h3 className="card-title"><span style={{color:'red', marginRight:5}}>{state.error}</span> Үнэн зөв, бүрэн бөглөнө үү.</h3>
      </div>
      <div className="card-body">
        {vprofileprogress > 0 ?
            <>
              <div className="col-sm-5">
                <div className="progress">
                  <div className="progress-bar bg-primary progress-bar-striped"  
                    role="progressbar" style={{width: `${vprofileprogress}%`}}
                  />
                </div>
              </div>
              <div className="col-sm-1"><div style={{marginTop:-5, textAlign:'left'}}>{vprofileprogress}%</div></div>
            </>
          :
          <div className="row">
            <div className="col-sm-2">
              {onImage ?
                <img src={`${onImage}`} alt="" style={{width:'100%'}}/>
              :state.profileimage 
                ?<img src={`${hostImageUrl}profileImage/${state.profileimage}`} alt="" style={{width:'100%', height:'100%'}}/>
                :<img src={hostImageUrl+"no-image.png"} alt="" style={{width:'100%'}}/>
              }
            </div>
            <div className="col-sm-8">
              <section>
                <label 
                  style={{ 
                    display:'flex',justifyContent:'center',alignItems:'center',
                    border:'1px dotted black',borderRadius:'5px',cursor:'pointer',height:'40px'
                  }}
                >Select profile image 3MB!
                  <input type="file" ref={imageRef} name="profileimage" style={{display:'none'}} 
                    onChange={onSelectImage} accept='image/jpg, image/jpeg, image/png'
                  />
                </label>
              </section>
            </div>
            <div className="col-sm-2">
              <button className="btn btn-primary" style={{width:'100%'}} onClick={saveProfileImage}>Хадгалах</button>
            </div>
          </div>
        }
        <hr/>
        <div className="row">
          <div className="col-sm-6">
          <label htmlFor="Selectrole">Role</label>
            <select className="form-control" id="roleSelectss" name="role" disabled={state.role === 'admin' && true} defaultValue={state.role} onChange={handleType}>
              <option value="">Select</option>
              {state.role === 'admin' && <option value="admin">Admin</option>}
              {props.roles === 'admin' && <><option value="operator">Operator</option><option value="consultant">Consultant</option><option value="manager">Manager</option></>}
              {props.roles === 'guide' && <><option value="guide">Guide</option></>}
              {props.roles === 'user' && <><option value="user">User</option><option value="blog">blog</option></>}
            </select>
          </div>
          <div className="col-sm-3">
            <label htmlFor="Selectcoin">Coin</label>
            <input type="number" className="form-control" name="coin" placeholder="Coin" defaultValue={state.coin} onChange={handleType}/>
          </div>
          <div className="col-sm-3">
            <label htmlFor="Selectcoin">Cyrillic Name</label>
            <input type="text" className="form-control" name="cyrillicName" placeholder="Cyrillic Name" defaultValue={state.cyrillicName} onChange={handleType}/>
          </div>
        </div>
        {state.role === "consultant" && 
          <div className="row">
            <div className="col-sm-12">
              <label htmlFor="Inputemail">Note</label>
              <textarea className="form-control" rows={3} placeholder="Max length 120" name="note" defaultValue={note} maxLength={120} onChange={(e)=>{setNote(e.target.value)}}/>
            </div>
          </div>
        }
        {(state.role === "guide" || state.role === "consultant") && 
          <div className="row">
            <div className="col-sm-3">
              <label htmlFor="Inputemail">Working date</label>
              <input type="number" className="form-control" name="workingDate" placeholder="Year" defaultValue={empValueArr[0]} onChange={handleEmpValue}/>
            </div>
            <div className="col-sm-3">
              <label htmlFor="Inputemail">Language</label>
              <input type="text" className="form-control" name="emplanguage" placeholder="Англи" defaultValue={empValueArr[1]} onChange={handleEmpValue}/>
            </div>
            <div className="col-sm-3">
              <label htmlFor="Inputemail">Touristic count</label>
              <input type="number" className="form-control" name="touristicCount" placeholder="2000" defaultValue={empValueArr[2]} onChange={handleEmpValue}/>
            </div>
            <div className="col-sm-3">
              <label htmlFor="Inputemail">Star</label>
              <input type="text" className="form-control" name="empStar" placeholder="4.5" defaultValue={empValueArr[3]} onChange={handleEmpValue}/>
            </div>
          </div>
        }
        <div className="row">
          <div className="col-sm-3">
            <label htmlFor="Inputlastname">Last Name</label>
            <input type="text" className="form-control" name="lastname" placeholder="Last Name" defaultValue={state.lastname} onChange={handleType}/>
          </div>
          <div className="col-sm-3">
            <label htmlFor="Inputfirstname">First Name</label>
            <input type="text" className="form-control" name="firstname" placeholder="First Name" defaultValue={state.firstname} onChange={handleType}/>
          </div>
          <div className="col-sm-1">
            <label htmlFor="InputSerOne">Ser-1</label>
            <select className="form-control" name="serOne" defaultValue={state.registernumber[0]} onChange={handleType}><option value="">Select</option>
            {ser.map((option,index) => (
                <option value={option} key={index}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-sm-1">
            <label htmlFor="InputSerTwo">Ser-2</label>
            <select className="form-control" name="serTwo" defaultValue={state.registernumber[1]} onChange={handleType}><option value="">Select</option>
            {ser.map((option,index) => (
                <option value={option} key={index}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-sm-4">
            <label htmlFor="registernumber">Register Number</label>
            <input type="text" className="form-control" name="registernumber" placeholder="Register Number" defaultValue={state.registernumber[2]} onChange={handleType}/>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <label htmlFor="Inputemail">Email</label>
            <input type="email" className="form-control" name="email" placeholder="Email" defaultValue={state.email} onChange={handleType}/>
          </div>
          <div className="col-sm-6">
            <label htmlFor="Inputphone">Phone number</label>
            <input type="phone" className="form-control" name="phone" placeholder="Phone number" defaultValue={state.phone} onChange={handleType}/>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <label htmlFor="Selectgender">Gender</label>
            <select className="form-control" name="gender" defaultValue={state.gender} onChange={handleType}>
              <option value="">Select</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div className="col-sm-6">{state.birthdate}
            <label htmlFor="Inputbirthdate">Birthdate</label>
            <input type="date" className="form-control" name="birthdate" placeholder="Birthdate" defaultValue={state.birthdate} onChange={handleType}/>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-2">
            <label htmlFor="Selectser">Ser</label>
            <select className="form-control" name="passportser" defaultValue={state.passport[0]} onChange={handleType}>
              <option value="E">E</option>
              <option value="A">A</option>
              <option value="D">D</option>
              <option value="G">G</option>
              <option value="EC">EC</option>
              <option value="">NULL</option>
            </select>
          </div>
          <div className="col-sm-4">
            <label htmlFor="Inputpassportnumber">Passport number</label>
            <input type="number" className="form-control" name="passportnumber" placeholder="Passport number" defaultValue={state.passport[1]} onChange={handleType}/>
          </div>
          <div className="col-sm-6">
            <label htmlFor="Inputpassportend">Passport end</label>
            <input type="date" className="form-control" name="passportend" placeholder="Phone end" defaultValue={state.passport[2]} onChange={handleType}/>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-2">
            <label htmlFor="Selectcity">City</label>
            <select className="form-control" name="addresscity" onChange={citychange} defaultValue={state.address[0]}>
            <option value="Улаанбаатар">Улаанбаатар</option>
              {city.map((option,index) => (
                <option value={option.value} key={index}>{option.label}</option>
              ))}
            </select>
          </div>
          <div ref={districtdiv} className="col-sm-2">
            <label htmlFor="Selectdistrict">District</label>
            <select className="form-control" id="Selectdistrict" name="addressdistrict" onChange={addresschange} defaultValue={state.address[1]}>
              <option value="">Select</option>
              {district.map((option,index) => (
                <option value={option} key={index}>{option}</option>
              ))}
            </select>
          </div>
          <div ref={khoroodiv} className="col-sm-2">
            <label htmlFor="Selectkhoroo">Khoroo</label>
            <select className="form-control" id="Selectkhoroo" name="addresskhoroo" onChange={addresschange} defaultValue={state.address[2]}>
              <option value="">Select</option>
              {horoo.map((option,index) => (
                <option value={option.value} key={index}>{option.label}</option>
              ))}
            </select>
          </div>
          <div ref={sumdiv} className="col-sm-4" style={{display:'none'}}>
            <label htmlFor="Inputsum">Sum</label>
            <select className="form-control" id="Selectsum" name="addresssum" onChange={addresschange} defaultValue={state.address[1]}>
              <option value="">Select</option>
              {aimagsum.map((option,index) => (
                <option value={option} key={index}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-sm-6">
            <label htmlFor="Inputaddress">Address</label>
            <input type="text" className="form-control" name="addresstext" placeholder="Address" onChange={addresschange} defaultValue={state.address[3]}/>
          </div>
        </div>
      </div>
        {/* /.card-body */}
      <div className="card-footer">
        {props.userid ? 
          <><button className="btn btn-primary" style={{float:'right'}} onClick={saveHandle}>Засах</button>
          {state.role === 'admin' ? null :
            <AlertDialog btValue="Устгах" title="Хэрэглэгч" yesFunction={deleteHandle}/>
          }
          </>:
          <button className="btn btn-primary" style={{float:'right'}} onClick={createHandle}>Нэмэх</button>
        }
      </div>
    </div>
    }
  </div>
  )
}
