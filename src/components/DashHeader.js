import React,{useEffect} from 'react';
import {useNavigate, Link, useLocation } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
   faFileCirclePlus,
   faFilePen,
   faUserGear,
   faUserPlus,
  faRightFromBracket 
} from '@fortawesome/free-solid-svg-icons';

import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import useAuth from '../hooks/useAuth';

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isManager, isAdmin} = useAuth();
  let dashClass = null;
  let newNoteButton, newUserButton, userButton, notesButton = null;
  let buttonContent;

  const [
    sendLogout,
    {
      isLoading,
      isSuccess,
      isError,
      error
    }
  ] = useSendLogoutMutation();

  useEffect(()=>{
    if(isSuccess){
      navigate('/')
    }
  },[isSuccess, navigate]);

  const onNewNoteClick = () =>{
    navigate('/dash/notes/new');
  }
  const onNewUserClick = () =>{
    navigate('/dash/users/new');
  }
  const onNoteClick = () =>{
    navigate('/dash/notes');
  }
  const onUserClick = () => {
    navigate('/dash/users');
  }

  if(!DASH_REGEX.test(pathname) && !NOTES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)){
    dashClass = 'dash-header__container--small'
  }

  if (NOTES_REGEX.test(pathname)){
    newNoteButton = (
      <button 
        className='icon-button'
        title='New Note'
        onClick={onNewNoteClick}
      >
        <FontAwesomeIcon icon={faFileCirclePlus} />
      </button>
    )
  }

  if(USERS_REGEX.test(pathname)){
    newUserButton = (
      <button
        className='icon-button'
        title='New User'
        onClick={onNewUserClick}
      >
        <FontAwesomeIcon icon={faUserPlus} />
      </button>
    )
  }
  if(isManager || isAdmin) {
    if(!USERS_REGEX.test(pathname) && pathname.includes('/dash')){
      userButton = (
        <button 
          className='icon-button'
          title='Users'
          onClick={onUserClick}
        >
          <FontAwesomeIcon icon={faUserGear} />
        </button>
      )
    }
  }
  if(!NOTES_REGEX.test(pathname) && pathname.includes('/dash')){
    notesButton = (
      <button
        className='icon-button'
        title='Notes'
        onClick={onNoteClick}
      >
        <FontAwesomeIcon icon={faFilePen} />
      </button>
    )
  }

  const errClass = isError ? 'errmsg' : 'offscreen';

  if(isLoading){
    buttonContent = <SyncLoader color={'#FFF'} />
  }else {
    buttonContent = (
      <>
        {newNoteButton}
        {newUserButton}
        {notesButton}
        {userButton}
      </>
    )
  }
  
  return (
    <>
      <p className={errClass}>
        {error?.data?.message}
      </p>

      <header className='dash-header'>
        <div className={`dash-header__container ${dashClass}`}>
            <Link to={'/dash'}>
                <h1 className='dash-header__title'>
                    techNotes
                </h1>
            </Link>
            <nav className='dash-header__nav'>
              {buttonContent}
              {
                <button 
                  className='icon-button'
                  title='Logout'
                  onClick={sendLogout}
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </button>
              }
            </nav>
        </div>
      </header>
    </>
  )
}

export default DashHeader;
