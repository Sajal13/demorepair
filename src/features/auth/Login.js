import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SyncLoader } from "react-spinners";

import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import useTitle from '../../hooks/useTitle'
import usePersist from "../../hooks/usePersist";

const Login = () =>{
  useTitle('Login')
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [persist, setPersist] = usePersist()

  const [
    login,
    {
      isLoading
    }
  ] = useLoginMutation();

  useEffect(()=>{
    userRef.current.focus()
  }, []);

  useEffect(()=>{
    setErrMsg('')
  }, [username, password]);

  const handleSubmit = async (e) =>{
    e.preventDefault();
    
    try{
      const { accessToken } = await login({
        username,
        password
      }).unwrap();
      
      dispatch(setCredentials({ 
        accessToken 
      }));
      
      setUsername('');
      setPassword('');
      
      navigate('/dash')
    }catch(err){
      if(!err.status){
        setErrMsg('No Server Response');
      }else if(err.status === 400){
        setErrMsg('Missing username or Password');
      }else if(err.status === 401){
        setErrMsg('Unauthorized');
      }else{
        setErrMsg(err.data?.message);
      }

      errRef.current.focus();
    }
  }

  const onUsernameChange = (e) =>{
    setUsername(e.target.value)
  }
  const onPasswordChange = (e) =>{
    setPassword(e.target.value)
  }
  const onToggle = () => {
    setPersist(prev => !prev)
  }

  const errClass = errMsg ? 'errMsg' : 'offScreen';
  
  if(isLoading) {
    return <SyncLoader color={"#FFF"} />
  }

  return(
    <>
      <section className="public">
        <header>
          <h1>Employee Login</h1>
        </header>

        <main className="login">
          <p 
            ref={errRef} 
            className={errClass}
            aria-live='assertive'
          >
            {errMsg}
          </p>

          <form
            className="form"
            onSubmit={handleSubmit}
          >
            <label htmlFor="username">
              User Name:
            </label>
            <input
              className="form__input"
              type={'text'}
              id='userrname'
              ref={userRef}
              value={username}
              onChange={onUsernameChange}
              autoComplete='off'
              required
            />

            <label htmlFor="password">
              Password:
            </label>
            <input
              className="form__input"
              type={'password'}
              id='password'
              value={password}
              onChange={onPasswordChange}
              required
            />

            <button 
              className="form__submit-button"
            >
              Sign In
            </button>

            <label 
              className="form__persist"
              htmlFor="persist"
            >
              <input
                type={'checkbox'}
                className='form__checkbox'
                id="persist"
                onChange={onToggle}
                checked={persist}
              />
              Trust This Device
            </label>
          </form>
        </main>
        
        <footer>
          <Link to={'/'}>
            Back to Home
          </Link>
        </footer>
      </section>
    </>
  )
}

export default Login;