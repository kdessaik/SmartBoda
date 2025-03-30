import React from 'react'
import '../../assets/style/auth.css'

import { faCheck, faTimes,faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState, useEffect } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../../api/axios'
import { useAuth } from '../Others/AuthContext'
import signupGoogleImage from '../../assets/image/icons/signup.png'
import {doSignUpWithGoogle} from '../Others/AuthContext'

import { useNavigate } from 'react-router';
import { Link } from 'react-router';

const USER_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const REGISTER_URL='/register'










function Register() {
    
    const userRef = useRef();
    const errRef = useRef()
  
    const [user, setUser] = useState('')
    const [validName, setValiName] = useState(false)
    const [userFocus, setUserFocus] = useState(false)
  
    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);
  
    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);
  
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [typePassword,setTypePassword]=useState('password')
    const [DisableSubmit,setDisableSubmit]=useState(false)

    const navigate=useNavigate()

  
   

    

    useEffect(() => {
      userRef.current.focus();
      
  
    }, [])
  
    useEffect(() => {
      const result = USER_REGEX.test(user);
      
      setValiName(user);
    }, [user])
  
    useEffect(() => {
        const result=PWD_REGEX.test(pwd)
      
      
      setValidPwd(result)
      const match=pwd ===matchPwd
      setValidMatch(match);
    }, [pwd, matchPwd])
  
  
    useEffect(() => {
      setErrMsg('');
    }, [user, pwd, matchPwd])

   



   const changeType=()=>{
    if(typePassword=='password'){
        setTypePassword('text')

    }
    else if(typePassword=='text'){
        setTypePassword('password')


    }
}
const {signup}=useAuth()
      
    const handleSubmit=async (e)=>{
        e.preventDefault();
        const v1=USER_REGEX.test(user);
        const v2=PWD_REGEX.test(pwd);
        if(!v1||!v2){
            setErrMsg('Invalid entry');
            return;
    };


    try{
      await  signup(user,pwd)
      setDisableSubmit(true)
      navigate('/Dashboard')
    
         

    }catch(err){
        console.log(err)
        if (!err.response){
            setErrMsg('No server Response')

        } else if(err.response?.status===409){
            setErrMsg('Username taken')
        } else{
            setErrMsg('Registration Failed')
        }
        errRef.current.focus()

    }
     
    }
    const handleSubmitGoogleSignUp=async (e)=>{
        
        try{
            await  doSignUpWithGoogle()
            setDisableSubmit(true)
            navigate('/Dashboard')
            
            
           
          
               
      
          }catch(err){
            console.log(err)
              if (!err.response){
                  setErrMsg('No server Response')
      
              } else if(err.response?.status===409){
                  setErrMsg('Username taken')
              } else{
                  setErrMsg('Registration Failed')
              }
              errRef.current.focus()
      
          }


    }

  
  
    return (
        <>
        {success ? (
            <section>
                <h1>Success!</h1>
                <p>
                    <a href="#">Sign In</a>
                </p>
            </section>
        ) : (
            <section>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Register</h1>
                <form  className="form-row" onSubmit={handleSubmit}>
                    <label htmlFor="username">
                        Email:
                        <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                        aria-invalid={validName ? "false" : "true"}
                        aria-describedby="uidnote"
                        onFocus={() => setUserFocus(true)}
                        onBlur={() => setUserFocus(false)}
                    />
                    <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        4 to 24 characters.<br />
                        Must begin with a letter.<br />
                        Letters, numbers, underscores, hyphens allowed.
                    </p>


                    <label htmlFor="password">
                        Password:
                        <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                    </label>
                    <input
                        type={typePassword}
                        className="form-control"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                        aria-invalid={validPwd ? "false" : "true"}
                        aria-describedby="pwdnote"
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                    />
                    <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        8 to 24 characters.<br />
                        Must include uppercase and lowercase letters, a number and a special character.<br />
                        Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                    </p>


                    <label htmlFor="confirm_pwd">
                        Confirm Password:
                        <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                    </label>
                    <input
                        type={typePassword}
                        className="form-control"
                        id="confirm_pwd"
                        onChange={(e) => setMatchPwd(e.target.value)}
                        value={matchPwd}
                        required
                        aria-invalid={validMatch ? "false" : "true"}
                        aria-describedby="confirmnote"
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                    />
                    <label htmlFor="">Show password</label>
                    <input type="checkbox"
                    data-val="true"
                    value='true'
                      onClick={changeType}
                      className="form-check-input"

                      
                    
                    />
                    <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the first password input field.
                    </p>

                    <button className="btn btn-primary"  disabled={!validName || !validPwd || !validMatch || DisableSubmit ?  true : false}>Sign Up</button>

                </form>
                <span>
                    <p>Or</p>
                     <img src={signupGoogleImage} alt="Signup with Google" className='signupImg' onClick={handleSubmitGoogleSignUp} />
                </span><br/>
                <p>
                    Already registered?<br />
                    <span className="line">
                       
                       <Link to='/Login'>Sign In</Link>  
                    </span>
                </p>
            </section>
        )}
    </>
  
    )
}

export default Register