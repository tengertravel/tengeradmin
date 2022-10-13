import React, { Suspense, useContext, useEffect } from 'react'
import { BrowserRouter, Route, Routes,Navigate }  from "react-router-dom";
import Home from './page/Home';
import Login from './page/Login';

import Footer from './components/Footer';
import Header from './components/Header';
import Menu from './components/Menu';
import Logout from './components/Logout';
import UserContext from './context/UserContext';
import { VacationStore } from './context/VacationContext';

import Admin from './page/users/Admin';
import Guide from './page/users/Guide';
import Users from './page/users/Users';
import UserPassword from './page/users/UserPassword';

import Vacations from './page/trip/Vacations';
import VacationForm from './page/trip/VacationForm';
import VacationDate from './page/trip/VacationDate';
import VacationPrice from './page/trip/VacationPrice';
import VacationProvide from './page/trip/VacationProvide';
import VacationImage from './page/trip/VacationImage';
import About from './page/about/About';
import News from './page/news/News';
import FormNews from './components/news/FormNews';
import NewsPhoto from './components/news/NewsPhoto';
import Blog from './page/blog/Blog';
import BlogList from './page/blog/BlogList';
import BlogPhoto from './components/blog/BlogPhoto';
import Comment from './page/comment/Comment';
import CommentForm from './components/comment/CommentForm';
import NewsComment from './components/news/NewsComment';
import BlogComment from './components/blog/BlogComment';
import VacationComment from './page/trip/VacationComment';
import Faq from './page/faq/Faq';
import FaqForm from './page/faq/FaqForm';
import TotalGallery from './page/totalGallery/TotalGallery';
import Meneger from './page/users/Meneger';
import Profile from './page/profile/Profile';
import TotalPriceSendMail from './page/totalPriceSendMail/TotalPriceSendMail';
import VacationOrder from './page/trip/VacationOrder';

// const Admin = React.lazy(()=>{return import('./page/Admin');})
// const Users = React.lazy(()=>{return import('./page/Users');})
// const Adminform = React.lazy(()=>{return import('./page/Adminform');})
// const Userform = React.lazy(()=>{return import('./page/Userform');})
// const UserPassword = React.lazy(()=>{return import('./page/UserPassword');})

export default function App () {
  const userCtx = useContext(UserContext);
  useEffect(()=>{
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    const firstName = localStorage.getItem('firstName');
    if(token&&userId){
      userCtx.loginSucess(token,userId,role,firstName);
    }
  },[])
  
  return (
  <BrowserRouter>
    <Suspense fallback={<div>Түр хүлээнэ үү....</div>}>
      { userCtx.userState.userId ? (
        <>
          <Header/><Menu/>
          <VacationStore>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/profile" element={<Profile />} />
              <Route exact path="/admin" element={<Admin />} />
              <Route exact path="/meneger" element={<Meneger />} />
              <Route exact path="/guide" element={<Guide />} />
              <Route exact path="/users" element={<Users />} />
              <Route exact path="/userpassword/:id" element={<UserPassword />} />
              <Route exact path="/logout" element={<Logout />} />
              <Route exact path="/vacations/:id" element={<Vacations />} />
              <Route exact path="/vacationform" element={<VacationForm />} />
              <Route exact path="/vacationform/:id" element={<VacationForm />} />
              <Route exact path="/vacationDate/:id" element={<VacationDate />} />
              <Route exact path="/vacationPrice/:id" element={<VacationPrice />} />
              <Route exact path="/VacationProvide/:id" element={<VacationProvide />} />
              <Route exact path="/vacationImages/:id" element={<VacationImage />} />
              <Route exact path="/vacationComment/:id" element={<VacationComment />} />
              <Route exact path="/about" element={<About />} />
              <Route exact path="/news" element={<News />} />
              <Route exact path="/newscomment/:id" element={<NewsComment />} />
              <Route exact path="/newsform" element={<FormNews />} />
              <Route exact path="/newsform/:id" element={<FormNews />} />
              <Route exact path="/newsimages/:id" element={<NewsPhoto />} />
              <Route exact path="/blog" element={<Blog/>} />
              <Route exact path="/bloglist/:id" element={<BlogList/>} />
              <Route exact path="/blogcomment/:id" element={<BlogComment/>} />
              <Route exact path="/blogimages/:id" element={<BlogPhoto/>} />
              <Route exact path="/comment" element={<Comment/>} />
              <Route exact path="/commentForm" element={<CommentForm/>} />
              <Route exact path="/commentForm/:id" element={<CommentForm/>} />
              <Route exact path="/faq" element={<Faq/>} />
              <Route exact path="/faqForm" element={<FaqForm/>} />
              <Route exact path="/faqForm/:id" element={<FaqForm/>} />
              <Route exact path="/totalGallery" element={<TotalGallery/>} />
              <Route exact path="/totalPriceSendMail" element={<TotalPriceSendMail/>} />
              <Route exact path="/vacationOrder" element={<VacationOrder/>} />
              <Route path="*" element={<Navigate to="/" replace />}/>
            </Routes>
          </VacationStore>
          <Footer/>
        </>
      ):(
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />}/>
        </Routes>
      )}
    </Suspense>
  </BrowserRouter>
  )
}

