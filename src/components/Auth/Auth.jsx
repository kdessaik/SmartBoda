import React from 'react'
import '../App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { faCheck, faTimes,faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState, useEffect } from 'react'

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export function Auth() {






  return (
    <>
      <form>
        <div className="mb-3">
          <label for="exampleInputEmail1" className="form-label">Email address</label>
          <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label for="exampleInputPassword1" className="form-label">Password</label>
          <input type="password" className="form-control" id="exampleInputPassword1" />
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="exampleCheck1" />
          <label className="form-check-label" for="exampleCheck1">Check me out</label>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>

    </>
  )
}



export function Register() {
  const userRef = userRef();
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
  useEffect(() => {
    userRef.current.focus();

  }, [])

  useEffect(() => {
    const result = USER_REGEX.test(user);
    console.log(result);
    console.log(user);
    setValiName(user);
  }, [user])

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    console.log(result);
    console.log(pwd)
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd])


  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd])



  return (
    <section>
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live='assertive' >{errMsg}</p>
      <form>
        <div className="col">
          <div className="row">
            <label htmlFor="username">
              Username:
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





          </div><br />
          <div className="row">
            <input type="password" className="form-control" placeholder="Password" />
          </div><br />
          <div className="row">
            <input type="password" className="form-control" placeholder="Confirm Password" />
          </div><br />
          <button type="submit" className="btn btn-primary">Signup</button>


        </div>
      </form>
    </section>

  )
}

