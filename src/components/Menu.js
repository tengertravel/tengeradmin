import React, { useContext, useEffect, useState } from 'react'
import { Link }  from "react-router-dom";
import UserContext from '../context/UserContext';
import axios from './Axios';
import ErrorCheck from './ErrorCheck';
export default function Menu() {
  const userCtx = useContext(UserContext);
  const initialState = { loading: false, data:[], error: null, }
  const [consultants, setConsultants] = useState(initialState);
  const [countUser, setCountUser] = useState([0,0,0]);
  useEffect(()=>{
    axios.get('consultants?sort=code').then((result)=>{
      setConsultants({loading: true, data:result.data.data, error: null, })
    }).catch((err)=>{
      setConsultants({loading: true, data:[], error:ErrorCheck(err,"Алдаа гарлаа!!!")})
    });
  },[]);
  useEffect(()=>{
    axios.get('users/count',{
      headers:{Authorization:`Bearer ${userCtx.userState.token}`}
    }).then((result)=>{
      const rCount = result.data.count;
      setCountUser([rCount.admin+rCount.manager+rCount.consultant+rCount.operator,rCount.guide,rCount.users+rCount.blog]);
      // setCountUser([rCount.admin+rCount.manager+rCount.consultant,rCount.guide,rCount.users+rCount.blog]);
    }).catch((err)=>{ setCountUser([0,0,0]); });
  },[])

  return (
    <>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <Link to="/" className="brand-link">
        <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{opacity: '.8'}} />
        <span className="brand-text font-weight-light">Tenger travel</span>
      </Link>
      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar user panel (optional) */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="info">
            <Link to="profile" className="d-block">{userCtx.userState.firstName}</Link>
          </div>
        </div>
        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            {/* Add icons to the links using the .nav-icon class
            with font-awesome or any other icon font library */}
            <li className="nav-item menu-open">
              <Link to="/" className="nav-link active">
                <i className="nav-icon fas fa-tachometer-alt" />
                <p>Нүүр<i className="right fas fa-angle-left" /></p>
              </Link>
              <ul className="nav nav-treeview">
                <li className="nav-item">
                  <Link to="wepapp" className="nav-link active">
                    <i className="far fa-circle nav-icon" />
                    <p>Вэб сайт</p>
                  </Link>
                </li>
                <li className="nav-item">
                    <Link to="mobileapp" className="nav-link">
                      <i className="far fa-circle nav-icon"></i>
                      <p>Мобайл апп</p>
                    </Link>
                  </li>
              </ul>
            </li>
            {userCtx.userState.role === 'admin' &&
              <>
                <li className="nav-header">Хэрэглэгч</li>
                <li className="nav-item">
                  <Link to="admin" className="nav-link">
                    <i className="nav-icon fas fa-user-alt" />
                    <p>Админ<span className="badge badge-info right">{countUser[0]}</span></p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="meneger" className="nav-link">
                    <i className="nav-icon fas fa-user-alt" />
                    <p>Менежер<span className="badge badge-info right">{consultants.data.length}</span></p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="guide" className="nav-link">
                    <i className="nav-icon fas fa-user-alt" />
                    <p>Хөтөч<span className="badge badge-info right">{countUser[1]}</span></p>
                  </Link>
                </li>
              </>
            }
            {userCtx.userState.role === 'admin' | userCtx.userState.role === 'consultant' | userCtx.userState.role === 'operator' | userCtx.userState.role === 'manager' &&
              <>
                <li className="nav-item">
                  <Link to="users" className="nav-link">
                    <i className="nav-icon fas fa-users" />
                    <p>Хэрэглэгч<span className="badge badge-info right">{countUser[2]}</span></p>
                  </Link>
                </li>
              </>
            }
            <li className="nav-header">Аяллууд</li>
            {consultants.data && consultants.data.map((option,index) => (
              userCtx.userState.userId === option.adminId._id | userCtx.userState.role === 'admin' ? 
                <li key={index} className="nav-item">
                <Link to={`vacations/${option._id}`} className="nav-link">
                  <i className="nav-icon fas fa-user-alt" />
                  <p>{option.code}<span className="badge badge-info right">{option.totalVacation}</span></p>
                </Link>
              </li>:null
            ))}
            {userCtx.userState.role === 'admin' | userCtx.userState.role === 'operator' | userCtx.userState.role === 'manager' &&
              <>
                <li className="nav-header">Мэдээлэл</li>
                <li className="nav-item">
                  <Link to="about" className="nav-link">
                    <i className="nav-icon fas fa-users" />
                    <p>Бидний тухай</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="news" className="nav-link">
                    <i className="nav-icon fas fa-file" />
                    <p>Мэдээлэл</p>
                  </Link>
                </li>
                <li className="nav-header">Бусад</li>
                <li className="nav-item">
                  <Link to="comment" className="nav-link">
                    <i className="nav-icon fas fa-comments" />
                    <p>Сэтгэгдэл</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="blog" className="nav-link">
                    <i className="nav-icon fas fa-file" />
                    <p>Блог</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="faq" className="nav-link">
                    <i className="nav-icon fas fa-file" />
                    <p>Асуулт хариулт</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="totalGallery" className="nav-link">
                    <i className="nav-icon fas fa-image" />
                    <p>Тотал альбом</p>
                  </Link>
                </li>
              </>
            }
            {userCtx.userState.role === 'admin' | userCtx.userState.role === 'consultant' | userCtx.userState.role === 'manager' &&
              <li className="nav-item">
                  <Link to="totalPriceSendMail" className="nav-link">
                    <i className="nav-icon fas fa-file" />
                    <p>Үнийн санал</p>
                  </Link>
              </li>
            }
          </ul>
        </nav>
        {/* /.sidebar-menu */}
      </div>
      {/* /.sidebar */}
      </aside>
      <aside className="control-sidebar control-sidebar-dark">
      {/* Control sidebar content goes here */}
      </aside>
    </>
  )
}
